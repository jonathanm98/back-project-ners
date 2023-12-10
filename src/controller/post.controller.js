const {Post, Comment, User} = require("../db/sequelize")
const {logger} = require("sequelize/lib/utils/logger");

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
    const {postId, content} = req.body

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

const deletePost = (req, res) => {
    const {postId} = req.body
    if (!postId) {
        return res.status(400).json("Vous devez spécifier un post à supprimer")
    }

    Post.destroy({where: {postId}})
        .then(() => res.status(200).json("Post supprimé avec succès"))
        .catch((err) => {
            console.log(err);
            res.status(500).json("Une erreur s'est produite lors de la supression du post");
        });
}

const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page - 1) * limit;
        const posts = await Post.findAll({
            offset,
            limit,
            include: [
                {
                    model: Comment,
                    required: false,
                    attributes: ['id', 'content', 'likes', 'createdAt'],
                    include: [
                        {
                            model: User,
                            attributes: ['firstName', 'lastName', 'picture']
                        }
                    ]
                }
            ],
        });

        posts.forEach(post => {
            post.likes = JSON.parse(post.likes);
            post.Comments.forEach(comment => {
                comment.likes = JSON.parse(comment.likes);
            });
        });

        res.json({
            posts,
            currentPage: page,
            postsPerPage: limit,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des posts.' });
    }
}


module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPosts,
}