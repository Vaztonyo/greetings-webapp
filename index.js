'use strict';
//***************Require All Needed Modules***************
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

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


var greetedNames = [];
var count = 0;

app.get('/greetings', function(req, res, next) {
  res.render('greetings');
})

app.get('/greeted', function(req, res, next) {
    res.render('greeted');
  });

app.get('/counter', function(req, res, next) {
    res.render('counter');
  });

app.post('/greetings', function(req, res, next){
  var id = req.body.id;
  var lang = req.body.language;
  var counter = req.body.counter;

  var message = "";

  if(lang === "english"){
    message = "Hello, " + id;
  }
  else if(lang === "afrikaans"){
    message = "Goeie dag, " + id;
  }
  else{
    message = "Molo, " + id;
  }
  if (id !== "" && lang) {
    // greetedNames.push(id);
    var  greetMessage = message;
  }

  var nameExist = false;
  for(id in greetedNames){
    var nameFound = greetedNames[id];
    if(nameFound === id){
      nameExist = true;
      break;
    }
  }
    if (!nameExist) {
      greetedNames.push(id);
    }
    if (nameExist === false) {
      count++;
    }
    else if(nameExist === true){
      ;
    }

console.log(count);

var data = {
  output: greetMessage,
  counter: count
}
  res.render('greetings', data);
});

app.post('/greeted', function(req, res, next) {
  var greetedN = req.body.greetedN;

    var namesGreeted = [];
    for (id in greetedNames) {
      // if (greetedNames[req.params.id]) {
      //     greetedNames[req.params.id]++;
      // } else {
      //     greetedNames[req.params.id] = 1;
      // }
        namesGreeted.push(id);
    }
    console.log(namesGreeted);
var data1 = {
  greetedN : namesGreeted
}
    res.render('greeted',data1);
});

app.post('/counter', function(req, res, next) {
    var count = greetedNames[req.params.id];
    res.render("Hello,  " + req.params.id + " has been greeted " + count + " time(s).");
});

var server = app.listen(5500, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);

});


// if (greetedNames[req.params.id]) {
//     greetedNames[req.params.id]++;
// } else {
//     greetedNames[req.params.id] = 1;
// }
