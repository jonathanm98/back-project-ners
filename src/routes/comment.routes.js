const router = require("express").Router()
const commentController = require("../controller/comment.controller")
const {auth} = require("../auth/auth")

router.post("/create", auth, commentController.createComment)

module.exports = router