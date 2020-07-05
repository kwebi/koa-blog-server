const Joi = require('@hapi/joi')
const { encrypt, comparePassword } = require('../utils/bcrypt')
const { createToken } = require('../utils/token')
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
                await UserModel.create({ username, password: saltPassword, role: 1 })
                ctx.status = 204
                ctx.body = {
                    code: 200,
                }
            }
        } else {
            //验证失败
            ctx.throw(403, "请求失败")
        }
    }
    static async defaultLogin(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            username: Joi.string().required(),
            password: Joi.string().required()
        })
        if (validator) {
            const { username, password } = ctx.request.body
            const user = await UserModel.findOne({
                where: {
                    username: username
                }
            })
            if (!user) {
                ctx.throw(403, "用户名或密码错误")
            } else {
                const isMatch = await comparePassword(password, user.password)
                if (!isMatch) {
                    ctx.throw(403, "用户名或密码错误")
                } else {
                    const { id, role } = user
                    const token = createToken({ username: user.username, userId: id, role }) // 生成 token
                    ctx.body = {
                        code: 200,
                        data: {
                            username: user.username, role, userId: id, token
                        }
                    }
                }
            }
        } else {
            //验证失败
            ctx.throw(403, "请求失败")
        }
    }
}

module.exports = UserController
