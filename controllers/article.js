const Joi = require('@hapi/joi')

const {
    article: ArticleModel,
} = require('../models')

class ArticleController {
    static async create(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            authorId: Joi.number(),
            title: Joi.string().required(),
            content: Joi.string().required(),
            img: Joi.string()
            //TODO 标签，分类等
        })
        if (validator) {
            const { title, content, userId, img } = ctx.request.body
            const createdAt = new Date().getTime();
            const updatedAt = createdAt;
            const data = await ArticleModel.create({
                title, content, createdAt, updatedAt, userId, img
            })
            ctx.body = {
                code: 200,
                data: {
                    msg: "创建成功"
                }
            }
        } else {
            ctx.throw(403, "请求失败")
        }
    }
    static async getArticles(ctx) {
        const validator = ctx.validate(ctx.query, {
            limit: Joi.number().min(0),
            offset: Joi.number().min(0)
        })
        if (validator) {
            const { offset = 0, limit = 6 } = ctx.query
            const data = await ArticleModel.findAll({ offset: +offset, limit: +limit })
            ctx.body = {
                code: 200,
                data: {
                    list: data
                }
            }
        } else {
            ctx.throw(403, "请求失败")
        }
    }
    static async getArticleById(ctx) {
        const validator = ctx.validate(ctx.params, {
            id: Joi.number().min(0)
        })
        if (validator) {
            const { id = 0 } = ctx.params
            const data = await ArticleModel.findAll({
                where: {
                    id: +id
                }
            })
            if (data.length === 0) {
                ctx.throw(404, "无此文章")
            }
            ctx.body = {
                code: 200,
                data: data[0]
            }
        } else {
            ctx.throw(403, "请求失败")
        }
    }
    static async deleteArticleById(ctx) {
        const validator = ctx.validate(ctx.params, {
            id: Joi.number().min(0)
        })
        if (validator) {
            try {
                const { id = 0 } = ctx.params
                const data = await ArticleModel.destroy({
                    where: {
                        id: +id
                    }
                })
                ctx.body = {
                    code: 200,
                    data: {
                        msg: "删除成功"
                    }
                }
            } catch (e) {
                ctx.body = {
                    code: 500,
                    data: {
                        msg: "删除失败"
                    }
                }
            }
        } else {
            ctx.throw(403, "请求失败")
        }
    }
    static async updateArticle(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            title: Joi.string().required(),
            content: Joi.string().required(),
            id: Joi.number().required(),
            img: Joi.string()
        })
        if (validator) {
            const { title, content, id, updatedAt, img } = ctx.request.body
            const data = await ArticleModel.update({
                title, content, updatedAt, img
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
        } else {
            ctx.throw(403, "请求失败")
        }
    }
}

module.exports = ArticleController
