/**
 * Created by glzc on 2018/1/17.
 */
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    uuid: { type: String,unique: true },
    user_name: String,
    psw: String,
    mob_phone: String,
    create_time: Date,
    update_time: Date,
});
const Users = mongoose.model('Users', userSchema);


module.exports = Users;