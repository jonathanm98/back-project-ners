const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require("../models/user.model")

const sequelize = new Sequelize('ners', 'john', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2',
    },
    logging: false
})
const User = UserModel(sequelize, DataTypes)
const initDb = () => {
    return sequelize.sync()
}
module.exports = {initDb, User}