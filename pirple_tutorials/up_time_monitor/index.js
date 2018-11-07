// Primary file for the API

// Dependancies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

// The server should respond to all requests with a string
var server = http.createServer(function(req, res){

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

		// Chose the handler this request should go
		var chosenHandler = 
			typeof(router[trimmedPath]) !== 'undefined'
				? router[trimmedPath]
				: handlers.notFound;

		// Construct data object to send to handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
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

			// Log the request path
			console.log('Request received on path: '+trimmedPath+
				'\nwith the method: ', method,
				'\nwith these query string parameters: ', 
					queryStringObject,
				'\nwith these headers: ', headers,
				'\nwith this payload: ', buffer,
				'\n returning this response: ', 
					statusCode, payloadString,
				'\n');
		});
	});
});

// Start the server and have it listen on port exported by config.js 
server.listen(config.port, function(){
	console.log("The server is listening port " + config.port
		+ ' in ' + config.envName + " mode\n");
});

// Define the handlers
var handlers = {};

// Sample handler
handlers.sample = function(data, callback){
	// Callback a http status code and a payload object
	callback(406, {name: 'sample handler'});	
};

//Not found handler
handlers.notFound = function(data, callback){
	callback(404);
};

// Define a request router
var router = {
	'sample' : handlers.sample
};
