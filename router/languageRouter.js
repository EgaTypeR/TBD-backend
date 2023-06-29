const {Router} = require("express")
const controller = require("../controller/languageController")
const router = Router()



router.get("/", controller.getLanguage)
router.get("/:id", controller.getLanguageById)
router.post("/", controller.addLanguage)
router.delete("/:id", controller.deleteLanguage)
router.put("/:id", controller.editLanguage)

module.exports = router