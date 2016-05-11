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
var M_Login = require('../../../../model/login');
var M_Organization = require('../../../../model/organization');
var E_Moment = require('moment');

var NUMBER_OF_WEEK = 4;
var PAST_WEEK= 2;
var ACTIVE = 1;

var NUMBER_OF_MILISEGUNDOS_BY_HOURS = 3600000;
var NUMBER_OF_MILISEGUNDOS_BY_DAY = 86400000;
var _counterHours;
var _counterHoursDefault;
var _filtersName = ['12 AM','1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','7 AM','8 AM','9 AM','10 AM','11 AM',
					'12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM','11 PM','Fuera'];
var _tittle=["Hora","Semana Actual","Semana Anterior","Promedio 4 Semanas"];
var _counterWeek;
var _counterBuilder;
var _response;
var _arrayResult;
var _hourEnd;
var _numberOfHours; 
var _initHour;
var _flag;

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se reciben peticon para evr los usuarios por hora en un dia espacifico de 
la semana.
-----------------------------------------------------------------------*/

E_App.get('/', function(pReq, pRes) {
	initVariable(pReq,pRes);
	
});
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Inicializa lso datos para realizar la consulta. Donde se determina el 
rango de horas donde la empresa se encuentra interesada.
-----------------------------------------------------------------------*/
var initVariable = function(pReq,pRes)
{
	_counterWeek = 0;
	_counterBuilder = 0;
	_response = [];
	_arrayResult= [];
	_flag = true;
	M_Organization.findOne({"_id":pReq.query['organization']}).exec(function(err,result)
	{
		_initHour = result["rangeHours"][0];
		_counterHoursDefault = result["rangeHours"][0];
		_hourEnd = result["rangeHours"][1];
		_numberOfHours = _hourEnd - _counterHoursDefault;
		_counterHours = _counterHoursDefault;
		search(pReq,pRes);
	});
	
}
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.

Decripcion:
Se determina la semana correspondiente, en caso de que se debe calcualar 
las semanas anteriores.
-----------------------------------------------------------------------*/
var searchWeek = function(pReq,pRes)
{
	if(pReq.query['pastFourWeek']==ACTIVE)
	{
		if(_counterWeek < NUMBER_OF_WEEK)
		{
			_counterHours = _counterHoursDefault;
			_flag = true;
			search(pReq,pRes);
		}
		else
		{	
			console.log(_arrayResult);
			CreateTable(pReq,pRes);
		}
	}
	else
	{
		if(pReq.query['pastWeek']==ACTIVE)
		{
			if(_counterWeek <= 1)
			{
				_counterHours = _counterHoursDefault;
				_flag = true;
				search(pReq,pRes);
			}
			else
			{
				console.log(_arrayResult);
				CreateTable(pReq,pRes);
			}
		}
		else
		{
			CreateTable(pReq,pRes);
		}
	}
}

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se determina cuales de las cinsultas se deben realziar si solo la del 
dia, o la semana pasada o el promedio de las 4 semanas antenteriores.
Se monifican las fechas y horas segun corresponda.
-----------------------------------------------------------------------*/
var search = function(pReq,pRes)
{
	var _organization =  pReq.query['organization'];
	var _dateStart = E_Moment(pReq.query['from']);
	var _dateEnd = E_Moment(pReq.query['from']);
	_dateStart = _dateStart.add(_counterHours,'hour');
	_dateStart = _dateStart.subtract(_counterWeek,'week');
	_dateEnd = _dateEnd.add(_counterHours+1,'hour');
	_dateEnd = _dateEnd.subtract(_counterWeek,'week');
	_dateStart =  _dateStart.subtract(4,'hour');
	_dateEnd = _dateEnd.subtract(4,'hour');
	_dateStart =  new Date(_dateStart);
	_dateEnd = new Date(_dateEnd);
	console.log("semna aactual:"+_dateStart);
	console.log("semna aactual:"+_dateEnd)
	if(_counterHours <= _hourEnd)
	{
		if(pReq.query['idVenue'] != "null")
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
		//_counterWeek++;
		//searchWeek(pReq,pRes);
		seachOthers(pReq,pRes);

	}
}

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            cb: seach 

Decripcion:
Se realizar la consulta del numero de usuarios conectados en 1 hora
para una organizacion.
-----------------------------------------------------------------------*/
var searchUserHoursOrganizacion = function(pReq,pRes,pOrganization,pDateStart,pDateEnd,cb)
{
	M_Login.find({'org_id_OnLive':pOrganization,'created_at':{$gt: pDateStart,$lt:pDateEnd}}).exec(
		function (error,result)
		{
	        _arrayResult.push(result.length);
	        _counterHours++;
	        cb(pReq,pRes);
		});
}

/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response.
            cb: seach 

Decripcion:
Se realizar la consulta del numero de usuarios conectados en 1 hora
para una venue.
-----------------------------------------------------------------------*/
var searchUserHoursVenue = function(pReq,pRes,pHours,pOrganization,pDateStart,pDateEnd,cb)
{
	M_Login.find({'org_id_OnLive':pOrganization,'venue_id_OnLive':pReq.query['idVenue'],'created_at':{$gt: pDateStart,$lt:pDateEnd}}).exec(
		function (error,result)
		{
	        _arrayResult.push(result.length);
	        _counterHours++;
	        cb(pReq,pRes);
		});
}


var seachOthers = function(pReq,pRes)
{
	var _organization =  pReq.query['organization'];
	var _dateStart = E_Moment(pReq.query['from']);
	var _dateEnd = E_Moment(pReq.query['from']);
	_dateStart = _dateStart.subtract(_counterWeek,'week');
	_dateEnd = _dateEnd.add(_initHour,'hour');
	_dateEnd = _dateEnd.subtract(_counterWeek,'week');
	_dateStart =  _dateStart.subtract(4,'hour');
	_dateEnd = _dateEnd.subtract(4,'hour');
	_dateStart =  new Date(_dateStart);
	_dateEnd = new Date(_dateEnd);
	if(_flag)
	{
		console.log(_dateStart);
		console.log(_dateEnd);
		if(pReq.query['idVenue'] != "null")
		{
			searchUserHoursVenue(pReq,pRes,_counterHours,_organization,_dateStart,_dateEnd,seachOthers);
			_flag=false; 
		}
		else
		{
			searchUserHoursOrganizacion(pReq,pRes,_organization,_dateStart,_dateEnd,seachOthers);
			_flag=false;
		}
	}
	else
	{
		_counterWeek++;
		searchWeek(pReq,pRes);

	}
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
	if(_counterBuilder <= (_numberOfHours+1))
	{
		Insetar(pReq,pRes,CreateTable);
	}
	else
	{
		var _headLine =[];
		_headLine.push(_tittle[0]);
		_headLine.push(_tittle[1]);
		if(pReq.query['pastWeek']==ACTIVE)
		{
			_headLine.push(_tittle[2]);
		}
	
		if(pReq.query['pastFourWeek']==ACTIVE)
		{
			_headLine.push(_tittle[3]);
		}
		
		_response.unshift(_headLine);
		console.log(_response);
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
	var _row = [_filtersName[_counterBuilder+_initHour]];
	_row.push(_arrayResult[_counterBuilder]);
	if(pReq.query['pastWeek']==ACTIVE)
	{
		_row.push(_arrayResult[_counterBuilder+(_numberOfHours+2)]);
	}
	if(pReq.query['pastFourWeek']==ACTIVE)
	{
		var _averague = (_arrayResult[_counterBuilder]+_arrayResult[_counterBuilder+(_numberOfHours+2)]+
		_arrayResult[_counterBuilder+2*(_numberOfHours+2)]+_arrayResult[_counterBuilder+3*(_numberOfHours+2)])/NUMBER_OF_WEEK;
		_row.push(_averague)
	}

	_response.push(_row);
	_counterBuilder++;
	cb(pReq,pRes);
}
