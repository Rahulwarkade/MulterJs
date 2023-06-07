var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/multerdb');

var userSchema = mongoose.Schema(
  {
    username : String,
    password : String,
    image : String,
  }
)

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);
