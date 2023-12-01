const {User} = require("../db/sequelize")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const register = (req, res) => {
    if (req.body.password.length < 6) {
        return res.status(401).json("Mot de passe trop court");
    }
    if (!/[a-z]/.test(req.body.password) || !/[A-Z]/.test(req.body.password) || !/[0-9]/.test(req.body.password) ) {
        return res.status(401).json("Le mot de passe doit contenir au minimum 1 chiffre, une lettre minuscule et une lettre majuscule");
    }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) res.status(500).json("Erreur lors de la création de votre compte, veuillez réessayer plus tard.")
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) res.status(500).json("Erreur lors de la création de votre compte, veuillez réessayer plus tard.")
            User.create({username: req.body.username, password: hash})
                .then(() => res.status(201).json({message: "Utilisateur créer avec succès"}))
                .catch(err => {
                    if (err.errors[0]?.validatorKey === "not_unique") res.status(401).json(err.errors[0])
                })
        });
    });
}

const login = (req, res) => {
    User.findOne({where: {username: req.body.username}}).then((user) => {
        if (!user) {
            const message = `Utilisateur ou mot de passe incorrect.`;
            return res.status(404).json({message})
        }
        bcrypt.compare(req.body.password, user.password).then((isPasswordValid) => {
            if (!isPasswordValid) return res.status(401).json("Utilisateur ou mot de passe incorrect.")
            const token = jwt.sign({userId: user.id}, process.env.JWT_TOKEN, {expiresIn: "24h"})
            const message = "Vous avez été connecté avec succès !"
            res.json({message, data: {token}})
        })
    })
        .catch(err => {
            const message = "Nous n'avons pas réussi à vous connecter, veuillez réessayer plus tard."
            res.status(500).json({message, data: err})
        })
}

module.exports = {register, login}