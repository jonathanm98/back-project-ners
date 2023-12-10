const router = require("express").Router()
const commentController = require("../controller/comment.controller")
const {auth} = require("../auth/auth")

router.post("/create", auth, commentController.createComment)
router.put("/update", auth, commentController.updateComment)
router.delete("/delete", auth, commentController.deleteComment)
router.put("/like", auth, commentController.likeComment)

module.exports = router