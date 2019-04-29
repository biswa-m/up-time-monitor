/* 
 * server related file
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
var util = require('util');
var debug = util.debuglog('server');

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
		debug('Request received on path: '+trimmedPath+
			'\nwith the method: ', method,
			'\nwith these query string parameters: ', 
				queryStringObject,
			'\nwith these headers: ', headers,
			'\nwith this payload: ', buffer
			);

		// Chose the handler this request should go
		
		// default handler
		var chosenHandler = handlers.notFound;

		// Match requested path with defined router
		Object.keys(server.router).some(x => {
			routerRegEx = new RegExp('^'+x+'(\/.*)?$');
			if (trimmedPath.match(routerRegEx)) {
				chosenHandler = typeof(server.router[x]) !== 'undefined' ? server.router[x] : handlers.notFound;
				// stop the some function after the first match
				return true;
			}
		});
		
		// Construct data object to send to handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : helpers.parseJsonToObject(buffer)
		};

		// Route the request to the handler specified in the router
		chosenHandler(data, function(statusCode, payload, contentType){
			// Use the status code called back by handler or default 200
			statusCode = typeof(statusCode) == 'number'
				? statusCode : 200;

			// Determine the type of response (fallback to JSON)
			contentType = typeof(contentType) == 'string' ? contentType : 'json';

			// Return response parts that are content specific
			var payloadString = '';
			if (contentType == 'html') {
				res.setHeader('Content-Type', 'text/html');
				payloadString = typeof(payload) == 'string' ? payload : '';
			} else if (contentType == 'json') {
				res.setHeader('Content-Type', 'application/json');
				payload = typeof(payload) == 'object' ? payload : '';
				payloadString = JSON.stringify(payload);
			} else if (contentType == 'favicon') {
				res.setHeader('Content-Type', 'image/x-icon');
				payloadString = typeof(payload) != undefined ? payload : '';
			} else if (contentType == 'css') {
				res.setHeader('Content-Type', 'text/css');
				payloadString = typeof(payload) != undefined ? payload : '';
			} else if (contentType == 'png') {
				res.setHeader('Content-Type', 'image/png');
				payloadString = typeof(payload) != undefined ? payload : '';
			} else if (contentType == 'jpg') {
				res.setHeader('Content-Type', 'image/jpeg');
				payloadString = typeof(payload) != undefined ? payload : '';
			} else {
				res.setHeader('Content-Type', 'text/plain');
				payloadString = typeof(payload) != undefined ? payload : '';
			}

			// Return response parts that are common to all content-types
			res.writeHead(statusCode);
			res.end(payloadString);

			// If the response is 200, print green otherwise print red 
			if (statusCode == 200) {
				debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+ '/' + trimmedPath + ' ' + statusCode);
			} else {
				debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+ '/' + trimmedPath + ' ' + statusCode);
			}
		});
	});
};

// Define a request router
server.router = {
	'' : handlers.index,
	'account/create' : handlers.accountCreate,
	'account/edit' : handlers.accountEdit,
	'account/deleted' : handlers.accountDeleted,
	'session/create' : handlers.sessionCreate,
	'session/deleted' : handlers.sessionDeleted,
	'checks/all' : handlers.checkList,
	'checks/create': handlers.checksCreate,
	'checks/edit': handlers.checksEdit,
	'ping' : handlers.ping,
	'api/users' : handlers.users,
	'api/tokens' : handlers.tokens,
	'api/checks' : handlers.checks,
	'favicon.ico' : handlers.favicon,
	'public' : handlers.public 
};

// Init server
server.init = function() {
	// Start http server
	server.httpServer.listen(config.httpport, function(){
		console.log('\x1b[35m%s\x1b[0m', "The server is listening port " + config.httpport + ' in ' + config.envName + " mode");
	});
	// Start https server
	server.httpsServer.listen(config.httpsport, function(){
		console.log('\x1b[36m%s\x1b[0m', "The server is listening port " + config.httpport	+ ' in ' + config.envName + " mode");
	});
}

// Export the module
module.exports = server;
