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
var M_Login = require('../../../../model/loginV2')


var _filtersName;
var _NewClients;
var _KnowClients;
var _counter;
var _counterBulider;


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
	var _start = Date.parse(pReq.query['from']);
	var _end = Date.parse(pReq.query['end']);
	var _organization =  pReq.query['organization'];
	var _days = (_end-_start)/(24*3600*1000);
	_counter = _days;
	_counterBulider = 0;
	_filtersName=[];
	_NewClients=[];
	_KnownClients=[];
	_response = [["Fechas","Usuarios Nuevos","Usuarios conocidos"]];
	search(pRes,pReq,_end,_days,_organization);
});



/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pEnd: fecha donde finaliza la consulta.
            pDays: este dato toma la cantidad de dias solicitada por el 
            	   usuario. Funciona para poder filtrar los dias.
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta. 

Decripcion:
Se recibe la peticion de nuevos usuarios vrs usarios conocidos.
Las  variables se reinician con cada uno de las peticiones con el objetivo
de que no se almacanen valores inesperados.
-----------------------------------------------------------------------*/
var search = function(pRes,pReq,pEnd,pDays,pOrganization)
{
	if(_counter > 0)
	{
		var _date = new Date(pEnd - (_counter+1)*24*3600*1000);
		var _dateEnd = new Date(pEnd - _counter*24*3600*1000);
		searchNewUsers(search,pRes,pReq,pEnd,pDays,_date,_dateEnd,pOrganization);
		_counter--;
		var dateString = (_date.getDay()+1) +'-'+ (_date.getMonth()+1) +'-'+_date.getFullYear();
		_filtersName.push(dateString);

	}
	else
	{
		CreateTable(pReq,pRes);
	}
}



/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pEnd: fecha donde finaliza la consulta.
            pDays: este dato toma la cantidad de dias solicitada por el 
            	   usuario. Funciona para poder filtrar los dias.
            pDate:fecha de inicio de la consulta.
            pDateEnd: fecha de finalizacion de la consulta.
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta. 

Decripcion:
La funcion realiza una busqueda de los login registrados en un rengo de 
fechas especifica(para el fitro que se desea aplicar este sera por dia.)
devolviendo la cantidad de usuarios nuevos registrados.  
-----------------------------------------------------------------------*/

var searchNewUsers = function(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization)
{

	M_Login.distinct("client.id",{"org_id_OnLive":pOrganization,"client.logins_count":1,"created_at": 
		{"$gte":pDate.toISOString(),"$lte":pDateEnd.toISOString()}}).exec(function(err, c) {
		_NewClients.push(c.length);
		searchKnownUsers(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization);
	});
}

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            pEnd: fecha donde finaliza la consulta.
            pDays: este dato toma la cantidad de dias solicitada por el 
            	   usuario. Funciona para poder filtrar los dias.
            pDate:fecha de inicio de la consulta.
            pDateEnd: fecha de finalizacion de la consulta.
            pOrganization: el identificador la organizacion por la cual
            se realiza la consulta. 

Decripcion:
La funcion realiza una busqueda de los login registrados en un rengo de 
fechas especifica(para el fitro que se desea aplicar este sera por dia.)
devolviendo la cantidad de usuarios conocidos registrados.  
-----------------------------------------------------------------------*/
var searchKnownUsers = function(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization)
{
	M_Login.distinct("client.id",{"org_id_OnLive":pOrganization,"created_at": 
		{"$gte":pDate.toISOString(),"$lte":pDateEnd.toISOString()}}).exec(function(err, c) {
		_KnownClients.push(c.length);
		
		cb(pRes,pReq,pEnd,pDays,pOrganization);
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
var CreateTable = function(pReq,pRes){
	if(_counterBulider < _NewClients.length)
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
	var _row = [_filtersName[_counterBulider],_NewClients[_counterBulider],
				(_KnownClients[_counterBulider]-_NewClients[_counterBulider])];
	_response.push(_row);
	_counterBulider++;
	CreateTable(pReq,pRes);
}
