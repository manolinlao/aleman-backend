const express = require('express');
const app = express();


const Palabra = require('../modelos/palabra');
const Verbo = require('../modelos/verbo');

//middleware de autenticacion
const { verificaToken,verificaSuper_Role,activaCORS } = require('../middlewares/autenticacion');

//Obtiene todas las palabras, no hace falta autenticación con token
//Necesita el middleware para activar el CORS
//usando la aplicación que he deployado en herokku: https://aleman-backend.herokuapp.com/getallpalabras

app.get('/getAllPalabras',[activaCORS],(req,res)=>{
    Palabra.find({})
        .sort('ale')
        .exec((err,palabras)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            let palabrasProcesadas = [];
            for(let i in palabras){

                let presente = "";
                let pasado = "";
                if(palabras[i].tipo==='v'){
                    
                }

                let palabra = {
                    cas:palabras[i].cas,
                    ale:palabras[i].ale,
                    tipo:palabras[i].tipo,
                    genero:palabras[i].genero,
                    plural:palabras[i].plural,
                    presente:presente,
                    pasado:pasado,
                }
                palabrasProcesadas.push(palabra);
            }

            Palabra.countDocuments({},(err,conteo)=>{
                res.json({
                    ok: true,
                    palabras:palabrasProcesadas,
                    cuantos:conteo
                });
            });
        });
});

//Obtiene todos los verbos, no hace falta autenticación con token
app.get('/getAllVerbos',(req,res)=>{
    Palabra.find({tipo:'v'})
        .exec((err,verbos)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok: true,
                verbos,
            });
            
        });
});

//retorna las palabras cuyo cas es el que se le pasa 
app.get('/getPalabraCas/:palabraCas',[activaCORS],(req,res)=>{
    let palabraCas = req.params.palabraCas.toLowerCase();
    Palabra.find({cas:palabraCas})
            .exec((err,palabras)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }
                
                res.json({
                    ok: true,
                    palabras,
                });
               
            });
});

//retorna las palabras cuyo ale es el que se le pasa
app.get('/getPalabraAle/:palabraAle',[activaCORS],(req,res)=>{
    let palabraAle = req.params.palabraAle.toLowerCase();
    Palabra.find({ale:palabraAle})
            .exec((err,palabras)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }
                
                res.json({
                    ok: true,
                    palabras,
                });
               
            });
});

// introduce una palabra
// necesita el usuario, y debe ser SUPER_ROLE!!!
//app.post('/palabra',[activaCORS,verificaToken,verificaSuper_Role],(req,res)=>{
//app.post('/palabra',[activaCORS],(req,res)=>{
app.post('/palabra',[verificaToken,verificaSuper_Role],(req,res)=>{
    let body = req.body;
    let palabra = new Palabra({
        cas: body.cas.toLowerCase(),
        ale: body.ale.toLowerCase(),
        tipo: body.tipo.toLowerCase(),
        genero: body.genero.toLowerCase(),
        plural: body.plural.toLowerCase(),
        nivel: body.nivel.toLowerCase()
    });

    Palabra.find({ale:palabra.ale,cas:palabra.cas})
    .exec((err,palabras)=>{
        let existePalabra = false;
        if(err){
            
        }
        else{
            if(palabras.length>0){
               existePalabra = true;
            }else{
               
            }
        }

        if(existePalabra){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Palabra ya en BD. No se graba'
                }
            });
        }
        palabra.save((err,palabraDB)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!palabraDB){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'No se ha podido grabar la palabra'
                    }
                });
            }
            res.json({
                ok: true,
                palabra: palabraDB
            });
        });

    });
});


module.exports = app;
