# **eComm API Gateway**

Simple API gateway, handling authentication via Facebook passportjs with Node.js.

## **Main Dependencies**

 - `express`
 - `body-parser`
 - `express-session`
 - `cookie-parser`
 - `serve-static`
 - `connect-ensure-login`
 - `passport`, `passport-facebook`
 - `next`, `react`, `redux`

## **Facebook Passport**

### **Set Facebook strategy to passport**

```js

const FacebookStrategy = require('passport-facebook').Strategy;

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

### **Configure Passport authenticated session persistence**

```js
passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});
```

### **Prepare passport session**

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

## **Dockerize**

### **Build process** 

 1. Update `apk` on `node:12.16.1-alpine3.9`
 2. Set `--no-cache` 
 3. Install `openssl`, `tzdata`
 4. Set time zone to `Asia/Bangkok`
 5. Install service dependencies via `npm` 

### **Build an image**

```bash
$ docker build -t patharanor/api-ecomm-gateway:SPECIAL_TAG .
```
### **Environment**

 - `FACEBOOK_APP_ID` - client ID of your Facebook App
 - `FACEBOOK_APP_SECRET` - client secret of your Facebook App
 - `HOST` - host/instance that provides the service
 - `PORT` - port number of the service
 - `SESSION_SECRET_KEY` - any word

### **Run the image**

Bind port to outsite(left) via port number `3000`.

```bash
$ docker run \
-p 3000:3000 \
-e FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID \
-e FACEBOOK_APP_SECRET=YOUR_FACEBOOK_APP_SECRET \
-e HOST=YOUR_HOST \
-e PORT=3000 \
-e SESSION_SECRET_KEY=YOUR_SESSION_SECRET_KEY \
patharanor/api-ecomm-gateway:SPECIAL_TAG
```

### **Push to DockerHub**

Login to DockerHub

```bash
$ docker login
```

Push it
```bash
$ docker push patharanor/api-ecomm-gateway:SPECIAL_TAG
```

## **License**

MIT