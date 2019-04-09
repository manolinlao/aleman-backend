const express = require('express');
const app = express();
const bcrypt  = require('bcryptjs');
const Usuario = require('../modelos/usuario');

const jwt = require('jsonwebtoken');

//middleware de CORS
const { activaCORS } = require('../middlewares/autenticacion');

/*
Los logins por lo general reciben de datos:  email - password
Usamos el método compareSync de bcrypt
*/
app.post('/login',[activaCORS],(req,res)=>{
    //En el body viajarán el email-password
    let body = req.body;

    // veamos si existe ese usuario
    // a findOne le paso la condición de que email sea body.email
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            console.log("LOGIN ERR");
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    mensaje:'(Usuario) o contraseña incorrectas'
                }
            });
        }

        //evaluamos la contraseña
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    mensaje:'Usuario o (contraseña) incorrectas'
                }
            });
        }

            //a sign se le pasa:
                //el payload, le pasamod el usuarioDB
                //   el secret, podemos poner lo que queramos separado por guiones
                //   el expiresIn, ponermos el tiempo en el que espira el token, le
                //   voy a poner en 30 días
        let token = jwt.sign(
                        {usuario: usuarioDB},
                        process.env.SEED,
                        {expiresIn:process.env.CADUCIDAD_TOKEN}
                    );

        //todo es ok
        res.json({
            ok:true,
            usuario: usuarioDB,
            token: token
        });
    });
});


//así podremos usar todas las configuraciones que le hagamos a app para usarla en otros sitios
module.exports = app;
