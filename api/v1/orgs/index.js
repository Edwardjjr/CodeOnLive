/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/
var E_Express = require('express');
var E_App = module.exports = E_Express();

var M_Organization = require('../../../model/organization');


/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de las organizaciones de la empresa.
-----------------------------------------------------------------------*/
E_App.get('/', function(pReq, pRes) {
	M_Organization.find({"active":true}).exec(function(err, results) {
        pRes.json(results);
	});
});