/* 
 * Primary file for the API
 */

 // Dependencies
 var server = require('./lib/server');

 // Declare the app
 var app = {};

 // Init function
 app.init = function(){
	// Start the server
	server.init();	 

	// TODO start the workers
};

// Execute
app.init();

//Export the app
module.exports = app;
