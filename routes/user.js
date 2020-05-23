const Router = require("koa-router")
const { register,defaultLogin } = require("../controllers/user")

const router = new Router()

/**
 * @route POST /user
 * @desc 注册
 * @access 公开
 */
router.post("/register", register)
router.post("/login",defaultLogin)

module.exports = router
