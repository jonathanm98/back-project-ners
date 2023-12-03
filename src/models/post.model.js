module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        likes: {
            type: DataTypes.STRING,
        }
    });

    // Association avec l'utilisateur qui a créé le post
    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });

        // Association avec les commentaires
        Post.hasMany(models.Comment, {
            onDelete: 'CASCADE', // Supprime les commentaires liés si le post est supprimé
            foreignKey: 'postId'
        });
    };

    return Post;
};