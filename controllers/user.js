const Joi = require('@hapi/joi')
const { encrypt, comparePassword } = require('../utils/bcrypt')
const { createToken } = require('../utils/token')
const { user: UserModel } = require('../models')


class UserController {
    static async register(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            username: Joi.string().required(),
            password: Joi.string().required(),
            img: Joi.string(),
            nickname: Joi.string()
        })

        if (validator) {
            const { username, password, img, nickname } = ctx.request.body
            const user = await UserModel.findOne({ where: { username } })
            if (user) {
                ctx.throw(403, "用户已注册")
            } else {
                //加密后存入数据库
                const allUsers = await UserModel.findAll({ where: { role: 1 } })
                const saltPassword = await encrypt(password)
                if (allUsers.length === 0) {
                    await UserModel.create({ username, password: saltPassword, img, nickname, role: 1 })
                    ctx.body = {
                        code: 200,
                    }
                } else {
                    //有超级用户则不允许注册
                    ctx.throw(403, "暂不允许注册")
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
                            username: user.username,
                            role,
                            userId: id,
                            token,
                            img: user.img,
                            nickname: user.nickname
                        }
                    }
                }
            }
        } else {
            //验证失败
            ctx.throw(403, "请求失败")
        }
    }

    static async publicInfo(ctx) {
        const user = await UserModel.findOne({ where: { role: 1 } })
        const { img, nickname, id, like } = user
        ctx.body = {
            code: 200,
            data: {
                id,
                nickname,
                img,
                like
            }
        }
    }

    static async getSetting(ctx) {
        const validator = ctx.validate(ctx.params, {
            id: Joi.number().min(1).required()
        })
        if (validator) {
            const { id } = ctx.params
            const user = await UserModel.findOne({
                where: {
                    id
                }
            })

            const userInfo = { id: user.id, username: user.username, nickname: user.nickname, img: user.img };
            ctx.body = {
                code: 200,
                data: {
                    userInfo
                }
            }
        } else {
            ctx.throw(403, "请求失败")
        }
    }

    static async setting(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            password: Joi.string().required(),
            password1: Joi.string().required(),
            img: Joi.string(),
            nickname: Joi.string(),
        })
        if (validator) {
            const { password, password1, img, nickname } = ctx.request.body
            const validator1 = ctx.validate(ctx.params, {
                id: Joi.number().min(1)
            })
            if (!validator1) {
                ctx.throw(403, "请求失败")
            }
            const { id } = ctx.params
            const user = await UserModel.findOne({
                where: {
                    id
                }
            })
            if (!user) {
                ctx.throw(403, "用户不存在")
            } else {
                const isMatch = await comparePassword(password, user.password)
                if (!isMatch) {
                    ctx.throw(403, "密码错误")

                } else {
                    //加密后存入数据库
                    const saltPassword = await encrypt(password1)
                    UserModel.update({
                        password: saltPassword,
                        img,
                        nickname
                    }, {
                        where: {
                            id
                        }
                    })
                    ctx.body = {
                        code: 200,
                        data: {
                            msg: "修改成功"
                        }
                    }
                }
            }
        } else {
            ctx.throw(403, "请求失败")
        }
    }
    static async like(ctx) {

        const user = await UserModel.findOne({ where: { role: 1 } })
        const data = await UserModel.update({ like: user.like + 1 }, {
            where: {
                id: user.id
            }
        })

        ctx.body = {
            code: 200
        }
    }
    static async getLike(ctx) {
        const user = await UserModel.findOne({ where: { role: 1 } })
        ctx.body = {
            code: 200,
            data: user.like
        }
    }
}

module.exports = UserController
