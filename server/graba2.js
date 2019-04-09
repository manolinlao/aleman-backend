require('./config/config');

const mongoose = require('mongoose');

const Palabra = require('./modelos/palabra');

let fs = require('fs');

// Conexión con la BD llamada 'aleman'
mongoose.connect(process.env.URLDB, { useNewUrlParser: true },(error,respuesta)=>{
    if(error){
        console.log("Error conectando cono BD en puerto 27017");
        return;
    }
    console.log('Base de datos ONLINE');

    //el fichero words acaba en #
    let data = fs.readFileSync('./bd/words.txt', 'utf-8');

    let lineasData = data.split('\r\n') //tengo un array de strings con las lineas
    for(let i in lineasData){
        let linea = lineasData[i].trim();
        if(linea.length!=0){   
            let palabraAGrabar = creaPalabra(linea);
            if(palabraAGrabar){
                console.log("GRABANDO PALABRA");
                grabaPalabra(palabraAGrabar);
            }
        }
    }
});


const grabaPalabra = (palabra) =>{
    //grabamos la palabra si no existe un cas-ale en la BD
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
                console.log("existe palabra " + palabra.cas+"-"+palabra.ale + ". NO grabamos");
            }else{
                console.log("no existe palabra. " + palabra.cas+"-"+palabra.ale + " SI grabamos");

                palabra.save((err,palabraDB)=>{
                    if(err){
                        console.log("no se ha podido grabar la palabra err = " + err);
                    
                    }
                    if(!palabraDB){
                        console.log("no se ha podido grabar la palabra");
                        
                    }
                    console.log("palabra " + palabra.cas+"-"+palabra.ale + " grabada correcamente. " + palabraDB);                 
                });
            }
        });
}

function creaPalabra(arrayPalabra){
    let palabra;
    try{
        console.log("creaPalabra::" + arrayPalabra);
        let tagsPalabra = arrayPalabra.split(',');
        console.log(tagsPalabra);

        if(tagsPalabra.length!=3 && tagsPalabra.length!=4){
            console.log("entrada no válida");
            return;
        }
        let nivel = "";
        let genero = "";
        let plural = "";
        let tipo = "";
        let ale = "";
        let cas = "";
        
        if(tagsPalabra.length==3){          
            tipo = "s";
            cas = tagsPalabra[0].trim();
            ale = tagsPalabra[1].trim();
            plural = tagsPalabra[2].trim();
           

            if(ale.substring(0,3)=="die"){
                genero = 'f';
            }
            if(ale.substring(0,3)=="der"){
                genero = 'm';
            }
            if(ale.substring(0,3)=="das"){
                genero = 'n';
            }
            ale = ale.substring(3,ale.length).trim();
            if(plural=="") plural = ale;
        }else{
            tipo = tagsPalabra[3];
            cas = tagsPalabra[0].trim();
            ale = tagsPalabra[1].trim();
        }

        palabra = new Palabra({
            cas:cas,
            ale:ale,
            tipo:tipo,
            genero:genero,
            plural:plural,
            nivel:nivel
        });

    }catch(e){
        console.log("creaPalabra::excepcion = " + e.description);
        palabra = null;
    }

    return palabra;

}


