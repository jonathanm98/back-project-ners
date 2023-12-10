module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        id: {
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
            defaultValue: "[]"
        }
    });

    // Association avec l'utilisateur qui a créé le commentaire
    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });

        // Association avec le post auquel appartient le commentaire
        Comment.belongsTo(models.Post, {
            onDelete: 'CASCADE', // Supprime le commentaire si le post associé est supprimé
            foreignKey: {
                allowNull: false,
                name: 'postId'
            }
        });
    };

    return Comment;
};
