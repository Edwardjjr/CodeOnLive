/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/

var M_Ap = require('../../../model/ap');
var I_OnLiveLogger = require('../../../common/onLiveLogger/index.js');


module.exports = {
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: Es el identificador de una empresa registrada.
				pVenue_id: Es el identificador de un venue registrado.
				pMac: es la mac address con la que es identificado cada equipo
				pRres: el response.

	Decripcion:
	Se encarga de registrar el un nuevo ap, registarndolo dentro de la }
	compañia y venue espacificados en los parametros.
	-----------------------------------------------------------------------*/
	registerAp:function (pOrg_id,pVenue_id,pMac)
	{
		var _ap = new M_Ap({
			org_id: pOrg_id,
			venue_id:pVenue,
			ap_id:pMac,
			active:true
		});

		_ap.save(function(err) {
			  if (err)
			  {
			  	I_OnLiveLogger.SendMessage('Error al intentar salvar un Ap','warn')
			  }

			  	I_OnLiveLogger.SendMessage('Create Ap', 'info');
			});
	},
	/*----------------------------------------------------------------------
	Paramteros: pAp_id: El identificador de la Ap en la base de datos de la 
				empresa.
				pRres: el response.

	Decripcion:
	El metodo busuca un Ap especifico por si _id. Devuelve un Json con la 
	informacion.
	-----------------------------------------------------------------------*/
	apInfo:function(pAp_id,pRes)
	{
		M_Ap.findOne({_id:pAp_id}).exec(function(err,results){
			pRes.status(200).jsonp(results);
		});
	}
};