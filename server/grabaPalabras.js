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
    grabaPalabras(lineasData).then(resultado=>{
        console.log("******************************************************"); 
        console.log("final de grabapalabras. resultado = " + resultado);
        mongoose.disconnect();   
    })
    .catch(e=>{
        console.log("error con grabaPalabras",e);
        mongoose.disconnect();   
    })
});

const grabaPalabras = async (lineas) => {
    for(let i in lineas){
        let linea = lineas[i].trim();
        if(linea.length!=0){  
            console.log("******************************************************"); 
            let palabraAGrabar = creaPalabra(linea);
            if(palabraAGrabar){
                console.log("GRABANDO PALABRA");
                let isPalabraInDB = await existePalabra(palabraAGrabar);
                console.log("grabaPalabras::isPalabraInDB="+isPalabraInDB);
                if(!isPalabraInDB){
                    let resultadoGrabacion = await grabaPalabra(palabraAGrabar);
                    console.log("grabaPalabras::resultadoGrabacion="+resultadoGrabacion);
                }
            }
        }
        else{
            console.log("LINEA MALA:"+linea)
        }
    }

    return("ok");

}

const existePalabra = async (palabra) => {
    //Mongoose queries are not promises.
    //They have a .then() function for co and async/await as a convenience. 
    //If you need a fully-fledged promise, use the .exec() function.
    const query = Palabra.find({ale:palabra.ale,cas:palabra.cas});
    const userData = await query.exec();
    if(userData==null || userData.length==0){
        return false;
    }
    return true;
}

const grabaPalabra = async (palabra) => {
    try{
        const palabraDB = await palabra.save();

        if(palabraDB.length==0){
            console.log("grabaPAlabra","leng es 0");
            return false;
        }
        return true;
    }catch(e){
        console.log("grabaPalabra::excepcon",e)
        return false;
    }
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


