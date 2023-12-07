const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require("../models/user.model")
const PostModel = require("../models/post.model")
const CommentModel = require("../models/comment.model")

const sequelize = new Sequelize('ners', 'john', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mariadb',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    dialectOptions: {
        timezone: 'Etc/GMT-2',
    },
    logging: false
})
const User = UserModel(sequelize, DataTypes)
const Post = PostModel(sequelize, DataTypes)
const Comment = CommentModel(sequelize, DataTypes)

const models = {User, Post, Comment}
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});
const initDb = () => {
    return sequelize.sync({force: true})
}
module.exports = {initDb, User, Post, Comment}