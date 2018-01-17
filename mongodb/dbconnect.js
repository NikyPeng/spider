/**
 * Created by glzc on 2018/1/17.
 */
const mongoose = require('mongoose');
const config = require('./../config/index');
const chalk = require('chalk');

mongoose.connect(config.dev.dbUrl, {useMongoClient: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
    console.log(chalk.green('连接数据库成功'));
});

db.on('error', (error) => {
    console.error(chalk.red('Error in MongoDb connection:' + error));
    mongoose.disconnect()
});

db.on('close', () => {
    console.log(chalk.blue('数据库断开，重新连接数据库'));
    mongoose.connect(config.dev.dbUrl, {server: {auto_reconnect:true}})
});

module.exports = db;