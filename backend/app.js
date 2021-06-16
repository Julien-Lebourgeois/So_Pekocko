const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

const stuffRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

app.use(helmet());


// CORS gestion des requêtes via cette URL
app.use(cors({origin: 'http://localhost:4200'}));


// connection au serveur Atlas via Mongoose
mongoose.connect('mongodb+srv://Julien:projet6@cluster0.hzv1o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{useNewUrlParser: true,
useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// Header afin d'acceder à l'API et gérer les requêtes GET, POST etc...
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Header', 'Origin, X-Request-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// Transformation en objet JavaScript utilisable
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;