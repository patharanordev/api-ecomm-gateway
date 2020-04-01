# **API for Authentication with Facebook passport.js**

Providing Facebook authentication channel via OAuth2 protocol with Node.js.

## **Dependencies**

```js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
const cslg = require('connect-ensure-login');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
```

## **Facebook Passport**


**Set passport strategy**

```js
//...

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
```

**Configure Passport authenticated session persistence**

```js
passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});
```

**Prepare passport session**

```js
app.use(passport.initialize());
app.use(passport.session());
```

## **API**

**Create simple auth endpoint**

```js
app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);
app.get('/return', 
    passport.authenticate('facebook', { failureRedirect: '/login' }), 
    function(req, res) {
        res.redirect('/');
    }
);
app.get('/profile',
    cslg.ensureLoggedIn(),
    function(req, res){
        // "req" came from callback(cb) in FacebookStrategy
        res.render('profile', { user: req.user });
    }
);
```