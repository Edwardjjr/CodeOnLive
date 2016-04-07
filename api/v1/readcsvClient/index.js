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
var M_Login = require('../../../model/login');
var M_User = require('../../../model/user');
var M_Ap = require('../../../model/ap');
var I_OnLiveLogger = require('../../../common/onLiveLogger/index.js');
var I_LogDataBase = require('../../../common/logDataBase/index.js');
var csv = require('csv-parser');
var fs=require("fs");
var moment = require('moment');
moment().format();

/*----------------------------------------------------------------------
Paramteros: pReq: el request enviado.
			pRres: el response.

Decripcion:
Este metodo se encarag de enviar un mensaje de OK al servicio que busca 
consumirlo..
-----------------------------------------------------------------------*/

E_App.post('/', function(pReq, pRes) {
	readCsv(pReq.body['fileClients']['path']);
	pRes.send(200);
});



var readCsv = function(pUrl)
{
	fs.createReadStream(pUrl)
	  .pipe(csv())
	  .on('data', function(data) {
	  	registerUser(data);
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

var registerUser = function(pJsonBody)
{
	var _org_id="";
	var birthday;
	

	M_Ap.findOne({ap_id:pJsonBody["ap_id"]}).exec(function(err, results) {
		if(err)
		{
			I_OnLiveLogger.SendMessage('Se genero un error DataBase: '+err, "warn");
		}
		else
		{
			var birthday;
			var gender;
			if(pJsonBody["birthday"] === '')
			{
				birthday = null;
			}
			else
			{
				birthday = moment(pJsonBody["birthday"]); 
			}
			if(pJsonBody["gender"] === '')
			{
				gender = null;
			}
			else
			{
				var gender =pJsonBody["gender"]; 
				
			}
			if(results != null)
			{
	        	_org_id =results.org_id;
	        }
	        else
	        {
	        	I_OnLiveLogger.SendMessage('Se reciben datos de un Ap no registrado: '+pJsonBody["ap_id"], "warn");
	        }
		    M_User.findOne({id:parseInt(pJsonBody["id"])}).exec(function(err,results)
		    {
		    

		        if(results == null)
		        {
					var _user = new M_User({
						id:pJsonBody["id"],
						email:pJsonBody["email"],
						first_name:pJsonBody["first name"],
						last_name:pJsonBody["last name"],
						location:pJsonBody["location"],
						location_latitude:pJsonBody["location_latitude"],
						location_longitude:pJsonBody["location_longitude"],
						created_at:new Date(pJsonBody["registered_at"]),
						gender:gender,
						city:pJsonBody["city"],
						country:pJsonBody["country"],
						country_code:pJsonBody["country_code"],
						picture:pJsonBody["picture"],
						logins_count:pJsonBody["connections_count"],
						provider:getTanazaLoginProviderName(parseInt(pJsonBody["provider"])),
						birthday:birthday,
						phone:pJsonBody["phone"],
						client_mac:pJsonBody["client_mac"],
						last_time_seen:new Date(pJsonBody["last_login"]),
						org_id_OnLive:_org_id
					});
					_user.save(function(err) {
						if (err)
						{
							I_OnLiveLogger.SendMessage('User no fue salvado en la base de datos '+ _pJsonLogin["id"]+' '+ err, "warn");
						}
						else
						{
							I_OnLiveLogger.SendMessage('Create user '+pJsonBody["id"], 'info');
						}

					});
				}
				else
				{
					UpdateUser(pJsonBody,results,_org_id)
				}

			});
		}
	});
		

}

/*----------------------------------------------------------------------
Paramteros: pUser: El usuario reportado en el login.
			pUserDataBase: el usuario registrado en la base de datos.
Decripcion:
Actualiza los datos de usuario registrado en la base de datos he informa
de los cambios.
-----------------------------------------------------------------------*/

var UpdateUser = function(pUser, pUserDataBase,pOrg_id)
{	
	var _counterField=0;
	var _fields=["email","first_name","last_name","picture","location","location_latitude",
	"location_longitude","created_at","gender","city","country","country_code","picture",
	"logins_count","provider","birthday","phone","client_mac","last_time_seen"];
	var _fieldsCsv=["email","first name","last name","picture","location","location_latitude",
	"location_longitude","registered_at","gender","city","country","country_code","picture",
	"connections_count","provider","birthday","phone","client_mac","last_login"];
	while(_counterField < _fields.length)
	{
		var _field =  _fields[_counterField];
		var _fieldCsv = _fieldsCsv[_counterField];
		if(_field == "provider")
		{
			if((getTanazaLoginProviderName(parseInt(pUser[_fieldCsv]))!= pUserDataBase[_field])&&(pUser[_fieldCsv]!= null))
			{
				I_OnLiveLogger.SendMessage('Se actualizo el usuario '+pUser["id"] + ' el campo '+ _field+ 
				': Anterior: '+ pUserDataBase[_field] + ' Actual: ' + getTanazaLoginProviderName(pUser[_fieldCsv]) , "info");		
			}
		}
		else
		{
			if((pUser[_fieldCsv]!= pUserDataBase[_field])&&(pUser[_fieldCsv]!= null))
			{
				I_OnLiveLogger.SendMessage('Se actualizo el usuario '+pUser["id"] + ' el campo '+ _field+ 
				': Anterior: '+ pUserDataBase[_field] + ' Actual: ' + pUser[_fieldCsv] , "info");		
			}
			if(_counterField == (_fields.length-1))
			{
				pUserDataBase.UpdateUserCsv(pUser,pOrg_id);
			}
		}
		_counterField++;
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

module.exports.registerUser = registerUser