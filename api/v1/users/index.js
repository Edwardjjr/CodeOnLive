/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/
var M_User = require('../../../model/user');


module.exports = {
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: _id organizacion.
	            pRes: response. 

	Decripcion:
	Se retorna un Json de la informacion de los usarios de una organizacion.
	-----------------------------------------------------------------------*/
	usersByOrg: function(pOrg_id,pRes)
	{
		M_User.find({org_id:pOrg_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	},
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: _id organizacion.
				pVenue_id: _id venue.
	            pRes: response. 

	Decripcion:
	Se retorna un Json de la informacion de los usarios de un venue espacifico.
	-----------------------------------------------------------------------*/
	usersByVenue: function(pOrg_id,pVenue_id,pRes)
	{
		M_User.find({org_id:pOrg_id}&&{venue_id:pVenue_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	},
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: _id organizacion.
				pVenue_id: _id venue.
	            pRes: response. 

	Decripcion:
	Se retorna un Json de la informacion de los usarios de un Ap espacifico.
	-----------------------------------------------------------------------*/
	usersByAp: function(pOrg_id,pVenue_id,pAp_id,pRes)
	{
		M_User.find({org_id:pOrg_id}&&{venue_id:pVenue_id}&&{ap_id:pAp_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	}
};