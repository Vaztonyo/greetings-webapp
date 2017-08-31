const mongoose = require('mongoose');

module.exports = function(mongoUrl){
    mongoose.connect(mongoUrl);

    const NameSchema = mongoose.Schema({name : String});
    NameSchema.index({name : 1}, {unique : true});

    const Name = mongoose.model('Name', NameSchema);

    return{
      Name
    };
}
