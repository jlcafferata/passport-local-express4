// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const bluebird = require('bluebird');
var mongoose = require('mongoose');
var _ = require('underscore');
var fetch = require('node-fetch');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

const url = 'http://www.mocky.io/v2/5808862710000087232b75ac';

/*

fetch(url)
  .then((resp) => resp.json())
  .then(function(data) {
    let clients = data.results;
    return authors.map(function(author) {
      let li = createNode('li'),
          img = createNode('img'),
          span = createNode('span');
      img.src = author.picture.medium;
      span.innerHTML = `${author.name.first} ${author.name.last}`;
      append(li, img);
      append(li, span);
      append(ul, li);
    })
  })
  .catch(function(error) {
    console.log(error);
  }); 
*/

var app = express();

passport.use(new LocalStrategy(function(username, password, done) { 
  let data = {
    name: username,
    email: password
  };
  // The parameters we are gonna pass to the fetch function
  let fetchData = { 
      method: 'POST', 
      body: data
  };
  
  fetch(url, fetchData)
    .then(function(res) {
        done(null, res);
       // return res.json();
    })/*.then(function(json) {
        console.log(json);
        done(null, json.clients[0]);
    })*/;
/*
  if (username === 'foo' && password === 'bar')
  {
    done(null, { user: username });
  }
  else
  {
    done(null, false);
  }*/
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null,user);
});
/*
passport.serializeUser(function(user, done) { 
  // please read the Passport documentation on how to implement this. We're now
  // just serializing the entire 'user' object. It would be more sane to serialize
  // just the unique user-id, so you can retrieve the user object from the database
  // in .deserializeUser().
  console.log('serialize'  + user.name);
  done(null, user);
});

passport.deserializeUser(function(user, done) { 
  // Again, read the documentation.
  console.log('deserialize' + user.name);
  done(null, user);
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(router);
app.use('/', routes);

// passport config
//var Account = require('./models/account');



// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4', { useMongoClient: true });

mongoose.Promise = bluebird;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
