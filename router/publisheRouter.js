const {Router} = require("express")
const controller = require("../controller/publisherController")
const router = Router()



router.get("/", controller.getPublisher)
router.get("/:id", controller.getPublisherById)
router.post("/", controller.addPublisher)
router.delete("/:id", controller.deletePublisher)
router.put("/:id", controller.editPublisher)

module.exports = router