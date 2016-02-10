var express = require('express');
var app = module.exports = express();
var Payload = require('../../../model/payload');
var store = require('json-fs-store')('');
var Papertrail = require('../papertrail/index.js');


module.exports = {
	RegisterLogin: function(jsonBody)
	{
		for (counterLogin in jsonBody) {
			Papertrail.SendMessage('recevid login '+ jsonBody[counterLogin]['id']);
			var payload = new Payload(
			{
				id_login:jsonBody[counterLogin]['id'],
				body: JSON.stringify(jsonBody[counterLogin]),
				state: "pending"
			});
			payload.save(function(err) {
			  if (err) throw err;

			  console.log('payload saved successfully!');
			});
			var login = {
				id : jsonBody[counterLogin]['id'],
				client: jsonBody[counterLogin],
				state : 'pending'
			}
			store.add(login, function(err) {
			  if (err) throw err; 
			});
		}
	},
	UpdateLogin: function(id,state)
	{
		Payload.update({"id_login":id},{ $set: { state: state }},{ multi: true },function  (err, numAffected) {});
		 store.load(id, function(err, object){
			if(err) throw err; 
				 object['state'] = "success";
				 store.add(object, function(err) {
				  if (err) throw err; 
			});

			});
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