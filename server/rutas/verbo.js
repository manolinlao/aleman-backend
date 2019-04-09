const express = require('express');
const app = express();

const Verbo = require('../modelos/verbo');

//middleware de autenticacion
const { verificaToken,verificaSuper_Role,activaCORS } = require('../middlewares/autenticacion');

app.get('/getconjugaciones',[activaCORS],(req,res)=>{
    Verbo.find({})
        .sort('ale')
        .exec((err,verbos)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            Verbo.countDocuments({},(err,conteo)=>{
                res.json({
                    ok: true,
                    verbos,
                });
            });
        });
});

//retorna las palabras cuyo ale es el que se le pasa
app.get('/getVerboAle/:verboAle',[activaCORS],(req,res)=>{
    let verboAle = req.params.verboAle.toLowerCase();
    Verbo.find({ale:verboAle})
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

// introduce un verbo
// necesita el usuario, y debe ser SUPER_ROLE!!!
app.post('/verbo',[verificaToken,verificaSuper_Role],(req,res)=>{
    let body = req.body;
    let verbo = new Verbo({
        ale: body.ale.toLowerCase(),
        presente: body.presente.toLowerCase(),
        pasado: body.pasado,
        futuro: body.futuro
    });
    verbo.save((err,verboDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!verboDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No se ha podido grabar el verbo'
                }
            });
        }
        res.json({
            ok: true,
            verbo: verboDB
        });
    });
});


module.exports = app;
