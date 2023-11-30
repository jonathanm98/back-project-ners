require("dotenv").config()
const express = require("express")

const app = express()

app.get("/", (req, res) => res.json("hello world") )

app.listen(process.env.PORT, () => console.log("serveur démarré sur le port " + process.env.PORT))