'use strict';
//Require All Needed Modules
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

const Models = require('./models');

const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/greetings";

const models = Models(mongoURL);

var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}))

app.use(flash());

app.engine('handlebars', exphbs({ // set the app engine to handlebars
    defaultLayout: 'main' // set the default layout to main
}));
app.set('view engine', 'handlebars');

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ //use body-parser
    extended: false
}));

app.use(express.static('public')); //use static and set it to public
app.use(express.static('views')); //use static views

var format = require('util').format;

var sessionNames = [];
var counter = 0;

const NamesGreeted = models.Name;

app.get('/', function(req, res, next) {

  NamesGreeted.distinct('name', function(err, results){
    if (sessionNames[0] !== undefined){
      var lastName = sessionNames.length - 1;
      var namesForGreetingb = sessionNames[lastName].name;
    };
    counter = results.length;
    res.render('greetings', {
      count : counter
      });
    });
});

app.get('/greeted', function(req, res, next) {
    models.Name.find({}, function(err, greetings){
      if (err){
        return next(err);
      }
      res.render('greeted', {greetings});
    });
});

app.get('/greeted/:name', function(req, res, next) {
  NamesGreeted.findOne({
    name: req.params.name
  }, function(err, greetings){
    if (err) {
      return next(err);
    } else {
      if (greetings) {
        var resultOfSearchedName = 'Hi, ' + greetings.name + ". You have been greeted " + greetings.individualCount + ' time(s).'
      } else {
        var resultOfSearchedName = "Oops!, we don't know this person!"
      }
    }

    res.render('counter', {
      resultOfSearchedName
    });
  });
});


//create a post for the greetings page
app.post('/', function(req, res, next) {
    var enteredName = {
        name: req.body.id
    };

    sessionNames.push({enteredName});

    var submit = req.body.submitBtn;
    var reset = req.body.resetBtn;
    var lang = req.body.language;

    var message = "";
    var nameExist = false;

    var requiredVal = lang && enteredName.name !== "";

    if (lang === "english" && enteredName.name !== "") {
        message = "Hello, " + enteredName.name;
    } else if (lang === "afrikaans" && enteredName.name !== "") {
        message = "Goeie dag, " + enteredName.name;
    } else if (lang === "xhosa" && enteredName.name !== "") {
        message = "Molo, " + enteredName.name;
    } else if (enteredName.name === "" && submit) {
        req.flash('error', 'Please Enter a Name!');
    } else if (!lang && submit) {
        req.flash('error', 'Please Choose a Language!');
    }

    if (submit && requiredVal) {

    NamesGreeted.findOne({
      name: req.body.id
    }, function(err, searchName) {
      if (err) {
        return next(err)
      } else {
        if (!searchName && (req.body.id !== "")) {
          var newName = new NamesGreeted({
            name: req.body.id,
            individualCount: 1
          });
          newName.save(function(err, results) {
            if (err) {
              return next(err);
            }
            console.log('results', results);
          })
        } else {

          NamesGreeted.update({
            name: req.body.id
          }, {
            $inc: {
              individualCount: 1
            }
          }, function(err) {
            if (err) {}
          });
        }
      }
    });

  }

else  if (reset) {
    NamesGreeted.remove({}, function(err){
      if(err){
        return next(err);
      }
    });
  }
    models.Name.count(function(err, counter) {

    var data = {
        output: message,
        count : counter
    };
    res.render('greetings', data);
  });
});

app.get('/greetings', function(req, res) {
    res.redirect('/');
});

var server = app.listen(process.env.PORT || 5000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App starts at http://%s:%s', host, port);

});


//deploy using heroku

// if (greetedNames[req.params.id]) {
//     greetedNames[req.params.id]++;
// } else {
//     greetedNames[req.params.id] = 1;
// }
