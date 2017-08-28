'use strict';
//Require All Needed Modules
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');


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

var greetedNames = [];

app.get('/greetings', function(req, res, next) {
    res.render('greetings');
})

app.get('/greeted', function(req, res, next) {
  var data = {
    name : greetedNames
  }
    res.render('greeted', data);
});

app.get('/counter', function(req, res, next) {


    res.render('counter');
});


//create a post for the greetings page
app.post('/greetings', function(req, res, next) {
    var enteredName = req.body.id;
    var lang = req.body.language;
    var counter = req.body.counter;

    var message = "";
    var nameExist = false;

    if (lang === "english" && enteredName !== "") {
        message = "Hello, " + enteredName;
    } else if (lang === "afrikaans" && enteredName !== "") {
        message = "Goeie dag, " + enteredName;
    } else if(lang === "xhosa" && enteredName !== ""){
        message = "Molo, " + enteredName;
    }

    var foundName = false;
    // console.log(greetedNames);
    for (var id in greetedNames) {
        var currentName = greetedNames[id];
        // console.log(currentName);

        var namesMatched = currentName.trim() === enteredName.trim();
        // console.log(namesMatched);

        if (namesMatched) {
            foundName = true;
            break;
        }
    }
    // console.log(foundName);
    if (!foundName && enteredName !== "" && lang) {
        greetedNames.push(enteredName);
    }

    else {
      req.flash('error', 'Name already exists!');
    }

    // console.log(count);

    var data = {
        output: message,
        counter: greetedNames.length
    }
    res.render('greetings', data);
});

// app.post('/greeted', function(req, res, next) {
// //  console.log(res);
//     // var greetedNam = req.body.greetedNam;
//     // console.log(greetedNam);
//     //
//     // var namesGreeted = [];
//     //
//     // for (id in greetedNames){
//     //   namesGreeted.push(greetedNames);
//     // }
//     // console.log(namesGreeted);
//     // var data1 = {
//     //     greetedNam: greetedNames
//     // }
// //var greetedNames =['Test1','Test2'];
//
//     res.render('greeted');
// });

// app.post('/counter', function(req, res, next) {
//     var count = greetedNames[req.params.id];
//     res.render("Hello,  " + req.params.id + " has been greeted " + count + " time(s).");
// });

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
