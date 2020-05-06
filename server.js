const express = require('express');
const compression = require('compression');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
const cslg = require('connect-ensure-login');
const path = require('path');
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const dev = process.env.NODE_ENV !== 'production';
if(dev) {   
    require('dotenv').config()
}

const port = process.env.PORT || 3000;

const { sequelize, models } = require('./sequelize/db-handler');

// Set passport strategy
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL: `${process.env.HOST}/auth/google/callback`, 
        enableProof: true
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log('Access token : ', accessToken);
        console.log('Refresh token : ', refreshToken);
        console.log('Profile : ', profile);
        cb(null, profile)
    }
));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

const next = require('next');
const clientRoutes = require('./routes');
const app = next({ dev });
// const clientRouteHandler = clientRoutes.getRequestHandler(app, ({req, res, route, query}) => {
//     console.log('in handler - user:', req.user)
//     app.render(req, res, route.page, { user:req.user?req.user:null })
// });
const appRenderWithAuthHandler = (req, res) => {
    console.log('in get - user:', req.user);
    console.log('in get - base url :', req.path);
    return app.render(req, res, req.path, { user:req.user })
}

const clientRouteHandler = clientRoutes.getRequestHandler(app);
const responseHandler = (promise, endpoint, res) => {
    promise.then((response) => {
        console.log(`${endpoint} response : `, response);
        res.status(200).json({ error: null, data: response });
    }).catch((err) => {
        console.log(`${endpoint} error : `, err);
        res.status(400).json({ error: err, data: null });
    })
};

const modelNameMapping = (name) => {
    let modelName = null
    switch(name) {
        case 'user': modelName = 'User'; break;
        case 'payment': modelName = 'Payment'; break;
        case 'product_smartphone': modelName = 'ProductSmartphone'; break;
        case 'product_laptop': modelName = 'ProductLaptop'; break;
        case 'product_categories': modelName = 'ProductCategories'; break;
        default: break;
    }
    return modelName ? models[modelName] : null;
};

app.prepare()
.then(() => {

    // Config middleware
    const server = express();
    const pgPool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,

        // Config for Hiroku's server
        ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
            // It should use "CA" but Heroku has not "CA"
        },
        keepAlive: true
    });    

    // app.use(cors())
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(cookieParser());
    server.use(compression());

    // Create session
    server.use(session({ 
        store: new pgSession({
            pool : pgPool,                // Connection pool
            tableName : 'session'   // Use another table-name than the default "session" one
        }),
        secret: process.env.SESSION_SECRET_KEY, 
        resave: true, 
        saveUninitialized: true,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    }));

    // Provide static file by searching in multi-directory
    server.use('/static', serveStatic(path.join(__dirname, 'rawdata')))
    server.use('/static', serveStatic(path.join(__dirname, 'public')))
    server.use('/sw.js', serveStatic(path.join(__dirname, 'service-worker/sw.js')))

    // Prepare passport session
    server.use(passport.initialize());
    server.use(passport.session());

    server.post('/api/v1/:name', (req, res) => {
        const theModel = modelNameMapping(req.params.name);
        if(theModel) {
            if(req.body && req.body.method) {
                switch(req.body.method) {
                    case 'select': responseHandler(
                        theModel.get(
                            req.body.condition, 
                            req.body.options ? req.body.options : null
                        ), 
                        `/api/v1/${req.params.name}`
                        , res); 
                        break;
                    case 'create': responseHandler(theModel.add(req.body.data), `/api/v1/${req.params.name}`, res); break;
                    case 'delete': responseHandler(theModel.delete(req.body.id), `/api/v1/${req.params.name}`, res); break;
                    case 'drop': responseHandler(theModel.dropTable(), `/api/v1/${req.params.name}`, res); break;
                    case 'update': responseHandler(theModel.set(req.body.update), `/api/v1/${req.params.name}`, res); break;
                    case 'schema': responseHandler(theModel.modelSchema(), `/api/v1/${req.params.name}`, res); break;
                    case 'access': {
                        if(req.params.name) {
                            responseHandler(theModel.setLastAccess(req.body.id), `/api/v1/${req.params.name}`, res); 
                        } else {
                            res.status(400).json({ error:'The model does not support "access" method.', data:null })
                        }
                        break;
                    }
                    case 'clear': responseHandler(theModel.clearData(), `/api/v1/${req.params.name}`, res); break;
                    case 'sum': responseHandler(theModel.sumColumn(req.body.sum), `/api/v1/${req.params.name}`, res); break;
                    case 'order': responseHandler(theModel.getOrderItemBy(req.body.type, req.body.options), `/api/v1/${req.params.name}`, res); break;
                    case 'accounting': responseHandler(theModel.getDailyAccount(req.body.options), `/api/v1/${req.params.name}`, res); break;
                    default:
                        res.status(400).json({ error: 'Unknown your method', data: null });
                        break;
                }
            } else {
                res.status(400).json({ error: 'Unknown your method or has not request body.', data: null });
            }
        } else {
            res.status(400).json({ error: 'Not support the model name.', data: null });
        }
    });

    server.get('/login/google', 
        passport.authenticate('google', { 
            scope: [ 'https://www.googleapis.com/auth/plus.login',
                , 'https://www.googleapis.com/auth/plus.profile.emails.read' 
            ]
        })
    );
    server.get('/auth/google/callback',
        passport.authenticate('google', { 
            failureRedirect: '/login/google',
            successRedirect: '/dashboard'
        })
    );

    server.get('/return', 
        passport.authenticate('google', { failureRedirect: '/login' }), 
        function(req, res) {
            res.redirect('/');
        }
    );
    server.get('/profile', cslg.ensureLoggedIn(), function(req, res){
            // "req" came from callback(cb) in FacebookStrategy
            res.send(req.user);
        }
    );

    // Bring this statement to last-1 statement to receive page name
    // by refer to 'pages' directory.
    server.get('/dashboard', cslg.ensureLoggedIn('/login/google'), (req, res) => {
    // server.get('/dashboard', (req, res) => {
        console.log('in get - user:', req.user);
        // return clientRouteHandler(req, res);
        
        return app.render(req, res, '/dashboard', { user:req.user })
    })
  
    server.get('/gallery', cslg.ensureLoggedIn('/login/google'), appRenderWithAuthHandler)
    server.get('/import-product', cslg.ensureLoggedIn('/login/google'), appRenderWithAuthHandler)
    server.get('/order', cslg.ensureLoggedIn('/login/google'), appRenderWithAuthHandler)
    server.get('/simulate', cslg.ensureLoggedIn('/login/google'), appRenderWithAuthHandler)

    // Allow server using routes handler from 'nextjs' app (client)
    server.use(clientRouteHandler);

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`Listening on port ${port}...`);
    });

});