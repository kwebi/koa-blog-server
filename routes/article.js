const Router = require("koa-router")
const { create, getArticles, getArticleById, deleteArticleById, updateArticle, getHotArticles } = require("../controllers/article")

const router = new Router({ prefix: '/article' })


router.get('/hot', getHotArticles)
router.post('/', create)
router.get('/', getArticles)
router.get('/:id', getArticleById)
router.del('/:id', deleteArticleById)
router.post('/:id', updateArticle)

module.exports = router
