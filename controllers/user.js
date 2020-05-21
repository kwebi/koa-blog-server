const Joi = require('joi')

const { user: UserModel } = require('../models')


class UserController {
    static async register(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            username: Joi.string().required(),
            password: Joi.string().required()
        })
        if (validator) {
            const { username, password } = ctx.request.body
            const user = await UserModel.findOne({ where: { username } })
            if (user) {
                ctx.throw(403, '用户名已被占用')
            } else {
                const saltPassword = password //TODO
                await UserModel.create({ username, password: saltPassword })
                // ctx.client(200, '注册成功')
                ctx.status = 204
            }
        }
    }
    static async defaultLogin(ctx){
        const validator = ctx.validate(ctx.request.body,{
            username: Joi.string().required(),
            password: Joi.string()
        })
        if(validator){
            const { username, password } = ctx.request.body
            const user = await UserModel.findOne({
                where: {
                    username: username
                }
            })
            if (!user) {
                // ctx.client(403, '用户不存在')
                ctx.throw(403, '用户不存在')
            }else {
                const isMatch = password === user.password
                if (!isMatch) {
                    // ctx.client(403, '密码不正确')
                    ctx.throw(403, '密码不正确')
                } else {
                    ctx.body = { username: user.username}
                }
            }
        }
    }
}

module.exports = UserController
