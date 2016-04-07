/*----------------------------------------------------------------------
Dependencias:
Las mismas puede ser de archivos externos o de archivos propios de la 
inclementacion.
Externos: Sus nombres se trabajan con un E_.
Internos: Sus nombres se trabajan con una I_
Modelo de base de datos: Sus nombres se trabajan con una M_
-----------------------------------------------------------------------*/

var E_Winston = require('winston');
var E_Papertrail = require('winston-papertrail').Papertrail;
var E_Nconf = require ('nconf');


/*----------------------------------------------------------------------
Paramteros: Los mismo son tomados del archivo de configuracion del 
sistema.

Decripcion:
Se crear un transporte que permite hacer llos reportes a un archivo 
establecido en el archivo de configuracion.
Nota: este transporte cuenta con un atributo level dependiendo de su
valor asi va a ser el nivel de detalle del programa 
-----------------------------------------------------------------------*/

var _fileLogger = new E_Winston.transports.File({
            maxListeners: 0,
            level: E_Nconf.get('ConfiOnLiveLoggerConnector:level'),
            filename: E_Nconf.get('ConfiOnLiveLoggerConnector:file'),
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            colorize: true
        });
/*----------------------------------------------------------------------
Paramteros: Los mismo son tomados del archivo de configuracion del 
sistema.

Decripcion:
Se crear un transporte que permite hacer los reportes al consola.

Nota: este transporte cuenta con un atributo level dependiendo de su
valor asi va a ser el nivel de detalle del programa
-----------------------------------------------------------------------*/
var _consoleLogger = new E_Winston.transports.Console({
        level: E_Nconf.get('ConfiOnLiveLoggerConnector:level'),
        inlineMeta: true,
        timestamp: function() {
            return new Date().toString();
        },
        colorize: true
    });
/*----------------------------------------------------------------------
Paramteros: Los mismo son tomados del archivo de configuracion del 
sistema.

Decripcion:
Se crear un transporte que permite hacer los reportes al papertrail.

Nota: este transporte cuenta con un atributo level dependiendo de su
valor asi va a ser el nivel de detalle del programa
-----------------------------------------------------------------------*/
var _ptTransport = new E_Papertrail({
        host: E_Nconf.get('ConfiOnLiveLoggerConnector:host'),
        port: E_Nconf.get('ConfiOnLiveLoggerConnector:port'),
        level: E_Nconf.get('ConfiOnLiveLoggerConnector:level'),
        program: E_Nconf.get('ConfiOnLiveLoggerConnector:program'),
        inlineMeta: true,
        logFormat: function(level, message) {
            return '[' + level + '] ' + message;
        }
    });
/*----------------------------------------------------------------------
Paramteros: 

Decripcion:
Es un metodo generico que se ejecuta al reportarse un error con alguno de 
los transportes.
-----------------------------------------------------------------------*/
_ptTransport.on('error', function(err) {
    _logger && _logger.error(err);
});



/*----------------------------------------------------------------------
Paramteros: 

Decripcion:
Es un metodo generico que se ejecuta al reportarse una conexion iniciada
con papertaril.
-----------------------------------------------------------------------*/
_ptTransport.on('connect', function(message) {
    _logger && _logger.debug(message);
});


var _logger = new E_Winston.Logger({
    transports: [
        _ptTransport,
        _consoleLogger,
        _fileLogger
    ]
});


/*----------------------------------------------------------------------
Paramteros: pMessge: es el mensaje que se desea reportar.
            pLevel: es el nivel del mensaje.

Decripcion:
Este metodo es generico para accionar el envio de mensajes, cada uno de
los mensajes recibidos trae el pLevel que es le nivel del mensaje(debug,
info,warn,error), por lo que se bsucara ser enviado pero estara limitado
con el nivel configurado de laca uno de los trasnports.
-----------------------------------------------------------------------*/     

module.exports = {
    SendMessage: function(pMessage, pLevel)
    {
        switch(pLevel) {
        case 'debug':
            _logger.debug(pMessage);
            break;
        case 'info':
            _logger.info(pMessage);
            break;
        case 'warn':
            _logger.warn(pMessage);
            break;
        case 'error':
            _logger.error(pMessage);
            break;
        default:
            _logger.debug(pMessage);
        }
    }
};
