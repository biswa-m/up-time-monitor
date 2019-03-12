/* 
 * This is server related file
 */

// Dependencies
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var handlers = require('./handlers/handlers');
var helpers = require('./helpers');
var config = require('./config');
var util = require('util');
var debug = util.debuglog('server'); 

// Instantiate the server module object
var server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer(function(req, res){
	server.unifiedServer(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
	'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
	server.unifiedServer(req, res);	
});

// Server function for both http and https server
server.unifiedServer = function(req, res) {
	// parse url
	parsedUrl = url.parse(req.url, true); 

	// Get the header as an object
	var headers = req.headers;

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// Get the HTTP Method
	var method = req.method.toLowerCase();

	// Get the payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data', function(data){
		buffer += decoder.write(data);
	});

	req.on('end', function(){
		buffer += decoder.end();

		// Log the request data
		debug('Request received',
			'\n\tpath: ', trimmedPath,
			'\n\tmethod: ', method,
			'\n\tquery string parameters: ',  queryStringObject,
			'\n\theaders: ',  headers,
			'\n\tpayload: ', buffer
			);

		// Choose the handler to handle this request
		var chooseHandler = server.router[trimmedPath]
				? server.router[trimmedPath]
				: handlers.default;
		
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : helpers.parseJsonToObject(buffer) 
		};

		// Call the handlers
		chooseHandler(data, function(statusCode, payload){
			// Validate response, set to default if invalid
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};
			
			// Return response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(JSON.stringify(payload));

			// If the response is 200, print green otherwise print red
            if (statusCode == 200) {
                debug('\x1b[32m%s\x1b[0m', method.toUpperCase()+ '/' + trimmedPath + ' ' + statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m', method.toUpperCase()+ '/' + trimmedPath + ' ' + statusCode);
            }
		});
	});
};

// Router object
server.router = {
	'ping' : handlers.ping,
	'user' : handlers.user,
	'token' : handlers.token,
	'cart' : handlers.cart,
	'menu' : handlers.menu,
	'checkout' : handlers.checkout
};

// Init server
server.init = function(){
	// Start http server
	server.httpServer.listen(config.httpport, function(){
		console.log('\x1b[35m%s\x1b[0m', 'The server is listening port '+ config.httpport + ' in mode: ' + config.envName);
	});

	// Start https server
	server.httpsServer.listen(config.httpsport, function(){
		console.log('\x1b[36m%s\x1b[0m', 'The server is listening port '+ config.httpsport + ' in mode: ' + config.envName);
	});
};



// Export server module
module.exports = server;
