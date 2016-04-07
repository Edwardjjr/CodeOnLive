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
var I_Venue = require('../venue/index.js');
var I_Venues = require('../venues/index.js');
var I_Logins = require('../logins/index.js');
var I_Ap = require('../ap/index.js');
var I_Aps = require('../aps/index.js');
var I_Users = require('../users/index.js');
var I_User = require('../user/index.js');
var I_Client = require('../client/index.js');
var I_OnLiveLogger = require('../../../common/onLiveLogger/index.js');



/*-----------------------------------------------------------
-                                                          	-
-                   Metodos post                            -
-                                                           -
-------------------------------------------------------------*/

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se registra una nueva organizacion, en el body del request, se proposiona
un json con la informacion necesaria para registrar una empresa.
-----------------------------------------------------------------------*/
E_App.post('/', function(pReq, pRes) {
	pReq.on('data', function (chunk) {
		var jsonbody = JSON.parse(chunk);
		registerOrganization(jsonbody["NameOrganization"],jsonbody["rangeAge"]);
	});
	pReq.on('end', function () {
		pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		pRes.end();
	});
});

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se registra una nueva organizacion, en el body del request, se proposiona
un json con la informacion necesaria para registrar un venue.
-----------------------------------------------------------------------*/
E_App.post('/:org_id/venue', function(pReq, pRes) {
	pReq.on('data', function (chunk) {
		var jsonbody = JSON.parse(chunk);
		I_Venue.registerVenue(jsonbody["NameVenue"],pReq.params.org_id);
	});
	pReq.on('end', function () {
		pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		pRes.end();
	});
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se registra una nueva organizacion, en el body del request, se proposiona
un json con la informacion necesaria para registrar un Ap.
-----------------------------------------------------------------------*/
E_App.post('/:org_id/venue/:venue_id/ap', function(pReq, pRes) {
	
	pReq.on('data', function (chunk) {
		var jsonbody = JSON.parse(chunk);
		I_Ap.registerAp(pReq.params.org_id,pReq.params.venue_id,jsonbody["Mac"]);
	});
	pReq.on('end', function () {
		pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		pRes.end();
	});
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se registra una nueva organizacion, en el body del request, se proposiona
un json con la informacion necesaria para registrar un cliente que para 
la empresa son usuarios de las empresas.
-----------------------------------------------------------------------*/
E_App.post('/:org_id/client', function(pReq, pRes) {
	
	pReq.on('data', function (chunk) {
		var jsonbody = JSON.parse(chunk);
		try
		{
			I_Client.registerClient(pReq.params.org_id,jsonbody["Name"],jsonbody["Email"],jsonbody["Password"],jsonbody["Permits"]);
		}
		catch (err)
		{
			I_OnLiveLogger('Error user register: '+ err, 'warn');
		}
	});
	pReq.on('end', function () {
		pRes.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		pRes.end();
	});
});


/*-----------------------------------------------------------
-                                                          	-
-                   Metodos get                            -
-                                                           -
-------------------------------------------------------------*/
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de la organizacion, el identificador es 
enviado en los params del request.
-----------------------------------------------------------------------*/
E_App.get('/:org_id', function(pReq, pRes) {
	M_Organization.findOne({_id:pReq.params.org_id}).exec(function(err, results) {
        pRes.status(200).jsonp(results);
	});
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de los logins registrados para la 
organizacion, el identificador es enviado en los params del request.
-----------------------------------------------------------------------*/

E_App.get('/:org_id/logins', function(pReq, pRes) {
	I_Logins.findLoginsByOrg(pReq.params.org_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de los logins de un venue especifico 
de un organizacion. En el paramas de request se envia el _id de la 
organizacion y el _id del venue.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/venue/:venue_id/logins', function(pReq, pRes) {
	I_Logins.findLoginsByVenue(pReq.params.venue_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de los logins de un Ap especifico 
de un organizacion. En el paramas de request se envia el _id de la organizacion, 
el _id del venue y el _id del Ap.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/venue/:venue_id/ap/:ap_id/logins', function(pReq, pRes) {
	I_Logins.findLoginsByAp(pReq.params.org_id, pReq.params.venue_id,pReq.params.ap_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de los Usuarios de la un organizacion. 
En el paramas de request se envia el _id de la organizacion.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/users', function(pReq, pRes) {
	I_Users.usersByOrg(pReq.params.org_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de un usuario espacifico  de un 
organizacion. En el paramas de request se envia el _id de la organizacion 
y el _id del usuario.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/user/:user_id', function(pReq, pRes) {
	I_User.userByOrg(pReq.params.org_id,pReq.params.user_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de los venues de un organizacion. 
En el paramas de request se envia el _id de la organizacion.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/venues', function(pReq, pRes) {
	I_Venues.venuesByOrg(pReq.params.org_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de un venue espacifico  de un 
organizacion. En el paramas de request se envia el _id de la organizacion.
-----------------------------------------------------------------------*/

E_App.get('/:org_id/venue/:venue_id', function(pReq, pRes) {
	I_Venue.venueByOrg(pReq.params.org_id,pReq.params.venue_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de los aps de un venue espacifico de
una organizacion. En el paramas de request se envia el _id de la 
organizacion.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/venue/:venue_id/aps', function(pReq, pRes) {
	I_Aps.ApsByVenue(pReq.params.org_id,pReq.params.venue_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de un ap de un venue espacifico de
una organizacion. En el paramas de request se envia el _id de la 
organizacion.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/venue/:venue_id/ap', function(pReq, pRes) {
	I_Ap.apInfo(pReq.query.ap_id,pRes);
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de los aps de una organizacion. 
En el paramas de request se envia el _id de la organizacion.
-----------------------------------------------------------------------*/
E_App.get('/:org_id/aps', function(pReq, pRes) {
	I_Aps.ApsByOrg(pReq.params.org_id,pRes);
});



/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Elimina una Organizacion espacifica. En los params del request viene el 
_id de la empresa que se desea eliminar.
-----------------------------------------------------------------------*/
E_App.delete('/:org_id', function(pReq, res) {
	M_Organization.update({"_id":pReq.params.org_id},{ $set: { active: false }},{ multi: true },function  (err, numAffected) {
	 	pReq.on('data', function (chunk) {
			});
			pReq.on('end', function () {
				res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
				res.end();
			});
	});
});

/*----------------------------------------------------------------------
Paramteros: pName: Nombre de la organizacion.

Decripcion:
Se agrega una nueva organizacion.
-----------------------------------------------------------------------*/
function registerOrganization(pName,pRangeAge)
{
	var organization = new M_Organization({
		name: pName,
		rangeAge:pRangeAge,
		active: true
	});

	organization.save(function(err) {
		  if (err) throw err;

		  console.log('organization saved successfully!');
		});
}