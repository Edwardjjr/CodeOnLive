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
				pUser_id: _id Usario.
	            pRes: response. 

	Decripcion:
	Se retorna un Json de la informacion de los uusarios de una organizacion.
	-----------------------------------------------------------------------*/
	userByOrg: function(pOrg_id,pUser_id,pRes)
	{
		M_User.findOne({org_id:pOrg_id}&&{_id:pUser_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	}
};

