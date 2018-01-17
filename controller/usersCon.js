/**
 * Created by glzc on 2018/1/16.
 */
const Users = require('./../models/users/users');
const UserInfo = require('./../models/users/usersInfo');
const Util = require('./../utils/utils');
const formidable = require('formidable');

module.exports = {
    async login(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {user_name, psw} = fields;
            try{
                const user = await Users.findOne({user_name: user_name});
                if(user){
                    console.log(user)
                    if(user.psw === psw){
                        res.send({
                            status: 200,
                            type: 'FIND_USER_SUCCESS',
                            message: '登陆成功',
                            body: {uuid: user.uuid},
                            success: true,
                        });
                    }else{
                        res.send({
                            status: 300,
                            type: 'PSW_IS_ERROR',
                            message: '登陆密码错误',
                            body: null,
                            success: false,
                        });
                    }
                }else{
                    res.send({
                        status: 400,
                        type: 'FIND_USER_FAILED',
                        message: '用户名或密码不正确',
                        body: null,
                        success: false,
                    })
                }
            }catch(e){
                res.send({
                    status: 400,
                    type: 'FIND_USER_FAILED',
                    message: '用户名或密码不正确',
                    body: null,
                    success: false,
                })
            }
        });
    },
    async register(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const info = fields;
            try{
                const user = await Users.findOne({mob_phone: info.mob_phone})
                if(!user){
                    let u = {};
                    u.uuid = Util.makeUuid();
                    u.user_name = info.user_name;
                    u.mob_phone = info.mob_phone;
                    u.psw = info.psw;
                    u.create_time = u.update_time = new Date().getTime();
                    Users.create(u);
                    res.send({
                        status: 200,
                        type: 'CREAT_USER_SUCCESS',
                        message: '注册成功',
                        body: {
                            uuid: u.uuid
                        },
                        success: true,
                    })
                }else{
                    res.send({
                        status: 1,
                        type: 'SAME_USER_NAME',
                        message: '此用户已存在',
                        success: false,
                        body: null,
                    })
                }
            }catch(e){
                res.send({
                    status: 0,
                    type: 'CREAT_USER_FAILED',
                    message: '注册失败',
                    success: false,
                    body: null,
                })
            }
        });
    },
    async userInfo(){
        const infos = req.body
    }
}