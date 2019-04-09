const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let verboSchema = new Schema({
    ale:{
        type: String,
        required: [true,'La palabra en Aleman es obligatoria']
    },
    irregular:{
        type: Boolean,
    },
    participioperfecto:{
        type: String,
    },
    participiopresente:{
        type: String,
    },
    presente:{
        type: String,
        required: [true,'La conjugación en presente es obligatoria']
    },
    pasado:{
        type: String
    },
    futuro:{
        type: String
    }
});



module.exports = mongoose.model( 'Verbo' , verboSchema);  //trabaja con la colección "verbos"
/*
mongoose pone 'Verbo' en minúscula y le añade una 's' --> usuarios
en este caso va a coincidir con el nombre de la colección que ya tenemos o que creará i aún no existe
*/