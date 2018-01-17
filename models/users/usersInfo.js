/**
 * Created by glzc on 2018/1/17.
 */
const mongoose = require('mongoose');

const usersInfoSch = mongoose.Schema({
    sex: Number,                                 //0-male  1-female
    age: Number,
    address: String,
    birthday: String,
    create_time: Date,
    update_time: Date,
});

const UserInfo = mongoose.model('UserInfo', usersInfoSch);


module.exports = UserInfo;