/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/

var E_Express = require('express');
var E_App = E_Express();
var E_BodyParser = require('body-parser');
var E_Nconf = require ('nconf');
E_Nconf.argv()
.env().file({ file: './config.json' });
var E_mongoose = require('mongoose');
var E_Jwt = require('jsonwebtoken');
var I_Client = require('./api/v1/client/index.js');
var I_OnLiveLogger = require('./common/onLiveLogger/index.js');
var formidable = require('express-formidable');


/*----------------------------------------------------------------------
Decripcion:
Esto permite que las solicitudes recibidas sean decodificadas para que }
trabajen con la libreria express.
-----------------------------------------------------------------------*/
//E_App.use(E_BodyParser.urlencoded());
E_App.use(formidable.parse());


/*----------------------------------------------------------------------
Paramteros: pReq: el request enviado.
            pRres: el response.
            pNext: Permite continuar el codigo.

Decripcion:
Se agregan estos header para poder ejecutar las pruebas de desarrollo 
en el servidor local ya que sino se concidera de riesgo para un servidor 
tener respuesta del mismo servidor ya que se uede ejecuatr un script  y 
dañar el codigo.
-----------------------------------------------------------------------*/
E_App.use('/',function(pReq, pRes, pNext) { 
  pRes.header('Access-Control-Allow-Origin', "*"); 
  pRes.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); 
  //pRes.header('Access-Control-Allow-Headers', 'Content-Type'); 
  pNext();
})


/*----------------------------------------------------------------------
Paramteros: pReq: el request enviado.
            pRres: el response.

Decripcion:
Metodo de prueba para ver como tomar el token recibido paar verificar la
autorizacion del usuraio.
-----------------------------------------------------------------------*/

/*E_App.use('/api',function(pReq, pRes,pNext) {
    E_Jwt.verify(pReq.headers['accept'], 'prueba', function(err, decoded) {
      if(err)
      {
        I_OnLiveLogger.SendMessage('Error de token:'+ err, 'info');
        return pRes.status(500).send("Token expires");
      }
      else
      {
        pNext();
      }
    });
});*/

/*----------------------------------------------------------------------
Decripcion:
Permite poder tener acceso a la carpeta api.
-----------------------------------------------------------------------*/
E_App.use('/api', require('./api'));



/*----------------------------------------------------------------------
Paramteros: pUser:Se recibe los datos de un usuario.

Decripcion:
El metodo crea un jsonwebtoken para el usario especificado.
-----------------------------------------------------------------------*/
function createToken(pUser) {
  return E_Jwt.sign(pUser, 'prueba', { expiresIn: '5m' });
}



/*----------------------------------------------------------------------
Decripcion:
Se leen los parameotros para conectar con la base de datos ya sea local
o la del servidor dependiendo del ambienite donde se corra el server.
-----------------------------------------------------------------------*/

var url = E_Nconf.get('database:localUrl');
//var url = 'mongodb://admin:gHaM1EuPFxE7@56a8f56489f5cf3dc10000d2-onlivecr.rhcloud.com:37576/nodejs';
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL + E_Nconf.get('database:OPENSHIFT_APP_NAME_SCALABLE');
}

// Connect to mongodb
var connect = function () {
    E_mongoose.connect(url);
};
connect();





E_App.get('/', function(pReq, pRes) {
	pReq.on('data', function (chunk) {
	});
	preq.on('end', function () {
		pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		pRes.end();
	});
});


/*----------------------------------------------------------------------
Paramteros: pReq: el request enviado.
            pRres: el response.

Decripcion:
Este metodo se encarga de tomar los datos enviados por el usuario
(email, password) y verificar si es un usuario registardo, de ser asi
solicita un jsonwebtoken el cual envia al solicitante para establecer
una conexion segura.
-----------------------------------------------------------------------*/
E_App.post('/', function(pReq, pRes) {
  if (!pReq.body.username || !pReq.body.password) {
    return pRes.status(400).send("You must send the username and the password");
  }

  I_Client.compareClient(pReq.body.username,pReq.body.password,function(err, user)
  { 
    if(!err)
    {
      return pRes.status(401).send("The username or password don't match");
    }
    pRes.status(200).send({
      id_token: createToken(user),
      user: user
    });
  });
  

  
});


/*----------------------------------------------------------------------
Decripcion:
Se encarga de levantar el servidor para escuchar las peticiones.
-----------------------------------------------------------------------*/

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || E_Nconf.get('host');
var port = process.env.OPENSHIFT_NODEJS_PORT || E_Nconf.get('port');
E_App.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port'+ port);
});
