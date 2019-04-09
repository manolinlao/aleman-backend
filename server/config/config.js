//==========================
//  puerto
//==========================
//Si estamos en producción heroku pone valor  a esa variable si no, ponemos 3001
process.env.PORT = process.env.PORT || 3001;

//==========================
//  Entorno
//==========================
//si la variable node_env no existe la pongo a "dev" (Desarrollo)
//esta variable NODE_ENV la pone heroku si es que estamos en producción.
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

//==========================
//  Base de datos
//==========================
let urlDB;
if(process.env.NODE_ENV==="dev"){
    urlDB = 'mongodb://localhost:27017/aleman';
}else{
    // la url del mlab la protejo
    // heroku config:set MONGO_URI= “mongodb://cafe-user:1234cafeuser@ds115874.mlab.com:15874/cafe”
    urlDB = process.env.MONGO_URI;
}
//nos inventamos el environment URLDB que usaremos en server.js
process.env.URLDB = urlDB;

//==========================
//  Vencimiento del token
//==========================
//60 segundos  60 minutos 24 horas 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==========================
//  SEED
//==========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



