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
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sexe: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [['male', 'female']],
                    msg: "Le champ sexe doit être 'Homme' ou 'Femme'"
                }
            }
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
    User.addHook("beforeValidate", (user, options) => {
        if (!user.picture) user.picture = `${process.env.API_URL}/api/image/default/${user.sexe}.png`
    })
    return User
}