/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/
var I_TanazaConector = require('../tanaza-connector/v1_1/index.js');
var M_Payload = require('../model/payload');
I_OnLiveLogger = require('../common/onLiveLogger/index.js')


var processQueuePending = function()
{
	console.log("entro");

	M_Payload.find({state:"pending"}).exec(function (err,results){
			for(login in results)
			{

				try
				{
					var _jsonBody = JSON.parse(results[login].body);
					I_TanazaConector.registerLogin(_jsonBody);
					I_OnLiveLogger.SendMessage('Ejecuto Cron', "debug");
				
				}
				catch (err) {
				    I_OnLiveLogger.SendMessage('Fallo el cron: '+ err, "error");
				}	
			}	
			
		});
}

module.exports.processQueuePending = processQueuePending;