/**
 * Created by glzc on 2018/1/17.
 */
const userRouter = require('./userRouter');
module.exports = (app) => {
    app.use('/api', userRouter);
}