const {Post, Comment, User} = require("../db/sequelize")
const {logger} = require("sequelize/lib/utils/logger");

const createPost = (req, res) => {
    const {content, userId} = req.body

    if (!content || !userId) {
        return res.status(400).json({message: "Le contenu du post et l'identifiant de l'utilisateur sont requis"});
    }

    Post.create({
        content,
        UserId: userId // Assure-toi que le champ UserId correspond à l'identifiant de l'utilisateur
    }).then((post) => {
        res.status(201).json(post);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: "Une erreur s'est produite lors de la création du post"});
    });
};

const updatePost = async (req, res) => {
    const {postId, content, userId} = req.body

    if (!content || !postId) {
        return res.status(400).json({message: "Vous ne pouvez pas envoyer un post vide"})
    }

    try {
        const post = await Post.findByPk(postId)
        if (post.UserId !== userId) res.status(401).json({message: "Vous n'êtes pas autorisé à faire ça !"});
        post.content = content
        await post.save()
        const message = "Le post a été modifé avec succès"
        res.status(201).json({message, data: {...post.dataValues, likes: JSON.parse(post.likes)}})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Une erreur s'est produite lors de la mise à jour du post"})
    }
}

const deletePost = (req, res) => {
    const {postId} = req.body
    if (!postId) {
        return res.status(400).json({message: "Vous devez spécifier un post à supprimer"})
    }

    Post.destroy({where: {postId}})
        .then(() => res.status(200).json({message: "Post supprimé avec succès"}))
        .catch((err) => {
            console.log(err);
            res.status(500).json({message: "Une erreur s'est produite lors de la supression du post"});
        });
}
const likePost = async (req, res) => {
    const {userId, postId} = req.body
    let message = ""
    try {
        const post = await Post.findByPk(postId)
        let likes = JSON.parse(post.likes)
        if (!likes.includes(userId)) {
            likes.push(userId)
            message = "Le like a bien été ajouté"
        } else {
            likes = likes.filter(id => id !== userId);
            message = "Le like a bien été supprimé"
        }
        post.likes = JSON.stringify(likes)
        await post.save()
        res.status(201).json({message, data: {...post.dataValues, likes: JSON.parse(post.likes)}})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: "Une erreur s'est produite lors de l'ajout du like"});
    }
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
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des posts.' });
    }
}


module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPosts,
}