const {User} = require("../db/sequelize")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const register = (req, res) => {
    if (req.body.password.length < 6) {
        return res.status(401).json("Le mot de passe doit contenit au minimum 6 caractères.");
    }
    if (!/[a-z]/.test(req.body.password) || !/[A-Z]/.test(req.body.password) || !/[0-9]/.test(req.body.password) ) {
        return res.status(401).json("Le mot de passe doit contenir au minimum 1 chiffre, 1 lettre minuscule et 1 lettre majuscule");
    }
    if (!req.body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        return res.status(401).json("Vous devez saisir un email valide");
    }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) res.status(500).json("Erreur lors de la création de votre compte, veuillez réessayer plus tard.")
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) res.status(500).json("Erreur lors de la création de votre compte, veuillez réessayer plus tard.")
            User.create({...req.body, password: hash})
                .then(() => res.status(201).json({message: "Utilisateur créer avec succès"}))
                .catch(err => {
                    res.status(400).json(err.errors[0].message)
                })
        });
    });
}

const login = (req, res) => {
    const {email, password} = req.body
    if (!email ||!password) return res.status(401).json("Vous devez renseigner les champ 'email' et 'mot de passe'")

    User.findOne({where: {email}}).then((user) => {
        if (!user) {
            const message = `Utilisateur ou mot de passe incorrect.`;
            return res.status(404).json({message})
        }
        bcrypt.compare(password, user.password).then((isPasswordValid) => {
            if (!isPasswordValid) return res.status(400).json("Utilisateur ou mot de passe incorrect.")
            const token = jwt.sign({id: user.id}, process.env.JWT_TOKEN, {expiresIn: "24h"})
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
