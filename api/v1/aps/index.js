var M_Ap = require('../../../model/ap');


module.exports = {
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: Es el identificador de una empresa registrada.
				pVenue_id: Es el identificador de un venue registrado.
				pRres: el response.

	Decripcion:
	Se encarga de busacr cuales son los Ap que se encuentra registarados a 
	esta conmapañia y al venue especificados por parametro. Responde un json
	con la informacion.
	-----------------------------------------------------------------------*/

	ApsByVenue: function(pOrg_id,pVenue_id,pRes)
	{
		M_Ap.find({org_id:pOrg_id,venue_id:pVenue_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	},
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: Es el identificador de una empresa registrada.
				pRres: el response.

	Decripcion:
	Se encarga de busacr cuales son los Ap que se encuentra registarados a 
	esta conmapañia. Responde un json con la informacion.
	-----------------------------------------------------------------------*/
	ApsByOrg: function(pOrg_id,pRes)
	{
		M_Ap.find({org_id:pOrg_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	}
};