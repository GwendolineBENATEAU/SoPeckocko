//importation des modules d'extension
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
var helmet = require('helmet');
//import du path qui donne accès au systeme de fichier
const path = require('path');
//import des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');



//lancement de l'application Express
const app = express();



//lancement du package dotenv pour accès aux variables d'environnement
dotenv.config();
//connexion à la BDD Mongo DB Atlas
mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.f4gxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  


//utilisation de helmet qui aide à sécuriser l'app Express en définissant divers en-têtes HTTP afin de d'éviter des attaques spécifiquement ciblées sur les apps Express
app.use(helmet());



//correction des erreurs de CORS avec ajout de headers dans les réponses
app.use((req, res, next) => 
{
  //accéder à notre API depuis n'importe quelle origine *
  res.setHeader('Access-Control-Allow-Origin', '*');
  //ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin, X-Requested-With ...)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //envoyer des requêtes avec les méthodes mentionnées (GET, POST, ...)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



//analyse du corps et formatage en json des requêtes provenant du frontend 
app.use(bodyParser.json());

//ajout d'un gestionnaire de routage pour les ressources images 
app.use('/images', express.static(path.join(__dirname, 'images')));
//chargement des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



//export de l'application
module.exports = app;