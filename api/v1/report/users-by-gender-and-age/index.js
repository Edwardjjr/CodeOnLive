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
/*----------------------------------------------------------------------
Paramteros: pReq: request.
            pRes: response. 

Decripcion:
Se retorna un Json de la informacion de las organizaciones de la empresa.
-----------------------------------------------------------------------*/
E_App.get('/', function(pReq, pRes) {
  var _paramquery= ["from","end"];
  var _genders = ["male",'female'];
  var _filters= {};
  for(_param in _paramquery)
  {
  	if(pReq.query[_paramquery[_param]] != "")
  	{
  		_filters[_paramquery[_param]] = new Date(pReq.query[_paramquery[_param]]);
  	}
  	if(_param == (_paramquery.length -1))
  	{
  		for(_gender in _genders)
  		{
  			var _male = M_User.count({org_id_OnLive: pReq.query['organization'], gender:_genders[_gender],
	  			"created_at": {"$gte":new Date(pReq.query['from']), "$lt":new Date(pReq.query['end'])}},
	  			 function(err, c) {
	           console.log('Count is ' + c);
	      		}
      		);
  		}
  		
  		

  	}
  }
});