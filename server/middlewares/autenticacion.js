const jwt = require('jsonwebtoken');


//activa el CORS
let activaCORS = (req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}


//================================
// Verificar el token
//================================
let verificaToken = (req, res, next) => {

  console.log("VERIFICA TOKEN");

    let token = req.get('token'); //le paso el nombre del header
  
    jwt.verify(token, process.env.SEED, (err,decoded)=>{
      if(err){
        return res.status(401).json({
          ok: false,
          err: err
        });
      }
  
      //el decoded contiene info del usuario, es el payload
      //sé que en el objeto que encripté puse el usuario
      //puedo hacer que cualquier petición tenga acceso a la info del usuario
      req.usuario = decoded.usuario;
      next();
    });
};

//================================
// Verifica el SUPER role
//================================
let verificaSuper_Role = (req, res, next)=>{

    let usuario = req.usuario;
  
    if( usuario.role === 'SUPER_ROLE'){
      next();
    }else{
        return res.json({
          ok: false,
          err:{
            message: ' El usuario no es administrador'
          }
        });
    }
  
  };
    
  
module.exports = {
    verificaToken,
    verificaSuper_Role,
    activaCORS,
}
  