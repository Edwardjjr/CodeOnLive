var express = require('express');
var app = module.exports = express();
var winston = require('winston');
require('winston-papertrail').Papertrail;


var logger = new winston.Logger({
    transports: [
        new winston.transports.Papertrail({
            host: 'logs3.papertrailapp.com',
            port: 23794
        })
    ]
  });

module.exports = {
	SendMessage:function (message)
	{
		logger.info(message);
	}
};