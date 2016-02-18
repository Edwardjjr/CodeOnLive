/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/
var E_Nconf = require ('nconf');
var E_Store = require('json-fs-store')('');
var M_Payload = require('../../model/payload');
var I_OnLiveLogger = require('../onLiveLogger/index.js');




module.exports = {
	/*----------------------------------------------------------------------
	Paramteros: pJsonBody: es en formato Json

	Decripcion:
	Registra un paquete de login en la cola de pendientes de procesar, es un
	registro a las base de datos, si el mismo llega a fallar se crea un 
	archivo donde se almacena el json completo. Se genera las alertas corres-
	pondentes.
	El id que identifica este paquete es el id del primer login del arreglo.
	-----------------------------------------------------------------------*/
	RegisterLogin: function(pJsonBody, registerLogin)
	{
		I_OnLiveLogger.SendMessage('recevid login: '+ pJsonBody[0]['id'], 'info');
		var payload = new M_Payload(
		{
			id_login:pJsonBody[0]['id'],
			body: JSON.stringify(pJsonBody),
			state: "pending"
		});
		payload.save(function(err) {
			if (err)
			{
				I_OnLiveLogger.SendMessage( 'No se proceso el paquete:' + pJsonBody[0]['id'], 'error');
				var login = {
				id : pJsonBody[0]['id'],
				client: pJsonBody
				}
				E_Store.add(login, function(err) {
				  if (err) 
				  {
				  	I_OnLiveLogger.SendMessage( 'Error al salver en archivo:' + pJsonBody[0]['id'], 'error');
				  }
				  else
				  {
				  	I_OnLiveLogger.SendMessage( 'Creo archivo:' + pJsonBody[0]['id'], 'info');
				  }
				});
			}
			else
			{
				console.log("llego");
				registerLogin(pJsonBody);
			}
		});
		
	},
	/*----------------------------------------------------------------------
	Paramteros: pId: Identificador del paquete.
				pState: Nuevo estado del paquete

	Decripcion:
	Se cambia el valor del los estados del un paquete recibido.
	-----------------------------------------------------------------------*/
	UpdateLogin: function(pId,pState)
	{
		M_Payload.update({"id_login":pId},{ $set: { state: pState }},{ multi: true },function  (err, numAffected) {
			I_OnLiveLogger.SendMessage( 'Proccess Login: ' + pId, 'info');
		});
	}
};