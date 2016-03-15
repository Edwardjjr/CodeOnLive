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

var NUMBER_OF_WEEK = 4;
var PAST_WEEK= 2;
var ACTIVE = 1;
var NUMBER_OF_HOURS = 24;
var NUMBER_OF_MILISEGUNDOS_BY_HOURS = 3600000;
var NUMBER_OF_MILISEGUNDOS_BY_DAY = 86400000;
var _counterHours;
var _filtersName = ['12 AM','1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','7 AM','8 AM','9 AM','10 AM','11 AM',
					'12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM','11 PM',];
var _tittle=["Dia","Semana Actual","Semana Anterior","Promedio 4 Semanas"];
var _counterWeek;
var _counterBuilder;
var _response;
var _arrayResult;

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se reciben peticon para evr los usuarios por hora en un dia espacifico de 
la semana.
-----------------------------------------------------------------------*/

E_App.get('/', function(pReq, pRes) {
	_counterHours = 0;
	_counterWeek = 0;
	_counterBuilder = 0;
	_response = [];
	_arrayResult= [];
	search(pReq,pRes);
	
});

var searchWeek = function(pReq,pRes)
{
	if(pReq.query['pastFourWeek']==ACTIVE)
	{
		if(_counterWeek < NUMBER_OF_WEEK)
		{
			_counterHours = 0;
			search(pReq,pRes);
		}
		else
		{
			CreateTable(pReq,pRes);
		}
	}
	else
	{
		if(pReq.query['pastWeek']==ACTIVE)
		{
			if(_counterWeek < PAST_WEEK)
			{
				_counterHours = 0;
				search(pReq,pRes);
			}
			else
			{
				CreateTable(pReq,pRes);
			}
		}
		else
		{
			CreateTable(pReq,pRes);
		}
	}
}

var search = function(pReq,pRes)
{
	var _organization =  pReq.query['organization'];
	var _dateStart =  new Date (Date.parse(pReq.query['from']) - (24-_counterHours)*NUMBER_OF_MILISEGUNDOS_BY_HOURS 
															 -7*_counterWeek*NUMBER_OF_MILISEGUNDOS_BY_DAY);
	var _dateEnd = new Date (Date.parse(pReq.query['from']) - (23-_counterHours)*NUMBER_OF_MILISEGUNDOS_BY_HOURS
														  -7*_counterWeek*NUMBER_OF_MILISEGUNDOS_BY_DAY);
	if(_counterHours < NUMBER_OF_HOURS)
	{
		if(pReq.query['idVenue'] != null)
		{
			searchUserHoursVenue(pReq,pRes,_counterHours,_organization,_dateStart,_dateEnd,search);
		}
		else
		{
			searchUserHoursOrganizacion(pReq,pRes,_organization,_dateStart,_dateEnd,search);
		}
		
	}
	else
	{
		_counterWeek++;
		searchWeek(pReq,pRes);

	}
}

var searchUserHoursOrganizacion = function(pReq,pRes,pOrganization,pDateStart,pDateEnd,cb)
{
	M_Login.aggregate([
		{
			$project:{
				_id:1,
				idClient:'$client.id',
				org_id_OnLive:1,
				created_at:1,
				hourStart: { $gt: [ "$created_at", pDateStart.toISOString() ] },
				hourEnd: { $lt: [ "$created_at", pDateEnd.toISOString() ] }
		}},

		{$match: {'org_id_OnLive' : pOrganization, 'hourStart':true,'hourEnd':true}},
		{$group:{_id: "$idClient",firstSalesDate: { $first: "$idClient" }}}
		],function (err, result) {
        if (err) {
            console.log(err);
        }
        _arrayResult.push(result.length);
        _counterHours++;
        cb(pReq,pRes);
    });
}


var searchUserHoursVenue = function(pReq,pRes,pHours,pOrganization,pDateStart,pDateEnd,cb)
{
	var a = M_Login.aggregate([
		{
			$project:{
				_id:1,
				idClient:'$client.id',
				org_id_OnLive:1,
				created_at:1,
				hourStart: { $gt: [ "$created_at", pDateStart.toISOString() ] },
				hourEnd: { $lt: [ "$created_at", pDateEnd.toISOString() ] }
		}},

		{$match: { 'org_id_OnLive' : pOrganization, 'venue_id_OnLive':pReq.query['idVenue'],'hourStart':true,'hourEnd':true}},
		{$group:{_id: "$idClient",firstSalesDate: { $first: "$idClient" }}}
		],function (err, result) {
        if (err) {
            console.log(err);
        }
        _arrayResult.push(result.length);
        _counterHours++;
        cb(pReq,pRes);
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
		var _headLine =[];
		if(pReq.query['pastWeek']==ACTIVE)
		{
			_headLine.push(_tittle[0]);
			_headLine.push(_tittle[1]);
		}
	
		if(pReq.query['pastFourWeek']==ACTIVE)
		{
			_headLine = _tittle;
		}
		else
		{
			_headLine.push(_tittle[0]);
		}
		
		_response.unshift(_headLine);
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
	var _row = [_filtersName[_counterBuilder]];
	_row.push(_arrayResult[_counterBuilder]);
	if(pReq.query['pastWeek']==ACTIVE)
	{
		_row.push(_arrayResult[_counterBuilder+NUMBER_OF_HOURS]);
	}
	if(pReq.query['pastFourWeek']==ACTIVE)
	{
		var _averague = (_arrayResult[_counterBuilder]+_arrayResult[_counterBuilder+NUMBER_OF_HOURS]+
		_arrayResult[_counterBuilder+2*NUMBER_OF_HOURS]*_arrayResult[_counterBuilder+3*NUMBER_OF_HOURS])/NUMBER_OF_WEEK;
		_row.push(_averague)
	}

	_response.push(_row);
	_counterBuilder++;
	cb(pReq,pRes);
}
