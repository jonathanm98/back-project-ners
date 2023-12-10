const router = require("express").Router()
const postController = require("../controller/post.controller")
const {auth} = require("../auth/auth")

// CRUD Posts
router.get("/get", auth, postController.getPosts)
router.post("/create", auth, postController.createPost)
router.put("/update", auth, postController.updatePost)
router.put("/like", auth, postController.likePost)
router.delete("/delete", auth, postController.deletePost)

module.exports = router