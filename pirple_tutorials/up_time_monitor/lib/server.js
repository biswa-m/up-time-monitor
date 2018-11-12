/* 
 * These are server related file
 */

// Dependancies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

// Instatntiate the server module object
var server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer(function(req, res){
	server.unifiedServer(req, res);
});


// Instantiate the HTTPS server
server.httpsServerOptions = {
	'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')), 
	'cert' : fs.readFileSync(path.join(__dirname, '../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
	server.unifiedServer(req, res);
});



// All the server logic for both the http and https server
server.unifiedServer = function(req, res){
	
	// Get the URL and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// Get the HTTP Method
	var method = req.method.toLowerCase();

	// Get the header as an object
	var headers = req.headers;

	// Get the payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data', function(data){
		buffer += decoder.write(data);
	});
	req.on('end', function(){
		buffer += decoder.end();

		// Log the request data
		console.log('Request received on path: '+trimmedPath+
			'\nwith the method: ', method,
			'\nwith these query string parameters: ', 
				queryStringObject,
			'\nwith these headers: ', headers,
			'\nwith this payload: ', buffer
			);

		// Chose the handler this request should go
		var chosenHandler = 
			typeof(server.router[trimmedPath]) !== 'undefined'
				? server.router[trimmedPath]
				: handlers.notFound;

		// Construct data object to send to handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : helpers.parseJsonToObject(buffer)
		};

		// Route the request to the handler specified in the router
		chosenHandler(data, function(statusCode, payload){
			// Use the status code called back by handler 
			// or default 200
			statusCode = typeof(statusCode) == 'number'
				? statusCode : 200;

			// Use the payload called back by handler
			// or default empty object
			payload = typeof(payload) == 'object'
				? payload : {};

			// Convert the payload to a string
			var payloadString = JSON.stringify(payload);

			// Return response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the response
			console.log(
				'\nreturning this response: ', 
					statusCode, payloadString,
				'\n');
		});
	});
};

// Define a request router
server.router = {
	'ping' : handlers.ping,
	'users' : handlers.users,
	'tokens' : handlers.tokens,
	'checks' : handlers.checks
};

// Init server
server.init = function() {
	// Start http server
	server.httpServer.listen(config.httpport, function(){
		console.log("The server is listening port " + config.httpport
			+ ' in ' + config.envName + " mode\n");
	});
	// Start https server
	server.httpsServer.listen(config.httpsport, function(){
		console.log("The server is listening port " + config.httpsport
			+ ' in ' + config.envName + " mode\n");
	});
}

// Export the module
module.exports = server;
