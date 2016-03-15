/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/
var E_Express = require('express');

var E_Express = require('express');
var E_App = module.exports = E_Express();
var M_Login = require('../../../../model/login')


var _filtersName;
var _counterWeek;
var _counterDay;
var _counterBuilder;
var _arrayResult;


/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se recibe la peticion de nuevos usuarios vrs usarios conocidos.
Las  variables se reinician con cada uno de las peticiones con el objetivo
de que no se almacanen valores inesperados. Para la peticion se debe enviar
en los parametros la fecha de inicio y la fecha final y el _id de la
organizacion de interes.
-----------------------------------------------------------------------*/

E_App.get('/', function(pReq, pRes) {
	_counterWeek = 4;
	_counterBuilder = 0;
	_counterDay = 0;
	_filtersName=[];
	_arrayResult =[];
	_filtersName= ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];
	_responseUser = [["Dia","Primera Semana","Segunda Semana","Tercera Semana","Cuarta Semana"]];
	search(pReq,pRes);
});

var search = function(pReq,pRes)
{

	_counterDay = 0;
	if(_counterWeek > 0)
	{
		searchDay(pReq,pRes,search)
	}
	else
	{
		CreateTable(pReq,pRes);
	}
}

var searchDay = function(pReq,pRes,cb)
{
	if(_counterDay < 7)
	{
		var _dateStart = new Date (Date.parse(pReq.query['from']) - ((7*_counterWeek)-_counterDay)*24*3600*1000);
		var _dateEnd = new Date (Date.parse(pReq.query['from']) - ((7*_counterWeek)-(_counterDay+1))*24*3600*1000);
		var _organization =  pReq.query['organization'];
		searchCounterUser(pReq,pRes,_dateStart,_dateEnd,_organization,searchDay,cb);
		
	}
	else
	{
		_counterWeek--;
		search(pReq,pRes);
	}
}

var searchCounterUser = function(pReq,pRes,pDateStart,pDateEnd,pOrganization,cb,cbSearch)
{
	M_Login.distinct("client.id",{"org_id_OnLive":pOrganization,"created_at": 
		{"$gte":pDateStart.toISOString(),"$lte":pDateEnd.toISOString()}}).exec(function(err, c) {
		_arrayResult.push(c.length);
		_counterDay++;
		cb(pReq,pRes,cbSearch);
	});
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
	if(_counterBuilder < _filtersName.length)
	{
		
		Insetar(pReq,pRes,CreateTable);
	}
	else
	{
		pRes.send(_responseUser);
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
	var _row = [_filtersName[_counterBuilder]]
	var _counter = 0;
	while(_counter <= 4)
	{

		if(_counter == 4)
		{
			_responseUser.push(_row);
			_counterBuilder++;
			cb(pReq,pRes);
			break;
		}
		else
		{
			_row.push(_arrayResult[(7*_counter)+_counterBuilder]);
			_counter++;
		}
	}
}