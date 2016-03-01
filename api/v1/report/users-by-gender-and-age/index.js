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
var M_User = require('../../../../model/userV2')

var _ages = [0,17,29,39,49,59,150];
var _males= [];
var _females= [];
var _others = [0];
var _counter = 0;
var _response = [["Range","Hombres","Mujeres", "Género ND"]];
var _filtersName =["ND","17-","18-29","30-39","40-49","50-59","60+"]
var _counterBulider = 0;
var date = new Date();
var _endBirthday = null;
_fromBirthday = null;
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de las organizaciones de la empresa.
-----------------------------------------------------------------------*/
E_App.get('/', function(pReq, pRes) {
	searchdate(pReq,pRes);
	console.log("llego llego");	
});

var searchdate = function(pReq,pRes)
{
	var _start = new Date(pReq.query['from']);
	var _end = new Date(pReq.query['end']);
	var _organization =  pReq.query['organization'];

	if(_counter < (_ages.length - 1))
	{
		_endBirthday = new Date(date - _ages[_counter] * 24 * 3600 * 1000*365);
		_fromBirthday = new Date(date - _ages[_counter +1] * 24 * 3600 * 1000*365);
		searchMale(searchdate,_start,_end,_organization,pReq,pRes);
		_counter++;
	}
	else
	{
		searchNoAgeMale(CreateTable,_start,_end,_organization,pReq,pRes);
	}
}

var searchMale = function(cb,pStart,pEnd,pOrganization,pReq,pRes)
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
};

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
var searchOthers = function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pReq.query['organization'], 
		gender: null,
		"created_at": {"$gte":new Date(pReq.query['from']), "$lt":new Date(pReq.query['end'])},
		"birthday": {"$gte":_fromBirthday, "$lt":_endBirthday}}
		).exec(function(err, c) {
   			_others.push(c);
   			cb(pReq,pRes);
		}
	);
};
var searchNoAgeMale= function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pReq.query['organization'], 
		gender: "male",
		birthday:null,
		"created_at": {"$gte":new Date(pReq.query['from']), "$lt":new Date(pReq.query['end'])}}
		).exec(function(err, c) {
   			_males.unshift(c);
   			searchNoAgeFemale(cb,pStart,pEnd,pOrganization,pReq,pRes);
		}
	);
}
var searchNoAgeFemale= function(cb,pStart,pEnd,pOrganization,pReq,pRes)
{
	M_User.count({org_id_OnLive: pReq.query['organization'], 
		gender: "female",
		birthday:null,
		"created_at": {"$gte":new Date(pReq.query['from']), "$lt":new Date(pReq.query['end'])}}
		).exec(function(err, c) {
   			_females.unshift(c);
   			cb(pReq,pRes);
		}
	);
}

var CreateTable = function(pReq,pRes)
{
	if(_counterBulider < _males.length)
	{
		Insetar(pReq,pRes,CreateTable);
	}
	else
	{
		console.log(_response);
		pRes.send(_response);
	}
	
	
}

var Insetar= function(pReq,pRes,cb)
{
	var _row = [_filtersName[_counterBulider],_males[_counterBulider],
				_females[_counterBulider],_others[_counterBulider]];
	_response.push(_row);
	_counterBulider++;
	CreateTable(pReq,pRes);
}