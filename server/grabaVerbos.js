require('./config/config');

const mongoose = require('mongoose');

const Verbo = require('./modelos/verbo');

let fs = require('fs');

// Conexión con la BD llamada 'aleman'
mongoose.connect(process.env.URLDB, { useNewUrlParser: true },(error,respuesta)=>{
    if(error){
        console.log("Error conectando cono BD en puerto 27017");
        return;
    }
    console.log('Base de datos ONLINE');

    //el fichero words acaba en #
    let data = fs.readFileSync('./bd/verbs.txt', 'utf-8');

    let lineasData = data.split('\r\n') //tengo un array de strings con las lineas
    grabaVerbos(lineasData).then(resultado=>{
        console.log("******************************************************"); 
        console.log("final de grabaVerbos. resultado = " + resultado);
        mongoose.disconnect();   
    })
    .catch(e=>{
        console.log("error con grabaVerbos",e);
        mongoose.disconnect();   
    })
});

const grabaVerbos = async (lineas) => {
    for(let i in lineas){
        let linea = lineas[i].trim();
        if(linea.length!=0){  
            console.log("******************************************************"); 
            let verboAGrabar = creaVerbo(linea);
            console.log("verboAgrabar="+verboAGrabar);
            
            if(verboAGrabar!=null){
                console.log("GRABANDO VERBO");
                let isVerboInDB = await existeVerbo(verboAGrabar);
                console.log("grabaVerbos::isVerboInDB="+isVerboInDB);
                if(!isVerboInDB){
                    let resultadoGrabacion = await grabaVerbo(verboAGrabar);
                    console.log("grabaVerbos::resultadoGrabacion="+resultadoGrabacion);
                }
            }
            
        }
        else{
            console.log("LINEA MALA:"+linea)
        }
    }

    return("ok");

}

const existeVerbo = async (verbo) => {
    //Mongoose queries are not promises.
    //They have a .then() function for co and async/await as a convenience. 
    //If you need a fully-fledged promise, use the .exec() function.
    const query = Verbo.find({ale:verbo.ale});
    const userData = await query.exec();
    if(userData==null || userData.length==0){
        return false;
    }
    return true;
}

const grabaVerbo = async (verbo) => {
    try{
        const verboDB = await verbo.save();

        if(verboDB.length==0){
            console.log("grabaVerbo","leng es 0");
            return false;
        }
        return true;
    }catch(e){
        console.log("grabaVerbo::excepcion",e)
        return false;
    }
}




function creaVerbo(stringVerbo){
    let verbo = null;
    try{
        
        let componentesVerbo = stringVerbo.toLowerCase().split(',');
        for(let i in componentesVerbo){
            componentesVerbo[i] = componentesVerbo[i].trim();
        }

        let infinitivo = componentesVerbo[0];
        let irregular =  false;
        if(componentesVerbo[1]==="i"){
            irregular = true;
        }
        let participioperfecto = componentesVerbo[2];
        let participiopresente = componentesVerbo[3];
       
        //presente
        let presente = "";
        for(let i=4;i<10;i++){
            let valor = componentesVerbo[i].trim();
            presente = presente+','+valor;
        }
        presente = presente.substring(1,presente.length);
        //pasado
        let pasado = "";
        try{
            for(let i=10;i<16;i++){
                let valor = componentesVerbo[i].trim();
                pasado = pasado+','+valor;
            }
            pasado = pasado.substring(1,pasado.length);
        }catch(e){
            pasado = "";
        }
        

        verbo = new Verbo({
            ale:infinitivo,
            presente:presente,
            pasado:pasado,
            futuro:"",
            irregular,
            participiopresente,
            participioperfecto,
        });

    }catch(e){
        console.log("creaVerbo::excepcion = " + e.description);
        verbo = null;
    }

    return verbo;

}


