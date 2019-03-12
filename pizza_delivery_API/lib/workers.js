/*
 * Background workers
 */

// Dependeancies
//var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('https');
var http = require('http');
var helpers = require('./helpers');
var url = require('url');
var _logs = require('./logs');
var util = require('util');
var debug = util.debuglog('workers');

// Instantiate the workers object
var workers = {};

// Rotate (compress) the log file
workers.rotateLogs = function(){
	// List all the non compressed log files
	_logs.list(false, function(err, logs) {
		if (!err && logs && logs.length > 0) {
			logs.forEach(function(logName){
				// Compress the data to a different file
				var logId = logName.replace('.log', '');
				var newFileId = logId + '-' + Date.now();
				_logs.compress(logId, newFileId, function(err){
					if (!err) {
						// Truncate the log
						_logs.truncate(logId, function(err) {
							if (!err) {
								debug("Success truncation logFile: ", logId);
							} else {
								debug("Error truncation logFile: ", logId);
							}
						});
					} else {
						debug("Error compressing one of the log file", err);
					}		
				});
			}); 
		} else {
			debug("Error: could not find any logs to rotate");
		}
	});
};

// Timer to execute log rotation process once per day
workers.logRotationLoop = function(){
	setInterval(function(){
		workers.rotateLogs();
	}, 1000 * 60 * 60 * 24);
};

// Init script
workers.init = function(){

	// Send to console in yellow
	console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

	// Compress all the logs immediately
	workers.rotateLogs();

	// Call the compression loop so logs will be compress later on
	workers.logRotationLoop();
};

// Export the module
module.exports = workers;
