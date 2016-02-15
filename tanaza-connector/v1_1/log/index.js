var express = require('express');
var app = module.exports = express();
var Payload = require('../../../model/payload');
var store = require('json-fs-store')('');
var OnLiveLogger = require('../onLiveLogger/index.js');
var nconf = require ('nconf');


module.exports = {
	RegisterLogin: function(jsonBody)
	{
		for (counterLogin in jsonBody) {
			OnLiveLogger.SendMessage('recevid login '+ jsonBody[counterLogin]['id']);
			var payload = new Payload(
			{
				id_login:jsonBody[counterLogin]['id'],
				body: JSON.stringify(jsonBody[counterLogin]),
				state: "pending"
			});
			payload.save(function(err) {
			  if (err)
			  {
			  	OnLiveLogger.SendMessageError(nconf.get('Erros:ErrorconnectionDataBase')+ jsonBody[counterLogin]['id']);
			  	var login = {
				id : jsonBody[counterLogin]['id'],
				client: jsonBody[counterLogin]
				}
				store.add(login, function(err) {
				  if (err) throw err; 
				});
			  }

			  console.log('payload saved successfully!');
			});
			
		}
	},
	UpdateLogin: function(id,state)
	{
		Payload.update({"id_login":id},{ $set: { state: state }},{ multi: true },function  (err, numAffected) {});
	},
	CreateUser: function(user, state)
	{
		var payload = new Payload(
		{
			id_login:user['id'],
			body: user,
			state: state
		});
		payload.save(function(err) {
		if (err) throw err;

		  console.log('payload user saved successfully!');
		});
		var login = {
			id : user['id'],
			client: user,
			state : state
		}
		store.add(login, function(err) {
		  if (err) throw err; 
		});
	}
};