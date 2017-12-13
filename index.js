/**
 * Created by glzc on 2017/10/30.
 */
const http = require('http');
const path = require('path');
const fs = require('fs');
const options = {host: '127.0.0.1',port: 8989}

const server = http.createServer((req,res) => {
        const fileName = req.url;
        fs.readFile(path.join('/Users/glzc/pc/node-demo/templ',fileName),(err,data) => {
            if(err){
                res.write('==='+err);
            }else{
                res.write(data);
            }
            res.end();
        })
    });
server.listen(options,() => {
    console.log(`Server runing at http://${ options.host }:${ options.port }/`);
});