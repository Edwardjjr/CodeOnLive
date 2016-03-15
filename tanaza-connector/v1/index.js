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
var M_Login = require('../../model/login');
var M_Ap = require('../../model/ap');
var M_User = require('../../model/user');
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
		var _jsonBody;
		try
		{
			_jsonBody = JSON.parse(pChunk);
			I_LogDataBase.RegisterLogin(_jsonBody,registerLogin,_jsonBody[0]['id']);
		
		
		}
		catch (ex) {
			//Se modifico por las versiones de parseo.
			//I_Parser.registerLogin(_jsonBody);
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
		        	I_OnLiveLogger.SendMessage('Se reciben datos de un Ap no registrado'+_JsonLogin["ap_id"], "warn");
		        }
		        M_User.findOne({id:_JsonLogin["client"]["id"]}).exec(function(err,results)
		        {
			        if(results == null)
			        {

						var _user = new M_User({
							id:_JsonLogin["client"]["id"],
							email:_JsonLogin["client"]["email"],
							first_name:_JsonLogin["client"]["first_name"],
							last_name:_JsonLogin["client"]["last_name"],
							location:_JsonLogin["client"]["location"],
							location_latitude:_JsonLogin["client"]["location_latitude"],
							location_longitude:_JsonLogin["client"]["location_longitude"],
							created_at:_JsonLogin["client"]["created_at"],
							gender:_JsonLogin["client"]["gender"],
							city:_JsonLogin["client"]["city"],
							country:_JsonLogin["client"]["country"],
							country_code:_JsonLogin["client"]["country_code"],
							picture:_JsonLogin["client"]["picture"],
							logins_count:_JsonLogin["client"]["logins_count"],
							provider:getTanazaLoginProviderName(_JsonLogin["client"]["provider"]),
							birthday:_JsonLogin["client"]["birthday"],
							phone:_JsonLogin["client"]["phone"],
							client_mac:_JsonLogin["client"]["client_mac"],
							last_time_seen:_JsonLogin["client"]["last_time_seen"],
							org_id_OnLive:_org_id
						});
						_user.save(function(err) {
							if (err)
							{
								I_OnLiveLogger.SendMessage('User no fue salvado en la base de datos '+ _pJsonLogin["client"]["id"]+' '+ err, "warn");
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
					ip_address:_JsonLogin["ip_address"],
					client_mac:_JsonLogin["client_mac"],
					created_at:_JsonLogin["created_at"],
					provider:getTanazaLoginProviderName(_JsonLogin["provider"]),
					registration:_JsonLogin["registration"],
					user_agent:_JsonLogin["user_agent"],
					splash_page_label:_JsonLogin["splash_page_label"],
					splash_page_url: _JsonLogin["splash_page_url"],
					org_id_OnLive:_org_id,
					venue_id_OnLive:_venue_id,
					ap_id_OnLive:_ap_id,
					client:
						{
							id:_JsonLogin["client"]["id"],
							email:_JsonLogin["client"]["email"],
							first_name:_JsonLogin["client"]["first_name"],
							last_name:_JsonLogin["client"]["last_name"],
							location:_JsonLogin["client"]["location"],
							location_latitude:_JsonLogin["client"]["location_latitude"],
							location_longitude:_JsonLogin["client"]["location_longitude"],
							created_at:_JsonLogin["client"]["created_at"],
							gender:_JsonLogin["client"]["gender"],
							city:_JsonLogin["client"]["city"],
							country:_JsonLogin["client"]["country"],
							country_code:_JsonLogin["client"]["country_code"],
							picture:_JsonLogin["client"]["picture"],
							logins_count:_JsonLogin["client"]["logins_count"],
							provider:getTanazaLoginProviderName(_JsonLogin["client"]["provider"]),
							birthday:_JsonLogin["client"]["birthday"],
							phone:_JsonLogin["client"]["phone"],
							client_mac:_JsonLogin["client"]["client_mac"],
							last_time_seen:_JsonLogin["client"]["last_time_seen"]
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

/*----------------------------------------------------------------------
Paramteros: pUser: El usuario reportado en el login.
			pUserDataBase: el usuario registrado en la base de datos.
Decripcion:
Actualiza los datos de usuario registrado en la base de datos he informa
de los cambios.
-----------------------------------------------------------------------*/

var UpdateUser = function(pUser, pUserDataBase)
{	
	var _fields=["email","first_name","last_name","picture","location","location_latitude",
	"location_longitude","created_at","gender","city","country","country_code","picture",
	"logins_count","provider","birthday","phone","client_mac","last_time_seen"];
	for(_counterField in _fields)
	{
		var _field =  _fields[_counterField];
		if(_field == "provider")
		{
			if((getTanazaLoginProviderName(pUser[_field])!= pUserDataBase[_field])&&(pUser[_field]!= null))
			{
				I_OnLiveLogger.SendMessage('Se actualizo el usuario '+pUser["id"] + ' el campo '+ _field+ 
				': Anterior: '+ pUserDataBase[_field] + ' Actual: ' + getTanazaLoginProviderName(pUser[_field]) , "info");		
			}
		}
		else
		{
			if((pUser[_field]!= pUserDataBase[_field])&&(pUser[_field]!= null))
			{
				I_OnLiveLogger.SendMessage('Se actualizo el usuario '+pUser["id"] + ' el campo '+ _field+ 
				': Anterior: '+ pUserDataBase[_field] + ' Actual: ' + pUser[_field] , "info");		
			}
			if(_counterField == (_fields.length-1))
			{
				pUserDataBase.UpdateUser(pUser);
			}
		}
	}
}

/*----------------------------------------------------------------------
Paramteros: pProviderId: Identificador de metodo de acceso utilizado por
el usuario.
Decripcion:
Se convirte este identificador numeral a una descripcion de string.
-----------------------------------------------------------------------*/

var getTanazaLoginProviderName = function (pProviderId) {
	switch(pProviderId)
	{
		case 1:
			return "google";
		case 2:
			return "linkedin";
		case 3:
			return "facebook";
		case 4:
			return "twitter";
		case 5:
			return "instagram";
		case 6:
			return "live";
		case 7:
			return "tanaza-click";
		case 8:
			return "tanaza-email";
		case 9:
			return "tanaza-phone";
		case 10:
			return "tanaza-emailphone";
		case 11:
			return "tanaza-code";
		default:
			return "unknown";
	}
}

module.exports.registerLogin = registerLogin