const assert = require('assert');
const Models = require('../models')

describe('models should be able to', function(){

  var models = Models("mongodb://localhost/greetings");

  beforeEach(function(done){
      models.Name.remove({}, function(err){
          done(err);
      })
  })
  it('store Names to MongoDB', function(done){

    var nameData = { name : 'The Name Test'};
    models.Name
        .create(nameData, function(err){
            done(err);

            models.Name.find({ name : 'The test name'}, function(err, name){
                assert.equal(1, names.length);
                done(err);
            });
        });

  })
});
