// APPLICATION EXPRESS

// Imports
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
var bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");

const { Sequelize } = require("sequelize");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// Database
const sequelize = require("./config/database");

// Test de la connexion à la BDD 
sequelize.authenticate() 
  .then(() => (console.log("Connecté à la base de données MySQL !")))
  .catch(error => console.error("Impossible de se connecter, erreur suivante :", error))

app.use(cookieParser());

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes "générales" de l'application
app.use('/user', userRoutes);
app.use('/post', postRoutes);


/* 
const Message = sequelize.define('Message', {
    message: { type: DataTypes.TEXT, allowNull: false } 
    }, {
        tableName: 'messagestable'
    });


    app.post('/', function (req, res) {
        console.log(JSON.stringify(req.body.messageReadyToSend));
        const firstMessage = Message.build({message: (JSON.stringify(req.body.messageReadyToSend))})
        firstMessage.save().then(console.log('firstMessage was saved to the database!'), res.send({ status: 'SUCCESS' }));
      });
    
    app.get('/getmesss', function (req, res) {
        Message.findAll()
        .then((messages) => {res.status(200).json(messages)})
        .catch((error) => {res.status(400).json({error: error})});
      });
*/

module.exports = app;
