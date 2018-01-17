/**
 * Created by glzc on 2018/1/16.
 */
module.exports = {
    dev: {
        port: 8989,
        dbUrl: 'mongodb://localhost:27017/demo',
        session: {
            name: 'SID',
            secret: 'SID',
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            }
        }
    }
}