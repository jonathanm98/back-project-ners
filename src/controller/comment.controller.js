const {Comment, Post} = require("../db/sequelize")

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

const likeComment = async (req, res) => {
    const {userId, commentId} = req.body
    let message = ""
    try {
        const comment = await Comment.findByPk(commentId)
        let likes = JSON.parse(comment.likes)
        if (!likes.includes(userId)) {
            likes.push(userId)
            message = "Le like a bien été ajouté"
        } else {
            likes = likes.filter(id => id !== userId);
            message = "Le like a bien été supprimé"
        }
        comment.likes = JSON.stringify(likes)
        await comment.save()
        res.status(201).json({message, data: {...comment.dataValues, likes: JSON.parse(comment.likes)}})
    } catch(err) {
        console.log(err)
        res.status(500).json("Une erreur s'est produite lors de l'ajout du like");
    }
}

module.exports = {
    createComment,
    likeComment,
}