require('./config/config');

const mongoose = require('mongoose');

const express = require('express');

//usa cors PARA PODER AHORRARTE EL MIDDLEWARE DE ACTIVAR CORS!!!!!!
const cors = require('cors');
const app = express();
app.use(cors());



// Parse application with body-parser x-www-form-urlencoded
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Rutas
app.use(require('./rutas/rutas'));

// Conexión con la BD llamada 'aleman'
mongoose.connect(process.env.URLDB, { useNewUrlParser: true },(error,respuesta)=>{
    if(error){
        console.log("Error conectando cono BD en puerto 27017",error);
        return;
    }
    console.log('Base de datos ONLINE');
});


// Apertura del puerto del server
app.listen(process.env.PORT, ()=>{
    console.log("Escuchando puerto ",process.env.PORT);
});
