/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/
var E_Bcrypt = require('bcryptjs');
var M_Client = require('../../../model/client');
var I_OnLiveLogger = require('../../../common/onLiveLogger/index.js');


module.exports = {
	/*----------------------------------------------------------------------
	Paramteros: pOrg_id: _id de la empresa.
	            pName: Nombre del cliente.
	            pEmail: Email del cliente.
	            pPassword: contraseña del cliente.
	            pPermits: el id del campo de la tabla permisos.

	Decripcion:
	Se crear un usuario con los datos recibidos de parametro, donde se encripta
	el password.El campo de permits es utilizara a futuro con una referencia a 
	la coleccion de permisos para controlar el alcance de cada usuario.
	-----------------------------------------------------------------------*/
	registerClient:function (pOrg_id,pName,pEmail,pPassword,pPermits)
	{
		E_Bcrypt.genSalt(10, function(err, salt) {
		    E_Bcrypt.hash(pPassword, salt, function(err, hash) {
		        var client = new M_Client({
				name: pName,
				email: pEmail,
				password:hash,
				permits:pPermits,
				org_id: pOrg_id,
				active: true
				});

				client.save(function(err) {
					  if (err) 
					  {
					  	I_OnLiveLogger.SendMessage('No register Client', 'warn');
					  }
					  else
					  {
					  	I_OnLiveLogger.SendMessage('Client saved successfully!', 'info');
					  }
					});
			    });
		});


	},
	/*----------------------------------------------------------------------
	Paramteros: pEmail: Email del cliente.
	            pPassword: contraseña del cliente.
	            pCallbackÑ funcion de debe ser ejecutada al finalizar el proceso.

	Decripcion:
	Se veriffica las credenciales de un usario especificamente el email 
	corresponde con el password.
	-----------------------------------------------------------------------*/
	compareClient:function(pEmail,pPassword,pCallback)
	{

		M_Client.findOne({email:pEmail}).exec(function(err,result)
		{
			
			if (result != null)
			{	
				E_Bcrypt.compare(pPassword, result.password, function(err, res) {
					pCallback(res,result);
				});
			}
			else
			{
				pCallback(null,null);
			}
		});
		
	}
};