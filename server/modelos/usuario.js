const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['SUPER_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}
  

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true,'El nombre es obligatorio']
    },
    email:{
        type: String,
        unique:true,
        required: [true,'El correo es obligatorio']
    },
    password:{
        type: String,
        required: [true,'El password es obligatorio']
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

/* agregamos método toJSON para cuando se printe este modelo a un json no mostrar el password
    le agregamos un  método al modelo, al esquema del modelo le agregamos el método toJSON 
    que se llama siempre que hace un print y ahí eliinamos el campo password, 
    en este caso NUNCA usar  una función de flecha porque vamos a usar el this.
*/
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
  

usuarioSchema.plugin( uniqueValidator, { message:'{PATH} debe de ser único' });

module.exports = mongoose.model( 'Usuario' , usuarioSchema);  //trabaja con la colección “usuarios”
/*
mongoose pone 'Usuario' en minúscula y le añade una 's' --> usuarios
en este caso va a coincidir con el nombre de la colección que ya tenemos o que creará i aún no existe
*/