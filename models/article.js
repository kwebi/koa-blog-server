// article 表
module.exports = (sequelize, dataTypes) => {
    const Article = sequelize.define(
        'article',
        {
            id: { type: dataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
            title: { type: dataTypes.STRING(255), allowNull: false},
            content: { type: dataTypes.TEXT, allowNull:false},
            viewCount: { type: dataTypes.INTEGER(11), defaultValue: 0 }, // 阅读数
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
    Article.associate = models => {
        Article.belongsTo(models.user,{
            foreignKey: "userId",
            constraints:false
        })
    }
    return Article
}
