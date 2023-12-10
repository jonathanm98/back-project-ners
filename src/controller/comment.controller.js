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
        res.status(500).json({message: "Une erreur s'est produite lors de la création du commentaire."});
    });
}

const updateComment = async (req, res) => {
    const {commentId, content, userId} = req.body
    if (!content) {
        return res.status(400).json({message: "Vous ne pouvez pas envoyer un post vide"})
    }

    try {
        const comment = await Comment.findByPk(commentId)
        if (comment.UserId !== userId) res.status(401).json({message: "Vous n'êtes pas autorisé à faire ça !"});
        comment.content = content
        await comment.save()
        const message = "Le commentaire a été modifé avec succès"
        res.status(201).json({message, data: {...comment.dataValues, likes: JSON.parse(comment.likes)}})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Une erreur s'est produite lors de la modification du commentaire"});
    }

}

const deleteComment = (req, res) => {
    const {userId, commentId} = req.body

    try {
        Comment.destroy({where: {id: commentId, UserId: userId}})
            .then((post) => {
                if (post === 0) throw new Error()
                res.json({message: "Commentaire supprimé avec succès"})
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({message: "Une erreur s'est produite lors de la supression du commentaire"});
            });
    } catch(err) {
        console.log(err)
        res.status(500).json({message: "Une erreur s'est produite lors de la supression du commentaire"});
    }
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
        res.status(500).json({message: "Une erreur s'est produite lors de l'ajout du like"});
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    likeComment,
}