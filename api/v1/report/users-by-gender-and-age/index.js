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
var M_User = require('../../../../model/user');
var M_Organization = require('../../../../model/organization');
var E_Moment = require('moment');

var _ages;
var _males;
var _females;
var _others;
var _counter;
var _response;
var _filtersName; 
var _counterBulider;
var date;
var _endBirthday;
var _fromBirthday;
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Es una consulta que devuleve la cantidad y de hombres por un rango de edad.
Se este desea cambiar el rango de las edades se debe cambiar el arreglo
_array. el _filtersName establece los nombres de cada una de las colunmas
en el grafico. _response es la arreglo que va ser enviado como respuesta
este es inicializado con la estructura, luego se agregara las filas 
correspondientes.
-----------------------------------------------------------------------*/
E_App.get('/', function(pReq, pRes) {
	//_ages = [0,18,24,34,45,54,150];
	initVariable(pReq,pRes);
});

var initVariable = function(pReq,pRes)
{
	_males= [];
	_females= [];
	_others = [];
	_counter = 0;
	_filtersName =["0-18","19-29","30-39","40-49","50-59","60+","ND"];
	_response = [["Por edad","Hombres","Mujeres", "Género ND"]];
	_counterBulider = 0;
	_endBirthday = null;
	_fromBirthday = null;
	var _organization =  pReq.query['organization'];
	M_Organization.findOne({"_id":_organization}).exec(function(err, result) {
		_ages = result["rangeAge"];
		searchdate(pReq,pRes);
	});	
}


/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.


Decripcion:
realiza la busqueda general y luego llama la metodo que se encarag de 
formar la table para los ggrafcos de google charts.
-----------------------------------------------------------------------*/
var searchdate = function(pReq,pRes)
{
	var _start = E_Moment(pReq.query['from']);
	var _end = E_Moment(pReq.query['end']);
	var _organization =  pReq.query['organization'];
	var _venue = pReq.query['venue'];

	if(_counter < (_ages.length - 1))
	{
		_endBirthday = E_Moment().subtract(_ages[_counter],'year');
		_fromBirthday = E_Moment().subtract(_ages[_counter +1],'year');
		searchMale(searchdate,_start,_end,_organization,_venue,pReq,pRes);
		_counter++;
	}
	else
	{
		searchNoAgeMale(CreateTable,_start,_end,_organization,pReq,pRes);
	}
}
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pStart: fecha de inicio de la consulta.
            pEnd: fecha de la finalizacion de la consulta
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta.
            cb: searchdate (callback)

Decripcion:
Realiza la busqueda de usuarios por un rengo de fecha(por dia) y su genero 
sea hombres y los calsifica por un rango de edad.
-----------------------------------------------------------------------*/
var searchMale = function(cb,pStart,pEnd,pOrganization,pVenue,pReq,pRes)
{
	if(pVenue == null)
	{
		M_User.count({org_id_OnLive: pOrganization, 
			gender:"male",
			"created_at": {"$gte":pStart, "$lt":pEnd},
			"birthday": {"$gte":_fromBirthday, "$lt":_endBirthday}}
			).exec(function(err, c) {
	   			_males.push(c);
	   			searchFemale(cb,pStart,pEnd,pOrganization,pReq,pRes);
			}
		);
	}
	else
	{
	}
};

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pStart: fecha de inicio de la consulta.
            pEnd: fecha de la finalizacion de la consulta
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta.
            cb: searchdate (callback)

Decripcion:
Realiza la busqueda de usuarios por un rengo de fecha(por dia) y su genero 
sea mujeres y los calsifica por un rango de edad.
-----------------------------------------------------------------------*/
var searchFemale = function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pOrganization, 
		gender:"female",
		"created_at": {"$gte":pStart, "$lt":pEnd},
		"birthday": {"$gte":_fromBirthday, "$lt":_endBirthday}}
		).exec(function(err, c) {
   			_females.push(c);
   			searchOthers(cb,pStart,pEnd,pOrganization,pReq,pRes);
		}
	);
			
};
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pStart: fecha de inicio de la consulta.
            pEnd: fecha de la finalizacion de la consulta
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta.
            cb: searchdate (callback)

Decripcion:
Realiza la busqueda de usuarios por un rengo de fecha(por dia) que no 
se puede determinar si son hombres o mujeres pero si la edad.
-----------------------------------------------------------------------*/
var searchOthers = function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pReq.query['organization'], 
		gender: null,
		"created_at": {"$gte":E_Moment(pReq.query['from']), "$lt":E_Moment(pReq.query['end'])},
		"birthday": {"$gte":_fromBirthday, "$lt":_endBirthday}}
		).exec(function(err, c) {
   			_others.push(c);
   			cb(pReq,pRes);
		}
	);
};

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pStart: fecha de inicio de la consulta.
            pEnd: fecha de la finalizacion de la consulta
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta.
            cb: searchdate (callback)

Decripcion:
Realiza la busqueda de usuarios por un rango de fecha(por dia) por genero
en este caso hombres pero no se puede determinar su edad.
-----------------------------------------------------------------------*/
var searchNoAgeMale= function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pReq.query['organization'], 
		gender: "male",
		birthday:null,
		"created_at": {"$gte":E_Moment(pReq.query['from']), "$lt":E_Moment(pReq.query['end'])}}
		).exec(function(err, c) {
   			_males.push(c);
   			searchNoAgeFemale(cb,pStart,pEnd,pOrganization,pReq,pRes);
		}
	);
}
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pStart: fecha de inicio de la consulta.
            pEnd: fecha de la finalizacion de la consulta
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta.
            cb: searchdate (callback)

Decripcion:
Realiza la busqueda de usuarios por un rango de fecha(por dia) por genero
en este caso mujeres pero no se puede determinar su edad.
-----------------------------------------------------------------------*/
var searchNoAgeFemale= function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pReq.query['organization'], 
		gender: "female",
		birthday:null,
		"created_at": {"$gte":E_Moment(pReq.query['from']), "$lt":E_Moment(pReq.query['end'])}}
		).exec(function(err, c) {
   			_females.push(c);
   			searchNoAgeNoGender(cb,pStart,pEnd,pOrganization,pReq,pRes);
		}
	);
}


var searchNoAgeNoGender= function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pReq.query['organization'], 
		gender: null,
		birthday:null,
		"created_at": {"$gte":E_Moment(pReq.query['from']), "$lt":E_Moment(pReq.query['end'])}}
		).exec(function(err, c) {
   			_others.push(c);
   			cb(pReq,pRes);
		}
	);
}
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.

Decripcion:
Esta funcion crea encarga de recorrer los datos de la consulat de usuarios 
nuevos y usuarios conocidos, para enviar la estructura de tabla esperada 
por google chart para generar un grafico.  
-----------------------------------------------------------------------*/
var CreateTable = function(pReq,pRes)
{
	if(_counterBulider < _males.length)
	{
		Insetar(pReq,pRes,CreateTable);
	}
	else
	{
		pRes.send(_response);
	}
	
	
}
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            cb:CreateTable.

Decripcion:
Esta funcion crea cada una de las filas de la tabla por enviar como 
respuesta.
-----------------------------------------------------------------------*/
var Insetar= function(pReq,pRes,cb)
{
	var _row = [_filtersName[_counterBulider],_males[_counterBulider],
				_females[_counterBulider],_others[_counterBulider]];
	_response.push(_row);
	_counterBulider++;
	CreateTable(pReq,pRes);
}