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
var M_Login = require('../../model/loginV2');
var M_Ap = require('../../model/ap');
var M_User = require('../../model/userV2');
var I_OnLiveLogger = require('../../common/onLiveLogger/index.js');
var I_LogDataBase = require('../../common/logDataBase/index.js');
var I_Parser= require('../v2/index.js');

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
		var _jsonBody;
		try
		{
			_jsonBody = JSON.parse(pChunk);
			I_LogDataBase.RegisterLogin(_jsonBody,registerLogin,_jsonBody[0]['id']);
		
		
		}
		catch (ex) {
			//Se modifico por las versiones de parseo.
			I_Parser.registerLogin(_jsonBody);
		    //I_OnLiveLogger.SendMessage('Error al parsear el json recibido del api de tanaza: '+ err, "error");
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
		var _JsonLogin = pJsonBody[_counterLogin];
		M_Ap.findOne({ap_id:_JsonLogin["ap_id"]}).exec(function(err, results) {
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
		        	I_OnLiveLogger.SendMessage('Se recive datos de un Ap no registrado'+_JsonLogin["ap_id"], "warn");
		        }
		        M_User.findOne({id:_JsonLogin["client"]["id"]}).exec(function(err,results)
		        {
			        if(results == null)
			        {

						var _user = new M_User({
							id:_JsonLogin["client"]["id"],
							first_name:_JsonLogin["client"]["first_name"],
							last_name:_JsonLogin["client"]["last_name"],
							picture:_JsonLogin["client"]["picture"],
							gender:_JsonLogin["client"]["gender"],
							email:_JsonLogin["client"]["email"],
							phone:_JsonLogin["client"]["phone"],
							birthday:_JsonLogin["client"]["birthday"],
							logins_count:_JsonLogin["client"]["logins_count"],
							location:
		                    {
		                        name:_JsonLogin["client"]["location"]["name"],
		                        city:_JsonLogin["client"]["location"]["city"],
		                        country: _JsonLogin["client"]["location"]["country"],
		                        country_code: _JsonLogin["client"]["location"]["country_code"],
		                        latitude: _JsonLogin["client"]["location"]["latitude"],
		                        longitude: _JsonLogin["client"]["location"]["latitude"]
		                    },
							org_id_OnLive:_org_id
						});
						_user.save(function(err) {
							if (err)
							{
								I_OnLiveLogger.SendMessage('Se recibe datos de un user no registrado'+_JsonLogin["client"]["id"], "warn");
							}
							else
							{
								I_OnLiveLogger.SendMessage('Create user '+_JsonLogin["client"]["id"], 'info');
							}
						});
					}
					else
					{
						UpdateUser(_JsonLogin["client"],results)
					}

					var _login = new M_Login({
					id:_JsonLogin["id"],
					ap_id:_JsonLogin["ap_id"],
					ssid: _JsonLogin["ssid"],
					ip_address:_JsonLogin["ip_address"],
					mac_address:_JsonLogin["mac_address"],
					auth_method: _JsonLogin["auth_method"],
					roaming: _JsonLogin["roaming"],
					created_at:_JsonLogin["created_at"],
					org_id_OnLive:_org_id,
					venue_id_OnLive:_venue_id,
					ap_id_OnLive:_ap_id,
						client:
						{
							id:_JsonLogin["client"]["id"],
							first_name:_JsonLogin["client"]["first_name"],
							last_name:_JsonLogin["client"]["last_name"],
							picture:_JsonLogin["client"]["picture"],
							gender:_JsonLogin["client"]["gender"],
							email:_JsonLogin["client"]["email"],
							phone:_JsonLogin["client"]["phone"],
							birthday:_JsonLogin["client"]["birthday"],
							logins_count:_JsonLogin["client"]["logins_count"],
							location:
		                    {
		                        name:_JsonLogin["client"]["location"]["name"],
		                        city:_JsonLogin["client"]["location"]["city"],
		                        country: _JsonLogin["client"]["location"]["country"],
		                        country_code: _JsonLogin["client"]["location"]["country_code"],
		                        latitude: _JsonLogin["client"]["location"]["latitude"],
		                        longitude: _JsonLogin["client"]["location"]["latitude"]
		                    }
						}
					});
					
					_login.save(function(err) {
						if (err)
						{
							I_OnLiveLogger.SendMessage('Login no registrado'+_JsonLogin["id"], "warn");
						}
						else
						{
							I_OnLiveLogger.SendMessage('Create Login '+_JsonLogin["id"], 'info');
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

var UpdateUser = function(pUser, pUserDataBase)
{
	var _fields=["first_name","last_name","picture","gender","email","phone","birthday","logins_count","location"];
	var _fieldsLocation = ["name","city","country","country_code","latitude","longitude"] 
	for(_counterField in _fields)
	{
		if(_fields[_counterField] == "location")
		{
			for(_counterFieldLocation in _fieldsLocation)
			{
				if(pUser[_fields[_counterField]][_fieldsLocation[_counterFieldLocation]]!= pUserDataBase[_fields[_counterField]])
				{
					var _stringField = 'location.'+[_fieldsLocation[_counterFieldLocation]];
					M_User.update({"id":pUserDataBase["id"]},{ $set: { _stringField: pUser[_fields[_counterField]] }},{ multi: true },
					function  (err, numAffected) {
						if(err)
						{
							I_OnLiveLogger.SendMessage( 'Error no se actualizo en Usuario: ' + pId, 'error');
						}
						else
						{
							I_OnLiveLogger.SendMessage('Se actualizo el usuario '+pUser["id"] + ' el campo '+ _stringField+ 
							': Anterior: '+ pUserDataBase[_fields[_counterField]][_fieldsLocation[_counterFieldLocation]]+ 
							' Actual: ' + pUser[_fields[_counterField]][_fieldsLocation[_counterFieldLocation]] , "info");
						}
						
					});
				}
			}
		}
		else
		{
			if(pUser[_fields[_counterField]]!= pUserDataBase[_fields[_counterField]])
			{
				var _stringField = _fields[_counterField];
				M_User.update({"id":pUserDataBase["id"]},{ $set: { _stringField: pUser[_fields[_counterField]] }},{ multi: true },
					function  (err, numAffected) {
						if(err)
						{
							I_OnLiveLogger.SendMessage( 'Error no se actualizo en Usuario: ' + pId, 'error');
						}
						else
						{
							I_OnLiveLogger.SendMessage('Se actualizo el usuario'+pUser["id"] + ' el campo '+ _fields[_counterField]+ 
							': Anterior: '+ pUserDataBase[_fields[_counterField]]+ ' Actual: ' + pUser[_fields[_counterField]] , "info");
						}
						
					});
			}
		}
	}
}

module.exports.registerLogin = registerLogin;