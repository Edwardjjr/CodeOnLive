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
var moment = require('moment');

var _filtersName;
var _filtersHeaders;
var _filtersDate;
var _counterWeek;
var _counterDay;
var _counterBuilder;
var _counterBuilderDate;
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
	_counterDay = 1;
	_filtersName=[];
	_filtersDate = [];
	_filtersHeaders = ["Dia","3 Semanas atras","2 Semanas atras","Semana Anterior","Semana Actual", "Promedio"];
	_arrayResult =[];
	_responseUser = [];
	search(pReq,pRes);
});

var search = function(pReq,pRes)
{

	_counterDay = 1;
	if(_counterWeek > 0)
	{

		searchDay(pReq,pRes,search)
	}
	else
	{
		_counterBuilder = 0;
		console.log(_filtersName);
		CreateTable(pReq,pRes);
	}
}

var searchDay = function(pReq,pRes,cb)
{
	if(_counterDay < 8)
	{
		var _dateStart = moment(pReq.query['from']);
		
		var _dateEnd = moment(pReq.query['from']);
		_dateStart =_dateStart.add(_counterDay,'day');
		_dateStart =_dateStart.subtract(_counterWeek,'week');
		_dateEnd =_dateEnd.add(_counterDay+1,'day');
		_dateEnd =_dateEnd.subtract(_counterWeek,'week');
		var _organization =  pReq.query['organization'];
		searchCounterUser(pReq,pRes,_dateStart,_dateEnd,_organization,searchDay,cb);
		_filtersName.push(getDayName(_dateStart.isoWeekday()));
		if(_counterDay==1)
		{
			console.log(getDayName(_dateStart.isoWeekday()));
			console.log(_dateStart.toString());
			var day = _dateStart.date()+"/"+(_dateStart.month()+1);
			_filtersDate.push(day);
		}
		if(_counterDay==7)
		{
			console.log(_dateStart.toString());
			var day = _dateStart.date()+"/"+(_dateStart.month()+1);
			_filtersDate.push(day);
		}
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
		{"$gte":pDateStart,"$lte":pDateEnd}}).exec(function(err, c) {
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
	if(_counterBuilder < 7)
	{
		
		Insetar(pReq,pRes,CreateTable);
	}
	else
	{
		_counterBuilder = 1;
		_counterBuilderDate = 0;
		CreateHeaders(pReq,pRes);
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
	var _average = 0;
	while(_counter <= 4)
	{

		if(_counter == 4)
		{
			_row.push((_average/4));
			_responseUser.push(_row);
			_counterBuilder++;
			cb(pReq,pRes);
			break;
		}
		else
		{
			_average = _average + _arrayResult[(7*_counter)+_counterBuilder];
			_row.push(_arrayResult[(7*_counter)+_counterBuilder]);
			_counter++;
		}
	}
}

/*----------------------------------------------------------------------
Paramteros: pDay: Nu numero del dia de la semana.

Decripcion:
Se encarga de retornar el nombre del dia de  la semana segun corresponda.
-----------------------------------------------------------------------*/

var getDayName = function (pProviderId) {
	switch(pProviderId)
	{
		case 1:
			return "Lunes";
		case 2:
			return "Martes";
		case 3:
			return "Miercoles";
		case 4:
			return "Jueves";
		case 5:
			return "Viernes";
		case 6:
			return "Sabado";
		case 7:
			return "Domingo";
		default:
			return "unknown";
	}
}

var CreateHeaders = function (pReq,pRes)
{
	if(_counterBuilder < (_filtersHeaders.length-1))
	{
		InsetarDate(pReq,pRes,CreateHeaders);
		
	}
	else
	{
		_responseUser.unshift(_filtersHeaders);
		pRes.send(_responseUser);
	}
}

var InsetarDate = function(pReq,pRes,cb)
{
	var date = new String(_filtersHeaders[_counterBuilder] +" Del:"+_filtersDate[_counterBuilderDate]+" Al:"+_filtersDate[_counterBuilderDate+1]);
	_filtersHeaders[_counterBuilder] = date;
	_counterBuilder++;
	_counterBuilderDate = _counterBuilderDate + 2;
	cb(pReq,pRes);
}