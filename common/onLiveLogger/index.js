var express = require('express');
var app = module.exports = express();
var winston = require('winston');
var  Papertrail = require('winston-papertrail').Papertrail;





var fileLogger = new winston.transports.File({
            level: 'debug',
            filename: 'all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        });
var consoleLogger = new winston.transports.Console({
        level: 'debug',
        timestamp: function() {
            return new Date().toString();
        },
        colorize: true
    });
var ptTransport = new Papertrail({
        host: 'logs3.papertrailapp.com',
        port: 23794,
        level: 'debug',
        program: 'tanaza-connector',
        handleExceptions : true,
        logFormat: function(level, message) {
            return '[' + level + '] ' + message;
        }
    });

ptTransport.on('error', function(err) {
    logger && logger.error(err);
});

ptTransport.on('connect', function(message) {
    logger && logger.info(message) && fileLogger;
});

var logger = new winston.Logger({
    transports: [
        ptTransport,
        consoleLogger,
        fileLogger
    ]
});     

module.exports = {
    SendMessage: function(message)
    {
        console.log("entro");
        logger.debug(message);
    },
    SendMessageError:function (err)
    {
        
    }

};
/*module.exports = {
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
};*/