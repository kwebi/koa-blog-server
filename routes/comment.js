const Router = require("koa-router")
const { create } = require("../controllers/comment")

const router = new Router({ prefix: '/comment' })


router.post("/", create)

module.exports = router
