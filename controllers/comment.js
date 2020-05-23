const Joi = require('@hapi/joi')

const {comment: CommentModel} = require('../models')

class CommentController {
    static async create(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            articleId: Joi.number().required(),
            content: Joi.string().required(),
            userId: Joi.number().required(),
            commentId: Joi.number()
        })
        if (validator) {
            const {
                articleId,
                content,
                userId,
                commentId
            } = ctx.request.body;

            const createdAt = new Date().getTime()
            const updatedAt = createdAt
            const data = await CommentModel.create({
                articleId,
                content,
                userId,
                commentId,
                createdAt,
                updatedAt
            })
            ctx.body = {
                code: 200,
            }
        } else {
            //验证失败
            ctx.throw(403,"请求失败")
        }
    }

    //service
    static async fetchCommentList(articleId) {

    }
}

module.exports = CommentController
