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

userSchema.method('addUser', async function(data) {
    let UserModel = this.model('User')
   
    await UserModel.updateOne({username: data.username}, data, {upsert: true})
    return await UserModel.findOne({username: data.username}, {password: 0 ,__v: 0, username: 0})
})
userSchema.method('findUser', async function(id) {
    let UserModel = this.model('User')
    return await UserModel.findById(id)
})
const User = mongoose.model('User', userSchema);


module.exports = new User
