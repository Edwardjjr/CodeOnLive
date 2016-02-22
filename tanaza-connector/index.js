var E_Express = require('express');
var E_App = module.exports = E_Express();

E_App.use('/v1',require('./v1'));
E_App.use('/v1_1',require('./v1_1'));
E_App.use('/v2',require('./v2'));