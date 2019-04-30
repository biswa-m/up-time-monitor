/*
 * CLI-Releted Tasks
 */

// Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();

// Instantiate the CLI module object
var cli = {};

// Input processor
cli.processInput = function(str) {
	str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;

	if (str) {
		// Codify the unique strings that identify the allowed unique questions
		var uniqueInputs = [
			'man',
			'help',
			'exit',
			'stats',
			'list users',
			'more user info',
			'list checks',
			'more check info',
			'list logs',
			'more log info'
		];

		// Go throgh possible inputs and emit an event if match is found
		var matchFound = false;
		var counter = 0;
		uniqueInputs.some(function(input) {
			if (str.toLowerCase().indexOf(input) > -1) {
				matchFound = true;
				// Emit an event and include the full string given by the user
				e.emit(input, str);
				return true;
			}
		});

		// If no match is found, tell the user to try again
		if (!matchFound) {
			console.log('Sorry, try again');
		}
	}
};

// Init script
cli.init = function() {
	// Send the start message to the console, in blue color
	console.log('\x1b[34m%s\x1b[0m', "The CLI is running");
	
	// Start the interface
	var _interface = readline.createInterface({
		input: process.stdin,
		// output: process.stdout, // It was mirroring the input from stdin to stdout
		// prompt: '>' // Since output is not set, prompt will not work
	});

	// Create an initial prompt
	//_interface.prompt(); // If output is set, this is the standard way
	process.stdout.write('> ');

	// Handle each line of input separately
	_interface.on('line', function(str) {
		// Send to the input processor
		cli.processInput(str);

		// Re-initialize the prompt afterwards
		//_interface.prompt(); // If output is set, this is the standard way
		process.stdout.write('> ');
	});

	// If the user stops the CLI, kill the associated process
	_interface.on('close', function() {
		process.exit(0);
	});
}

// Export the module
module.exports = cli;