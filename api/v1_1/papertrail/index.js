var express = require('express');
var app = module.exports = express();
var winston = require('winston');
require('winston-papertrail').Papertrail;




module.exports = {
	SendMessage:function (message)
	{
        var logger = new winston.Logger({
            transports: [
                new winston.transports.Papertrail({
                    host: 'logs3.papertrailapp.com',
                    port: 23794
                })
            ]
        });
		logger.info(message);
	},
    SendMessageError:function (message)
    {
        var logger = new winston.Logger({
            transports: [
                new winston.transports.Papertrail({
                    host: 'logs3.papertrailapp.com',
                    port: 23794,
                    program :"Error01"
                })
            ]
        });
        logger.error(message);
    }
};