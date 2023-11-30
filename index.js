require("dotenv").config()
const express = require("express")
const {initDb} = require('./src/db/sequelize');

const app = express()

initDb().then(() => console.log("Base de donnée initialisée"));
app.get("*", (req, res) => res.status(404).json({message:"La page demandée n'existe pas"}))

app.listen(process.env.PORT, () => console.log("Serveur démarré sur le port " + process.env.PORT))