var express = require('express');
var app = express();


app.get('/greetings/:id', function(pers, res){
  console.log(pers.params.id);
  res.send("Hello, " + pers.params.id);
});




var server = app.listen(3000, function() {

 var host = server.address().address;
 var port = server.address().port;

 console.log('Example app listening at http://%s:%s', host, port);

});
