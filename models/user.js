//Schema for User in AirBNB

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
    //username, password is auto added by 'passport-local-mongoose' plugin
})

//setting the plugin
userSchema.plugin(passportLocalMongoose);

//creating model
User = mongoose.model('User',userSchema);

module.exports = User;