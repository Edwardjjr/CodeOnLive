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
			I_LogDataBase.RegisterLogin(_jsonBody,registerLogin,_jsonBody['id']);
		
		
		}
		catch (err) {
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
	for (_counterLogin in pJsonBody["client"]) {
		var _pJsonLogin = pJsonBody["client"][_counterLogin];
		_count++;

		M_Ap.findOne({ap_id:_pJsonLogin["ap_id"]}).exec(function(err, results) {
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
		        	I_OnLiveLogger.SendMessage('Se recive datos de un Ap no registrado'+_pJsonLogin["ap_id"], "warn");
		        }
		        M_User.findOne({id:_pJsonLogin["client"]["id"]}).exec(function(err,results)
		        {
			        if(results == null)
			        {

						var _user = new M_User({
							id:_pJsonLogin["client"]["id"],
							first_name:_pJsonLogin["client"]["first_name"],
							last_name:_pJsonLogin["client"]["last_name"],
							picture:_pJsonLogin["client"]["picture"],
							gender:_pJsonLogin["client"]["gender"],
							email:_pJsonLogin["client"]["email"],
							phone:_pJsonLogin["client"]["phone"],
							birthday:_pJsonLogin["client"]["birthday"],
							logins_count:_pJsonLogin["client"]["logins_count"],
							location:
		                    {
		                        name:_pJsonLogin["client"]["location"]["name"],
		                        city:_pJsonLogin["client"]["location"]["city"],
		                        country: _pJsonLogin["client"]["location"]["country"],
		                        country_code: _pJsonLogin["client"]["location"]["country_code"],
		                        latitude: _pJsonLogin["client"]["location"]["latitude"],
		                        longitude: _pJsonLogin["client"]["location"]["latitude"]
		                    },
							org_id_OnLive:_org_id
						});
						_user.save(function(err) {
							if (err)
							{
								I_OnLiveLogger.SendMessage('User no fue salvado en la base de datos '+ _pJsonLogin["client"]["id"]+' '+ err, "warn");
							}
							else
							{
								I_OnLiveLogger.SendMessage('Create user '+_pJsonLogin["client"]["id"], 'info');
							}
						});
					}
					else
					{
						UpdateUser(_pJsonLogin["client"],results)
					}

					var _login = new M_Login({
					id:_pJsonLogin["id"],
					ap_id:_pJsonLogin["ap_id"],
					ssid: _pJsonLogin["ssid"],
					ip_address:_pJsonLogin["ip_address"],
					mac_address:_pJsonLogin["mac_address"],
					auth_method: _pJsonLogin["auth_method"],
					roaming: _pJsonLogin["roaming"],
					created_at:_pJsonLogin["created_at"],
					org_id_OnLive:_org_id,
					venue_id_OnLive:_venue_id,
					ap_id_OnLive:_ap_id,
						client:
						{
							id:_pJsonLogin["client"]["id"],
							first_name:_pJsonLogin["client"]["first_name"],
							last_name:_pJsonLogin["client"]["last_name"],
							picture:_pJsonLogin["client"]["picture"],
							gender:_pJsonLogin["client"]["gender"],
							email:_pJsonLogin["client"]["email"],
							phone:_pJsonLogin["client"]["phone"],
							birthday:_pJsonLogin["client"]["birthday"],
							logins_count:_pJsonLogin["client"]["logins_count"],
							location:
		                    {
		                        name:_pJsonLogin["client"]["location"]["name"],
		                        city:_pJsonLogin["client"]["location"]["city"],
		                        country: _pJsonLogin["client"]["location"]["country"],
		                        country_code: _pJsonLogin["client"]["location"]["country_code"],
		                        latitude: _pJsonLogin["client"]["location"]["latitude"],
		                        longitude: _pJsonLogin["client"]["location"]["latitude"]
		                    }
						}
					});
					
					_login.save(function(err) {
						if (err)
						{
							I_OnLiveLogger.SendMessage('Login no registrado'+_pJsonLogin["id"], "warn");
						}
						else
						{
							I_OnLiveLogger.SendMessage('Create Login '+_pJsonLogin["id"], 'info');
							if(_count == Object.keys(pJsonBody["client"]).length)
						  	{
						  		I_LogDataBase.UpdateLogin(pJsonBody["id"],'success');
						  	}
						}
					 
					});
				});

			}
		});
		
	}

}

/*----------------------------------------------------------------------
Paramteros: pUser: Json con la informacion de usuario enviada en el login.
			pUserDataBase: usuario recuperado de la base de datos.

Decripcion:
Se encarga de comparar el usuario registrado en la base de datos y el 
recibido en el login si alguno de los valores cambio el mismo es actuli-
zado, y se registra en cambio.
-----------------------------------------------------------------------*/

var UpdateUser = function(pUser, pUserDataBase)
{	
	var _fields=["first_name","last_name","picture","gender","email","phone","birthday","logins_count","location"];
	var _fieldsLocation = ["name","city","country","country_code","latitude","longitude"] 
	for(_counterField in _fields)
	{
		var _field =  _fields[_counterField];
		if(_field == "location")
		{
			for(_counterFieldLocation in _fieldsLocation)
			{


				var _fieldLocation = _fieldsLocation[_counterFieldLocation];
				if((pUser[_field][_fieldLocation] != pUserDataBase[_field][_fieldLocation]) && (pUser[_field][_fieldLocation] != null))
				{
					I_OnLiveLogger.SendMessage('Se actualizo el usuario '+pUser["id"] + ' el campo '+ _fieldLocation + 
					' Anterior: '+ pUserDataBase[_field][_fieldLocation]+ 
					' Actual: ' + pUser[_field][_fieldLocation] , "info");
				}
				if(_counterFieldLocation == _fieldsLocation.length)
				{
					results.UpdateUser(pUser);
				}
			}
		}
		else
		{
			if((pUser[_field]!= pUserDataBase[_field])&&(pUser[_field]!= null))
			{
				I_OnLiveLogger.SendMessage('Se actualizo el usuario '+pUser["id"] + ' el campo '+ _field+ 
				': Anterior: '+ pUserDataBase[_field] + ' Actual: ' + pUser[_field] , "info");		
			}
		}
	}
}

module.exports.registerLogin = registerLogin;