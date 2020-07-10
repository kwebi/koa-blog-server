const Joi = require('@hapi/joi')

const {
    article: ArticleModel,
    user: UserModel,
    sequelize
} = require('../models')

class ArticleController {
    static async create(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            authorId: Joi.number(),
            title: Joi.string().required(),
            content: Joi.string().required(),
            img: Joi.string(),
            userId: Joi.number()
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
            const dataList = []
            for (let i = 0; i < data.length; i++) {
                const user = await UserModel.findOne({
                    where: {
                        id: data[i].userId
                    }
                })
                const { id, title, content, viewCount, img, updatedAt, createdAt } = data[i]
                const data1 = {
                    id,
                    title,
                    content,
                    viewCount,
                    img,
                    updatedAt,
                    createdAt,
                }
                if (user) {
                    Object.assign(data1, {
                        author: user.nickname
                    })
                }
                dataList.push(data1)
            }

            const total = await ArticleModel.findOne({
                attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']]
            })
            ctx.body = {
                code: 200,
                data: {
                    list: dataList,
                    total: total
                }
            }
        } else {
            ctx.throw(403, "请求失败")
        }
    }
    static async getHotArticles(ctx) {
        const data = await ArticleModel.findAll({
            order: sequelize.literal('viewCount DESC'),
            // order: sequelize.random(),
            offset: 0,
            limit: 6
        })
        ctx.body = {
            code: 200,
            data: data
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
            const user = await UserModel.findOne({
                where: {
                    id: data[0].userId
                }
            })
            if (!user) {
                ctx.throw(404, "非法作者")
            }
            const { id: id1, title, content, viewCount, img, updatedAt, createdAt } = data[0]
            ctx.body = {
                code: 200,
                data: {
                    id: id1,
                    title,
                    content,
                    viewCount,
                    img,
                    updatedAt,
                    createdAt,
                    author: user.nickname
                }
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
