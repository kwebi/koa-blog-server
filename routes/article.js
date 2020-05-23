const Router = require("koa-router")
const {create,getArticles,getArticleById,deleteArticleById}  = require("../controllers/article")

const router = new Router({ prefix: '/article' })

router.post('/',create)
router.get('/',getArticles)
router.get('/:id',getArticleById)
router.del('/:id',deleteArticleById)
module.exports = router
