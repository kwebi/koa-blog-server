
const config = {
    PORT: 6543,
    DATABASE: {
        database: 'my_koa_blog',
        user: 'root',
        password: '123456',
        options: {
            host: 'localhost', // 连接的 host 地址
            dialect: 'mysql', // 连接到 mysql
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                timestamps: false, // 默认不加时间戳
                freezeTableName: true // 表名默认不加 s
            },
            timezone: '+08:00'
        }
    },
    SALT_WORK_FACTOR:"1213243249082"
}

module.exports = config
