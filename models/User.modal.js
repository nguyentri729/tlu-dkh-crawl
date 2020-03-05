const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String, // String is shorthand for {type: String}
  password: String,
  studentCode: String,
  studentName: String,
  studentClass: String,
  studentMajors: String,
  yearLearn: String
});

userSchema.method('addUser', function() {
   // console.log('add User !!!')
    return this.model('User').create({
        username: 'true',
        password: 'true'
    })
    return 'ok'
})
const User = mongoose.model('User', userSchema);


module.exports = new User
