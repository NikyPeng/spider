/**
 * Created by glzc on 2018/1/16.
 */
const usersCon = require('./../controller/usersCon');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/register', usersCon.register);

userRouter.post('/login', usersCon.login);

module.exports = userRouter;