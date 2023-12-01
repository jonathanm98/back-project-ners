require("dotenv").config()
const express = require("express")
const {initDb} = require('./src/db/sequelize');
const userRoutes = require("./src/routes/user.routes")

const app = express()
app.use(express.json())

initDb().then(() => console.log("Base de donnée initialisée"));

app.use("/api/user", userRoutes)

app.use("*", (req, res) => res.status(404).json({message:"La page demandée n'existe pas"}))

app.listen(process.env.PORT, () => console.log("Serveur démarré sur le port " + process.env.PORT))