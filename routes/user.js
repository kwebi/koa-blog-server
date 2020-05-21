const Router = require("koa-router")
const { register,defaultLogin } = require("../controllers/user")

const router = new Router()

/**
 * @route POST /user
 * @desc 注册
 * @access 公开
 */
router.post("/api/v1/register", register)
router.post("/api/v1/login",defaultLogin)

module.exports = router
