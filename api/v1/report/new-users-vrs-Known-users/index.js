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
var M_User = require('../../../../model/user');
var moment = require('moment');

var MILISECONDSFORDAY= 86400000;
var _filtersName;
var _NewClients;
var _KnowClients;
var _counter;
var _counterBulider;
var _counterLoop;
var _counterUser;
var _promedioNew;
var _promedioKnow;


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
	var _start = moment(pReq.query['from']);
	var _end = moment(pReq.query['end']);
	var _organization =  pReq.query['organization'];
	var _days = ((_end-_start)/MILISECONDSFORDAY)-1;
	_counter = _days;
	_counterBulider = 0;
	_filtersName=[];
	_NewClients=[];
	_KnownClients=[];
	_promedioKnow = 0;
	_promedioNew = 0;
	_response = [["Fechas","Usuarios Nuevos","Usuarios conocidos"]];
	var _initDate = moment(pReq.query['end']);
	search(pRes,pReq,_initDate,_days,_organization);
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
	if(_counter >= 0)
	{
		var _date = moment(pEnd);
		var _dateEnd = moment(pEnd);
		_date = _date.subtract(_counter, 'day');
		_dateEnd = _dateEnd.subtract(_counter-1, 'day');
		var dateString = getDayName(_date.isoWeekday())+' '+_date.get('date')+'-'+ (_date.get('month')+1) +'-'+_date.get('year');
		_filtersName.push(dateString);
		searchUsers(search,pRes,pReq,pEnd,pDays,_date,_dateEnd,pOrganization);
		_counter--;
		

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

var searchUsers = function(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization)
{

	M_Login.distinct("client.id",{"org_id_OnLive":pOrganization,"created_at": 
		{"$gte":pDate,"$lte":pDateEnd}}).exec(function(err, results) {
		_counterLoop = 0;
		_counterUser = 0;
		scrollList(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization,results);
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
            cb: funcion search;
            pListUser: lista de usuarios entre el ragon de fecha en este caso
            un dia.

Decripcion:
se enjcarga de recorrer la lista de usuarios reportados ese dia.  
-----------------------------------------------------------------------*/
var scrollList = function(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization,pListUser)
{
	if(_counterLoop < pListUser.length)
	{
		searchNewUsers(cb,scrollList,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization,pListUser);
	}
	else
	{
		_NewClients.push(_counterUser);
		searchKnownUsers(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization);
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
            cb: funcion search;
            cbList: funcion scrollList

Decripcion:
toma cada uno de los usuarios de la lista y verifica si se creo en el 
rando de fechas entre pDate and pDateEnd y de ser asi lo cuenta como un
usuario nuevo.  
-----------------------------------------------------------------------*/
var searchNewUsers = function(cb,cbList,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization,pListUser)
{
	M_User.findOne({"id":pListUser[_counterLoop],"created_at": {"$gte":pDate,"$lte":pDateEnd}}).exec(
		function(err,results)
		{
			if(results != null)
			{
				_counterUser++;
			}
			_counterLoop++;
			cbList(cb,pRes,pReq,pEnd,pDays,pDate,pDateEnd,pOrganization,pListUser);		
		}
	);
	
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
		{"$gte":pDate,"$lte":pDateEnd}}).exec(function(err, c) {
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
		var _row = ['Promedio de la Semana',(_promedioNew/7),(_promedioKnow/7)];
		_response.splice(1,0,_row);
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
	_promedioNew = _promedioNew + _NewClients[_counterBulider];
	_promedioKnow = _promedioKnow + (_KnownClients[_counterBulider]-_NewClients[_counterBulider]);
	var _row = [_filtersName[_counterBulider],_NewClients[_counterBulider],
				(_KnownClients[_counterBulider]-_NewClients[_counterBulider])];
	_response.push(_row);
	_counterBulider++;
	CreateTable(pReq,pRes);
}


/*----------------------------------------------------------------------
Paramteros: pDay: Nu numero del dia de la semana.

Decripcion:
Se encarga de retornar el nombre del dia de  la semana segun corresponda.
-----------------------------------------------------------------------*/

var getDayName = function (pProviderId) {
	switch(pProviderId)
	{
		case 7:
			return "Domingo";
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
		default:
			return "unknown";
	}
}