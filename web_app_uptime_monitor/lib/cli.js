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

// Input handlers
e.on('man', function(str) {
	cli.responders.help();
});
e.on('help', function(str) {
	cli.responders.help();
});
e.on('exit', function(str) {
	cli.responders.exit();
});
e.on('stats', function(str) {
	cli.responders.stats();
});
e.on('list users', function(str) {
	cli.responders.listUsers();
});
e.on('more user info', function(str) {
	cli.responders.moreUserInfo(str);
});
e.on('list checks', function(str) {
	cli.responders.listChecks(str);
});
e.on('more check info', function(str) {
	cli.responders.moreCheckInfo(str);
});
e.on('list logs', function(str) {
	cli.responders.listLogs();
});
e.on('more log info', function(str) {
	cli.responders.moreLogInfo(str);
});

// Responder object
cli.responders = {};

// Help / man
cli.responders.help = function() {
	console.log('You asked for help');
}
cli.responders.exit = function() {
	process.exit(0);
}
cli.responders.stats = function() {
	console.log('You asked for stats');
}
cli.responders.listUsers = function() {
	console.log('You asked for list users');
}
cli.responders.moreUserInfo = function(str) {
	console.log('You asked for more user info ', str);
}
cli.responders.listChecks = function(str) {
	console.log('You asked for list checks ', str);
}
cli.responders.moreCheckInfo = function(str) {
	console.log('You asked for more check  info', str);
}
cli.responders.listLogs = function() {
	console.log('You asked for list logs');
}
cli.responders.moreLogInfo = function(str) {
	console.log('You asked for more log info ', str);
}

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