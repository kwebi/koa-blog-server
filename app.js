const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const loadRouter = require('./routes')
const cors = require('koa2-cors')
const db = require('./models')
const logger = require('koa-logger')
const { PORT } = require('./config')
const authHandler = require('./middlewares/authHandler')

const app = new Koa()

//bind utils/context {validate}
const context = require('./utils/context')
Object.keys(context).forEach(key => {
    app.context[key] = context[key] // 绑定上下文对象
})

//请求体解析中间件
app.use(cors()).use(bodyParser()).use(authHandler).use(logger())

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
    }
});
//加载全部路由
loadRouter(app)


app.listen(PORT, () => {
    db.sequelize
        .sync({ force: false }) // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
        .then(async () => {
            console.log('sequelize connect success')
            console.log(`sever listen on http://127.0.0.1:${PORT}`)
        })
        .catch(err => {
            console.log(err)
        })
})
