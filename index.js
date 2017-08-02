var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var greetNames = {};

app.use(express.static('public'));


app.get('/greetings/:id', function(pers, res){
  if (greetNames[pers.params.id]) {
    greetNames[pers.params.id]++;
  }
  else {
    greetNames[pers.params.id] = 1;
  }
  res.send("<h2><u>Hello, " + pers.params.id);
});

app.get('/greeted', function(pers, res){
  var namesGreeted = [];
  for(id in greetNames){
    namesGreeted.push(id);
  }
  res.send("Names Greeted:  " + namesGreeted);
});

app.get('/counter/:id', function(pers, res){
  var count = greetNames[pers.params.id];
      res.send("Hello,  " + pers.params.id + " has been greeted " + count + " time(s).");
});

var server = app.listen(3000, function() {

 var host = server.address().address;
 var port = server.address().port;

 console.log('Example app listening at http://%s:%s', host, port);

});
