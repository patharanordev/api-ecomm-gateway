const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
const cslg = require('connect-ensure-login');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const dev = process.env.NODE_ENV !== 'production';
if(dev) {   
    require('dotenv').config()
}

const port = process.env.PORT || 3000;

const { sequelize, models } = require('./sequelize/db-handler');

// Set passport strategy
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.HOST}/auth/facebook/callback`, 
        enableProof: true
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log('Access token : ', accessToken);
        console.log('Refresh token : ', refreshToken);
        console.log('Profile : ', profile);
        // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
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
        case 'product_a': modelName = 'Product_A'; break;
        case 'product_b': modelName = 'Product_B'; break;
        case 'product_c': modelName = 'Product_C'; break;
        case 'product_categories': modelName = 'ProductCategories'; break;
        default: break;
    }
    return modelName ? models[modelName] : null;
};

app.prepare()
.then(() => {

    // Config middleware
    const server = express();

    // app.use(cors())
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(cookieParser());

    // Create session
    server.use(session({ secret: process.env.SESSION_SECRET_KEY, resave: true, saveUninitialized: true }));

    // Provide static file by searching in multi-directory
    server.use('/static', serveStatic(path.join(__dirname, 'rawdata')))
    server.use('/static', serveStatic(path.join(__dirname, 'public')))

    // Prepare passport session
    server.use(passport.initialize());
    server.use(passport.session());

    server.post('/api/v1/:name', (req, res) => {
        const theModel = modelNameMapping(req.params.name);
        if(theModel) {
            if(req.body && req.body.method) {
                switch(req.body.method) {
                    case 'select': responseHandler(theModel.get(req.body.condition), `/api/v1/${req.params.name}`, res); break;
                    case 'create': responseHandler(theModel.add(req.body.data), `/api/v1/${req.params.name}`, res); break;
                    case 'delete': responseHandler(theModel.delete(req.body.id), `/api/v1/${req.params.name}`, res); break;
                    case 'drop': responseHandler(theModel.dropTable(), `/api/v1/${req.params.name}`, res); break;
                    case 'access': {
                        if(req.params.name) {
                            responseHandler(theModel.setLastAccess(req.body.id), `/api/v1/${req.params.name}`, res); 
                        } else {
                            res.status(400).json({ error:'The model does not support "access" method.', data:null })
                        }
                        break;
                    }
                    case 'clear': responseHandler(theModel.clearData(), `/api/v1/${req.params.name}`, res); break;
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

    // Define routes.
    // server.get('/', function(req, res) { res.render('home', { user: req.user }); });
    // server.get('/login', function(req, res){ res.render('login'); });
    server.get('/login/facebook', passport.authenticate('facebook'));
    server.get('/auth/facebook/callback',
        passport.authenticate('facebook', { 
            failureRedirect: '/login/facebook',
            successRedirect: '/dashboard'
        })
    );

    server.get('/return', 
        passport.authenticate('facebook', { failureRedirect: '/login' }), 
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
    server.get('/dashboard', cslg.ensureLoggedIn('/login/facebook'), (req, res) => {
        console.log('in get - user:', req.user);
        // return clientRouteHandler(req, res);
        
        return app.render(req, res, '/dashboard', { user:req.user })
    })

    // Allow server using routes handler from 'nextjs' app (client)
    server.use(clientRouteHandler);

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`Listening on port ${port}...`);
    });

});