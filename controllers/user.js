const Joi = require('@hapi/joi')
const {encrypt,comparePassword} = require('../utils/bcrypt')
const { user: UserModel } = require('../models')


class UserController {
    static async register(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            username: Joi.string().required(),
            password: Joi.string().required(),
        })

        if (validator) {
            const { username, password } = ctx.request.body
            const user = await UserModel.findOne({ where: { username } })
            if (user) {
                ctx.body = {
                    code: 403,
                    errMsg: "用户已注册"
                }
            } else {
                //加密后存入数据库
                const saltPassword = await encrypt(password)
                await UserModel.create({ username, password: saltPassword })
                ctx.status = 204
                ctx.body = {
                    code: 200,
                }
            }
        }else {
            //验证失败
            ctx.throw(403,"请求失败")
        }
    }
    static async defaultLogin(ctx){
        const validator = ctx.validate(ctx.request.body,{
            username: Joi.string().required(),
            password: Joi.string().required()
        })
        if(validator){
            const { username, password } = ctx.request.body
            const user = await UserModel.findOne({
                where: {
                    username: username
                }
            })
            if (!user) {
                ctx.body = {
                    code: 403,
                    errMsg:"用户不存在"
                }
            }else {
                const isMatch = await comparePassword(password,user.password)
                if (!isMatch) {
                    ctx.body = {
                        code: 403,
                        errMsg:"密码错误"
                    }
                } else {
                    ctx.body = {
                        code:200,
                        data:{
                            username: user.username
                        }
                    }
                }
            }
        }else {
            //验证失败
            ctx.throw(403,"请求失败")
        }
    }
}

module.exports = UserController
