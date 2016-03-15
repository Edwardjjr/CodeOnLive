var E_Express = require('express');
var E_App = module.exports = E_Express();

E_App.use('/v1',require('./v1'));
//E_App.use('/v2',require('./v2'));
//E_App.use('/v3',require('./v3'));