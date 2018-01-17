/**
 * Created by glzc on 2017/10/30.
 */
const express = require('express');
const db = require('./mongodb/dbconnect');
const connectMongo = require('connect-mongo');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const history = require('connect-history-api-fallback');
const config = require('./config/index');
const router = require('./router/index');
const http = require('http');
const path = require('path');
const fs = require('fs');
const options = {host: '10.20.7.31',port: config.dev.port}
const app = express();
const MongoStore = connectMongo(session);

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);      //可以带cookies
    res.header("X-Powered-By", "3.2.1");
    if(req.method == "OPTIONS"){
        res.send(200);
    }else{
        next()
    }
});

app.use(cookieParser());
app.use(session({
    name: config.dev.session.name,
    secret: config.dev.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.dev.session.cookie,
    store: new MongoStore({
        url: config.dev.dbUrl
    })
}));
router(app);
app.use(history());
/*const server = http.createServer((req,res) => {
        const fileName = req.url;
        fs.readFile(path.join(__dirname + '/templ',fileName),(err,data) => {
            if(err){
                res.write('==='+err);
            }else{
                res.write(data);
            }
            res.end();
        })
    });*/
app.use(express.static('./templ'))
app.listen(options,() => {
    console.log(`Server runing at http://${ options.host }:${ options.port }/`);
});