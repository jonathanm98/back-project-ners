const {Post} = require("../db/sequelize")

const createPost = (req, res) => {
    const {content, userId} = req.body

    if (!content || !userId) {
        return res.status(400).json("Le contenu du post et l'identifiant de l'utilisateur sont requis");
    }

    Post.create({
        content,
        UserId: userId // Assure-toi que le champ UserId correspond à l'identifiant de l'utilisateur
    }).then((post) => {
        res.status(201).json(post);
    }).catch((err) => {
        console.log(err);
        res.status(500).json("Une erreur s'est produite lors de la création du post");
    });
};

const updatePost = async (req, res) => {
    const {postId, content, userId} = req.body

    if (!content || !postId) {
        return res.status(400).json("Vous ne pouvez pas envoyer un post vide")
    }

    try {
        const post = await Post.findOne({where: {postId}})
        if (!post) return res.status(401).json("Vous devez être authentifié pour effectuer ceci")
        post.content = content
        res.status(201).json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json("Une erreur s'est produite lors de la mise à jour du post")
    }
}

module.exports = {
    createPost,
    updatePost
}