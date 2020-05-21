
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
            }
        },
        {
            timestamps: true
        }
    )
    return User
}
