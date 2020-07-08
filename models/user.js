
module.exports = (sequelize, dataTypes) => {
    const User = sequelize.define(
        'user',
        {
            // id sequelize 默认创建...
            id: {
                type: dataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: dataTypes.STRING(50),
                allowNull: false
                // unique: true
            },
            password: {
                type: dataTypes.STRING,
                comment: '通过 bcrypt 加密后的密码' // 仅限站内注册用户
            },
            role: {
                type: dataTypes.INTEGER(11),
                defaultValue: 2
            },
            img: {
                type: dataTypes.STRING(200),
                allowNull: true
            },
            nickname: {
                type: dataTypes.STRING(20),
                allowNull: true
            },
            like: {
                type: dataTypes.INTEGER(11),
                allowNull: true,
                defaultValue: 0
            }
        },
        {
            timestamps: true
        }
    )

    return User
}
