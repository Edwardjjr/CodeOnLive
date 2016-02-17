/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/

var M_Venue = require('../../../model/venue');


module.exports = {
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: Es el identificador de una empresa registrada.
				pRres: el response.

	Decripcion:
	Retorna un json con los venus pertenecientes a la organizacion.
	-----------------------------------------------------------------------*/
	venuesByOrg: function(pOrg_id,pRes)
	{
		M_Venue.find({org_id:pOrg_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	}
};