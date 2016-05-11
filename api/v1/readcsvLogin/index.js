/*---------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/
var E_Express = require('express');
var E_App = module.exports = E_Express();
var M_Login = require('../../../model/login');
var M_User = require('../../../model/user');
var M_Ap = require('../../../model/ap');
var I_OnLiveLogger = require('../../../common/onLiveLogger/index.js');
var csv = require('csv-parser');
var fs=require("fs");
var moment = require('moment');

/*----------------------------------------------------------------------
Paramteros: pReq: el request enviado.
			pRres: el response.

Decripcion:
Este metodo se encarag de enviar un mensaje de OK al servicio que busca 
consumirlo..
-----------------------------------------------------------------------*/

E_App.post('/', function(pReq, pRes) {
	readCsv(pReq.body['fileLogins']['path']);
	pRes.send(200);
});

var readCsv = function(pUrl)
{
	fs.createReadStream(pUrl)
	  .pipe(csv())
	  .on('data', function(data) {
	  	registerLogin(data);
	  })
}


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
	var _org_id="";
	var _venue_id="";
	var _ap_id = "";

	M_Ap.findOne({ap_id:pJsonBody["ap_id"]}).exec(function(err, results) {
		if(err)
		{
			I_OnLiveLogger.SendMessage('Se genero un error DataBase: '+err, "warn");
		}
		else
		{
			var birthday;
			var gender;
			if(pJsonBody["user_birthday"] === '')
			{
				birthday = null;
			}
			else
			{
				birthday = moment.utc(pJsonBody["user_birthday"]); 
			}
			if(pJsonBody["user_gender"] === '')
			{
				gender = null;
			}
			else
			{
				var gender =pJsonBody["user_gender"]; 
				
			}
			if(results != null)
			{
	        	_org_id =results.org_id;
	        	_venue_id = results.venue_id;
	        	_ap_id = results._id;
	        }
	        else
	        {
	        	I_OnLiveLogger.SendMessage('Se reciben datos de un Ap no registrado: '+pJsonBody["ap_id"], "warn");
	        }	        
	        M_User.findOne({id:pJsonBody["user_id"]}).exec(function(err,results)
	        {
		        if(results == null)
		        {
					var _user = new M_User({
						id:pJsonBody["user_id"],
						email:pJsonBody["user_email"],
						first_name:pJsonBody["user_first_name"],
						last_name:pJsonBody["user_last_name"],
						location:pJsonBody["user_location"],
						location_latitude:pJsonBody["user_location_latitude"],
						location_longitude:pJsonBody["user_location_longitude"],
						gender:gender,
						city:pJsonBody["user_city"],
						country:pJsonBody["user_country"],
						country_code:pJsonBody["user_country_code"],
						picture:pJsonBody["user_picture"],
						birthday:birthday,
						phone:pJsonBody["user_phone"],
						org_id_OnLive:_org_id
					});
					_user.save(function(err) {
						if (err)
						{
							I_OnLiveLogger.SendMessage('User no fue salvado en la base de datos '+ _pJsonLogin["id"]+' '+ err, "warn");
						}
						else
						{
							I_OnLiveLogger.SendMessage('Create user '+pJsonBody["user_id"], 'info');
						}

					});
				}
				var _login = new M_Login({
				ap_id:pJsonBody["ap_id"],
				ip_address:pJsonBody["ip_address"],
				client_mac:pJsonBody["mac_address"],
				created_at:moment.utc(pJsonBody["when"]).subtract(6,"hours"),
				provider:getTanazaLoginProviderName(pJsonBody["provider"]),
				registration:pJsonBody["roaming"],
				splash_page_label:pJsonBody["SSID"],
				org_id_OnLive:_org_id,
				venue_id_OnLive:_venue_id,
				ap_id_OnLive:_ap_id,
				client:
					{
						id:pJsonBody["user_id"],
						email:pJsonBody["user_email"],
						first_name:pJsonBody["user_first_name"],
						last_name:pJsonBody["user_last_name"],
						location:pJsonBody["user_location"],
						location_latitude:pJsonBody["user_location_latitude"],
						location_longitude:pJsonBody["user_location_longitude"],
						gender:gender,
						city:pJsonBody["user_city"],
						country:pJsonBody["user_country"],
						country_code:pJsonBody["user_country_code"],
						picture:pJsonBody["user_picture"],
						birthday:birthday,
						phone:pJsonBody["user_phone"],
						org_id_OnLive:_org_id
					}
				});
				
				_login.save(function(err) {
					if (err)
					{
						I_OnLiveLogger.SendMessage('Login no registrado'+pJsonBody["user_id"], "warn");
					}
					else
					{
						I_OnLiveLogger.SendMessage('Create Login '+pJsonBody["user_id"], 'info');
					}
				 
				});
			});

		}
	});
	
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
