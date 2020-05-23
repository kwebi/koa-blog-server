module.exports = (sequelize, dataTypes) => {
    const Comment = sequelize.define(
        'comment',
        {
            id: {
                type: dataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true
            },
            articleId: dataTypes.INTEGER(11), // 评论所属文章 id
            content: { type: dataTypes.TEXT, allowNull: false }, // 评论详情
            createdAt: {
                type: dataTypes.BIGINT(11),
                allowNull:false
            },
            updatedAt: {
                type: dataTypes.BIGINT(11),
                allowNull:false
            }
        }
    )

    Comment.associate = models => {
        Comment.belongsTo(models.article, {
            foreignKey: 'articleId', //自定义外键名称
            targetKey: 'id', //可自定义关联的列，默认关联主键
            constraints: false
        })

        Comment.belongsTo(models.user, {
            foreignKey: 'userId',
            targetKey: 'id',
            constraints: false
        })
        Comment.belongsTo(models.comment, {
            foreignKey: 'commentId',
            sourceKey: 'id',
            constraints: false // 在表之间添加外键约束
        })
    }

    return Comment
}
