module.exports = (sequelize, DataTypes) => {
    const User =  sequelize.define("User", {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Cet email existe déjà, essayez de vous connecter."
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    User.associate = models => {
        User.hasMany(models.Post, {
            onDelete: "cascade"
        })
        User.hasMany(models.Comment, {
            onDelete: "cascade"
        })
    }
    return User
}