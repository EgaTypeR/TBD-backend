const {Router} = require("express")
const controller = require("../controller/bookController")
const router = Router()



router.get("/", controller.getBook)
router.get("/:id", controller.getBookById)
router.post("/", controller.addBook)
router.delete("/:id", controller.deleteBook)
router.put("/:id", controller.updateBook)

module.exports = router