const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let tiposValidos = {
    values: ['v','s','a','o'],
    message: '{VALUE} no es un tipo válido'
}

let generosValidos = {
    values: ['m','n','f',''],
    message: '{VALUE} no es un género válido'
}

let palabraSchema = new Schema({
    cas:{
        type: String,
        required: [true,'La palabra en Español es obligatoria']
    },
    ale:{
        type: String,
        required: [true,'La palabra en Aleman es obligatoria']
    },
    tipo:{
        type: String,
        required: [true,'El tipo es obligatorio v(verbo) s(sustantivo) a(adjetivo) o(otros)'],
        enum: tiposValidos
    },
    genero:{
        type: String,
        enum: generosValidos
    },
    plural:{
        type: String
    },
    nivel:{
        type: String
    }
});



module.exports = mongoose.model( 'Palabra' , palabraSchema);  //trabaja con la colección "palabras"
/*
mongoose pone 'Palabra' en minúscula y le añade una 's' --> usuarios
en este caso va a coincidir con el nombre de la colección que ya tenemos o que creará i aún no existe
*/