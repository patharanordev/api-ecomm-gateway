const express = require('express');
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

// Set passport strategy
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `http://localhost:${port}/auth/facebook/callback`
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
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
.then(() => {

    // Config middleware
    const server = express();

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

    // Define routes.
    // server.get('/', function(req, res) { res.render('home', { user: req.user }); });
    // server.get('/login', function(req, res){ res.render('login'); });
    server.get('/login/facebook', passport.authenticate('facebook'));
    server.get('/auth/facebook/callback',
        passport.authenticate('facebook', { 
            failureRedirect: '/login',
            successRedirect: '/profile'
        })
    );
    server.get('/return', 
        passport.authenticate('facebook', { failureRedirect: '/login' }), 
        function(req, res) {
            res.redirect('/');
        }
    );
    server.get('/profile',
        cslg.ensureLoggedIn(),
        function(req, res){
            // "req" came from callback(cb) in FacebookStrategy
            res.send(req.user);
        }
    );

    // Bring this statement to last-1 statement to receive page name
    // by refer to 'pages' directory.
    server.get('*', (req, res) => {
        return handle(req, res);
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`Listening on port ${port}...`);
    });

});