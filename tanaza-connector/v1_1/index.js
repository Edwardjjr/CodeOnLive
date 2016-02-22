/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/

var E_Express = require('express');
var E_App = module.exports = E_Express();
var M_Login = require('../../model/loginV1_1');
var M_Ap = require('../../model/ap');
var M_User = require('../../model/userV1_1');
var I_OnLiveLogger = require('../../common/onLiveLogger/index.js');
var I_LogDataBase = require('../../common/logDataBase/index.js');

/*----------------------------------------------------------------------
Paramteros: pReq: el request enviado.
			pRres: el response.

Decripcion:
Este metodo se encarag de enviar un mensaje de OK al servicio que busca 
consumirlo..
-----------------------------------------------------------------------*/

E_App.get('/', function(pReq, pRes) {
	pReq.on('data', function (chunk) {		
	});
	pReq.on('end', function () {
		pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		pRes.end();
	});
});

/*----------------------------------------------------------------------
Paramteros: pJsonBody: El request repostado por tanaza.

Decripcion:
Se tiene procesa el request, el mismo es insertado en la cola de logins por
procesar con un estado de pendiente, si el mismo llega a se procesado con
exito su estado cambia a success.
Nota: Se verifica que no se den errores de paseo, se envia informacion 
a OnLivelogger con el fin de reportar las acciones del programa.
-----------------------------------------------------------------------*/

E_App.post('/', function(pReq, pRes) {
	pReq.on('data', function (pChunk) {
		try
		{
			var _jsonBody = JSON.parse(pChunk);
			I_LogDataBase.RegisterLogin(_jsonBody,registerLogin);
		
		
		}
		catch (ex) {
			
		    I_OnLiveLogger.SendMessage('Error al parsear el json recibido del api de tanaza: '+ err, "error");
		}

	});
	pReq.on('end', function () {
		pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		pRes.end();
	});
});




/*----------------------------------------------------------------------
Paramteros: pJsonBody: es un arreglo en formato json con que contiene 
logins reportado por tanaza.

Decripcion:
Este metodo tiene con funcion registrar cada uno de los login asi como
verificar si el usuario registrado por este login ya se encuentra en la
base de datos de no se asi se agrega un usuario nuevo.
-----------------------------------------------------------------------*/

var registerLogin = function(pJsonBody)
{
	var _counterLogin;
	var _org_id="";
	var _venue_id="";
	var _ap_id = "";
	var _count = 0;
	for (_counterLogin in pJsonBody) {
		_count++;

		M_Ap.findOne({ap_id:pJsonBody[_counterLogin]["ap_id"]}).exec(function(err, results) {
			if(err)
			{
				I_OnLiveLogger.SendMessage('Se genero un error DataBase: '+err, "warn");
			}
			else
			{
				if(results != null)
				{
		        	_org_id =results.org_id;
		        	_venue_id = results.venue_id;
		        	_ap_id = results._id;
		        }
		        else
		        {
		        	I_OnLiveLogger.SendMessage('Se recive datos de un Ap no registrado'+pJsonBody[_counterLogin]["ap_id"], "warn");
		        }
		        M_User.findOne({id:pJsonBody[_counterLogin]["client"]["id"]}).exec(function(err,results)
		        {
			        if(results == null)
			        {

						var _user = new M_User({
							id:pJsonBody[_counterLogin]["client"]["id"],
							first_name:pJsonBody[_counterLogin]["client"]["first_name"],
							last_name:pJsonBody[_counterLogin]["client"]["last_name"],
							picture:pJsonBody[_counterLogin]["client"]["picture"],
							gender:pJsonBody[_counterLogin]["client"]["gender"],
							email:pJsonBody[_counterLogin]["client"]["email"],
							phone:pJsonBody[_counterLogin]["client"]["phone"],
							birthday:pJsonBody[_counterLogin]["client"]["birthday"],
							logins_count:pJsonBody[_counterLogin]["client"]["logins_count"],
							org_id_OnLive:_org_id
						});
						_user.save(function(err) {
							if (err)
							{
								I_OnLiveLogger.SendMessage('Se recibe datos de un user no registrado'+pJsonBody[_counterLogin]["client"]["id"], "warn");
							}
							else
							{
								I_OnLiveLogger.SendMessage('Create user '+pJsonBody[_counterLogin]["client"]["id"], 'info');
							}
						});
					}

					var _login = new M_Login({
					id:pJsonBody[_counterLogin]["id"],
					ap_id:pJsonBody[_counterLogin]["ap_id"],
					ssid: pJsonBody[_counterLogin]["ssid"],
					ip_address:pJsonBody[_counterLogin]["ip_address"],
					mac_address:pJsonBody[_counterLogin]["mac_address"],
					auth_method: pJsonBody[_counterLogin]["auth_method"],
					roaming: pJsonBody[_counterLogin]["roaming"],
					created_at:pJsonBody[_counterLogin]["created_at"],
					org_id_OnLive:_org_id,
					venue_id_OnLive:_venue_id,
					ap_id_OnLive:_ap_id,
						client:
						{
							id:pJsonBody[_counterLogin]["client"]["id"],
							first_name:pJsonBody[_counterLogin]["client"]["first_name"],
							last_name:pJsonBody[_counterLogin]["client"]["last_name"],
							picture:pJsonBody[_counterLogin]["client"]["picture"],
							gender:pJsonBody[_counterLogin]["client"]["gender"],
							email:pJsonBody[_counterLogin]["client"]["email"],
							phone:pJsonBody[_counterLogin]["client"]["phone"],
							birthday:pJsonBody[_counterLogin]["client"]["birthday"],
							logins_count:pJsonBody[_counterLogin]["client"]["logins_count"]
						}
					});
					
					_login.save(function(err) {
						if (err)
						{
							I_OnLiveLogger.SendMessage('Se recibe datos de un login no registrado'+pJsonBody[_counterLogin]["id"], "warn");
						}
						else
						{
							I_OnLiveLogger.SendMessage('Create Login '+pJsonBody[_counterLogin]["id"], 'info');
							if(_count == Object.keys(pJsonBody).length)
						  	{
						  		I_LogDataBase.UpdateLogin(pJsonBody[0]["id"],'success');
						  	}
						}
					 
					});
				});

			}
		});
		
	}

}