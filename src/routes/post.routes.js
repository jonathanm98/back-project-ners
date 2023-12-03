const router = require("express").Router()
const postController = require("../controller/post.controller")
const {auth} = require("../auth/auth")

router.post("/create", auth, postController.createPost)
router.put("/update", auth, postController.updatePost)

module.exports = router