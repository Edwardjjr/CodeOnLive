/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/

var M_Venue = require('../../../model/venue');
var I_OnLiveLogger = require('../../../common/onLiveLogger/index.js');


module.exports = {


	/*----------------------------------------------------------------------
	Paramteros: pName: Nombre del venue.
	            pOrg_id: _id de la organizacion. 

	Decripcion:
	Se encarga de registrar un nuevo venue en la empresa correspondiente.
	-----------------------------------------------------------------------*/
	registerVenue:function (pName,pOrg_id)
	{
		var venue = new M_Venue({
			name: pName,
			org_id : pOrg_id,
			active: true
		});

		venue.save(function(err) {
			  if (err) 
			  {
			  	I_OnLiveLogger.SendMessage('Error al intentar agregar un nuevo venue','warn');
			  }
			  else
			  {
			  	I_OnLiveLogger.SendMessage('Venue saved successfully!','info');
			  }
			});
	},
	venueByOrg: function(pOrg_id,pVenue_id,pRes)
	{
		M_Venue.findOne({org_id:pOrg_id,_id:pVenue_id}).exec(function (err,results){	
			pRes.status(200).jsonp(results);
		});
	}
};

