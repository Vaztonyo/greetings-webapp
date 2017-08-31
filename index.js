'use strict';
//Require All Needed Modules
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

// const Models = require('./models');
//
// const models = Models('mongodb://localhost/greetings');

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
        name: greetedNames
    }
    res.render('greeted', data);
});

// app.get('/counter', function(req, res, next) {
//
//
//     res.render('counter');
// });


//create a post for the greetings page
app.post('/greetings', function(req, res, next) {
    var enteredName = {
        name: req.body.id
    };

    var lang = req.body.language;

    var message = "";
    var nameExist = false;

    if (lang === "english" && enteredName.name !== "") {
        message = "Hello, " + enteredName.name;
    } else if (lang === "afrikaans" && enteredName.name !== "") {
        message = "Goeie dag, " + enteredName.name;
    } else if (lang === "xhosa" && enteredName.name !== "") {
        message = "Molo, " + enteredName.name;
    } else if (enteredName.name === "") {
        req.flash('error', 'Please Enter a Name!');
    } else if (!lang) {
        req.flash('error', 'Please Choose a Language!');
    }

    // models.Name.create(enteredName, function(err, results){
    //     if(err){
    //     return next(err);
    //     }
    //     req.flash('error', 'Name Has Been Added!');
    // })

    var foundName = false;
    // console.log(greetedNames);
    for (var id in greetedNames) {
        var currentName = greetedNames[id];
        // console.log(currentName);

        var namesMatched = currentName.trim() === enteredName.name.trim();
        // console.log(namesMatched);

        if (namesMatched) {
            foundName = true;
            break;
        }
    }
    // console.log(foundName);
    if (!foundName && enteredName.name !== "" && lang) {
        greetedNames.push(enteredName.name);
        req.flash('error', 'Name Has Been Added!');
    } else if (foundName === true) {
        req.flash('error', ' Name already exists!');
    }

    // console.log(count);

    var data = {
        output: message,
        counter: greetedNames.length
    }
    res.render('greetings', data);
});

app.get('/', function(req, res) {
    res.redirect('/greetings');
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
