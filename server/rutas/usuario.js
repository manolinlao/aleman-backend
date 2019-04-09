const express = require('express');
const app = express();

const bcrypt  = require('bcryptjs');

const Usuario = require('../modelos/usuario');

app.get('/usuario',(req,res)=>{
    res.json({
        ok:true,
        mensaje: 'hola get usuario'
    })
});

app.post('/usuario',(req,res)=>{
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });
    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({  //podría poner res.status(200).json({...}), pero poniendo res.json el 200 va implícito
            ok:true,
            usuario: usuarioDB
        });
    });
});


module.exports = app;