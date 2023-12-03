const {Comment} = require("../db/sequelize")

const createComment = (req, res) => {
    const {content, userId, postId} = req.body

    Comment.create({
        content,
        postId,
        UserId: userId
    })
        .then((comment) => {
            res.status(201).json(comment)
        }).catch((err) => {
        console.log(err);
        res.status(500).json("Une erreur s'est produite lors de la création du commentaire.");
    });
}

module.exports = {createComment}