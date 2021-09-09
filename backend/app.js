// APPLICATION EXPRESS

// Imports
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
var xss = require('xss-clean');
const csrf = require('csurf');
var csrfProtection = csrf({ cookie: {maxAge:86400, httpOnly: true} }) // maxAge exprimé en secondes 

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// BDD configuration
const sequelize = require("./config/database");

// Test de la connexion à la BDD 
sequelize.authenticate() 
  .then(() => (console.log("Connecté à la base de données MySQL !")))
  .catch(error => console.error("Impossible de se connecter, erreur suivante :", error))

app.use(helmet());

app.use(xss())

app.use(cookieParser());

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use("/images", express.static(path.join(__dirname, "images")));

// Envoi un token CSRF dans le corps de la requête ainsi qu'une clé dans un cookie qui permet d'authentifier certaines reqûetes.
app.get('/getcsrftoken', csrfProtection, function (req, res) {
  return res.json({ csrfToken: req.csrfToken() });
});

// Routes "générales" de l'application
app.use('/user', userRoutes);
app.use('/post', postRoutes);

module.exports = app;
