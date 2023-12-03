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
        res.status(500).json("Une erreur s'est produite lors de la création du post.");
    });
};

const updatePost = (req, res) => {
    if (!req.body.content || !req.body.postId) {
        return res.status(400).json("Vous ne pouvez pas envoyer un post vide")
    }

    Post.update({...req.body.data}, {
        where : {
            
        }
    })
}

module.exports = {createPost}