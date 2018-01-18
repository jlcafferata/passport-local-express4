var express = require('express');
var passport = require('passport');
var Account = require('../models/account'); 
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/


function customCallbackAuthentification(strategy, req, res, next) {
    /*passport.authenticate(strategy, function loginCustomCallback(err, user, info) {
        if (err) {
            return res.redirect('/loginFailure');
        }

        if (!user) {
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {
            if (err) { return res.redirect('/loginFailure'); }
        });

        var redirectURL = '/loginSuccess';
        if (req.session.redirectURL) {
            redirectURL = req.session.redirectURL;
            console.log('REDIRECT UTL: '+redirectURL);
            req.session.redirectURL = null;
            return res.redirect(redirectURL);
        } else {
            redirectSubdomain(req, res);
        }

    })(req, res, next);*/
   // passport.authenticate('google', { scope : ['profile', 'email'] }));
};

function redirectSubdomain (req, res) {
   /* var domain = config.system.DOMAIN_BASE;
    console.dir(req.session);
  if (req.session.subdomain !== '') {
    domain = req.session.subdomain + '.' + domain;
   
    console.log("REDIRECT TO: "+domain);
    res.redirect('http://' + domain );
  } else {
      res.redirect('/');

    }*/
};

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res){
	res.render('register', {});
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local', { 
  successRedirect: '/loginSuccess',
  failureRedirect: '/loginFailure'
}));

router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

router.get('/loginSuccess', function(req, res, next) {
    console.log(res);
  res.send('Successfully authenticated' + res);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
