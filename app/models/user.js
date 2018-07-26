var mongoose = require('mongoose');
var bcrypt =  require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var userSchema = new Schema({

    userName:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    associateID:{type:Number, required:true, unique:true}
});

userSchema.pre('save', function(next) {

    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {

        if(err) return next(err);
        user.password=hash; // Store hash in your password DB.
        next();
    });
  });

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User',userSchema);