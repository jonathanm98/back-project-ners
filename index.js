require("dotenv").config()
const express = require("express")
const {initDb} = require('./src/db/sequelize');
let morgan
if (process.env.DEV) morgan = require("morgan")
const multer = require("multer")
const userRoutes = require("./src/routes/user.routes")
const postRoutes = require("./src/routes/post.routes")
const commentRoutes = require("./src/routes/comment.routes")

const app = express()
app.use(express.json())
if (process.env.DEV) app.use(morgan("dev"))

initDb().then(() => console.log("Base de donnée initialisée"));

app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)

app.use("/api/image/default", express.static("./src/img/user/default"))
app.use("/api/image/user", express.static("./src/img/user/"))

app.use("*", (req, res) => res.status(404).json({message:"La page demandée n'existe pas"}))

app.use(function (err, res, next) {
    res.status(400).json({ message: "Erreur lors du téléchargement du fichier", data: err })
})

app.listen(process.env.PORT, () => console.log("Serveur démarré sur le port " + process.env.PORT))