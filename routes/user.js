const Router = require("koa-router")
const { register, defaultLogin, setting, getSetting, like, getLike } = require("../controllers/user")

const router = new Router()

/**
 * @route POST /user
 * @desc 注册
 * @access 公开
 */
router.post("/register", register)
router.post("/login", defaultLogin)
router.put("/user/:id", setting)
router.get("/user/:id", getSetting)
router.post("/like", like)
router.get("/like", getLike)
module.exports = router
