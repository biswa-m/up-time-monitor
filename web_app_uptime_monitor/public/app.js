/* 
 * Frontend logic for the Application
 */

// Containeer for the frontend application
var app = {};

// Config
app.config = {
	'sessionToken': false
};

// AJAX Client (for the restful API)
app.client = {};

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback) {
	// set default
	headers = typeof(headers) == 'object' && headers !== null ? headers : {};
	path = typeof(path) == 'string' ? path : '/';
	method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
	queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
	payload = typeof(payload) == 'object' && payload !== null ? payload : {};
	callback = typeof(callback) == 'function' ? callback : false;

	// For each query string parameter sent, add it to path
	var requestUrl = path+'?';
	var count = 0;
	for (var queryKey in queryStringObject) {
		if (queryStringObject.hasOwnProperty(queryKey)) {
			++counter;
			// If at least one query string parameter has already been added prepand new one with '&'
			if (counter > 1) {
				requestUrl += '&';
			}
			// Add the key and value
			requestUrl += queryKey+'='+queryStringObject[queryKey];
		}
	}

	// Form the http request as a JSON type
	var xhr = new XMLHttpRequest();
	xhr.open(method, requestUrl, true);
	xhr.setRequestHeader("Content-Type", "application/json");

	// For each header sent, add it to the request
	for (var headerKey in headers) {
		if (header.hasOwnProperty(headerKey)) {
			xhr.setRequestHeader(headerKey, headers[headerKey]);
		}
	}

	// If there is a current session token set, add that as header
	if (app.config.sessionToken) {
		xhr.setRequestHeader("token", app.config.sessionToken.id);
	}

	// When the request comes back, handle the response
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var statusCode = xhr.status;
			var responseReturned = xhr.responseText;

			// Callback if required
			if (callback) {
				try {
					var parseResponse = JSON.parse(responseReturned);
					callback(statusCode, responseReturned);
				} catch(e) {
					callback(statusCode, false)
				}
			}
		}
	}

	// Send the paload as JSON
	var payloadString = JSON.stringify(payload);
	xhr.send(payloadString);	
}