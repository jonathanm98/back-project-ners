const router = require("express").Router()
const multer = require("multer")
const userController = require("../controller/user.controller")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/img/user')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const newFileName = `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split("/")[1]}`
        req.body.picture = `${process.env.API_URL}/api/image/user/${newFileName}`
        cb(null, newFileName)
    }
})
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const mimeType = file.mimetype.split("/")[1]
        if (!(mimeType === "png" || mimeType === "jpg" || mimeType === "jpeg")) {
            cb(new Error("Le format de l'image doit être 'png', 'jpeg' ou 'jpg'"))
        } else {
            cb(null, true)
        }
    }
})

router.post("/create", upload.single("file"), userController.register)
router.post("/login", userController.login)

module.exports = router