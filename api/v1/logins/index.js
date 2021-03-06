/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/

var M_Login = require('../../../model/login');
var M_User = require('../../../model/user');

module.exports = {
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: _id de la empresa.
	            pRes: response. 

	Decripcion:
	Se busca los login de una empresa espacifica recibida por parametro. La
	respuesta es un json de los logins.
	-----------------------------------------------------------------------*/
	findLoginsByOrg: function(pOrg_id,pRes)
	{
		M_Login.find({org_id_OnLive:pOrg_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	},
	/*----------------------------------------------------------------------
	Paramteros: pVenue_id: _id de la Venue.
	            pRes: response. 

	Decripcion:
	Se busca los login de un venue espacifico recibida por parametro. La
	respuesta es un json de los logins.
	-----------------------------------------------------------------------*/

	findLoginsByVenue: function(pVenue_id,pRes)
	{
		M_Login.find({venue_id_OnLive:pVenue_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	},
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: _id de la empresa.
				pVenue_id: _id de la Venue.
	            pRes: response. 

	Decripcion:
	Se busca los login de una emporesa y venue espacificos recibida por parametro. La
	respuesta es un json de los logins.
	-----------------------------------------------------------------------*/
	findLoginsByAp: function(pOrg_id,pVenue_id,Ap_id,pRes)
	{
		M_Login.find({org_id_OnLive:pOrg_id,venue_id_OnLive:pVenue_id,ap_id_OnLive:Ap_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	},

	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: _id de la empresa. 

	Decripcion:
	Se busca los login de una emporesa y venue espacificos recibida por parametro. La
	respuesta es un json de los logins.
	-----------------------------------------------------------------------*/
	findLoginsDateByOrg: function(pOrg_id,pRes)
	{
		M_Login.find({org_id_OnLive:pOrg_id}).sort({"created_at":1}).exec(function (err,results){
			var date = new Date(results[0]["created_at"]);
			date = date.getFullYear()+'-'+ ("0" + (date.getMonth() + 1)).slice(-2) +'-'+("0" + date.getDate()).slice(-2);
			pRes.status(200).jsonp(date);
		});
	},  
	UpdateVisit:function(pOrg_id,pRes)
	{
		console.log("llego 2")
		M_Login.find({org_id_OnLive:pOrg_id}).exec(function (err,results){	
			for(login in results)
			{
				console.log(results.length);
				M_User.findOne({id:results[login]["client"]["id"]}).exec(function(err,user)
				{
					user.UpdateUser(results[login]["client"],results[login]["venue_id_OnLive"]);
				});
			}
			pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
			pRes.end();
		});
	}
};