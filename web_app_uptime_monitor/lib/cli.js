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
var os = require('os');
var v8 = require('v8');

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
	var commands = {
		'exit': 'Kill the CLI (and rest of the application)',
		'man': 'Show this help page',
		'help': 'Alias of the "man" command',
		'stats': 'Get statisics of the underlying operations and resourse utilisation',
		'list users': 'Show a list of all the registered (undeleted) user in the system',
		'more user info --{userId}': 'Show details of a specific user',
		'list checks --up --down': 'Show a list of all the active checks in the system, including their satate, The "--up" and the "--down" flags are both optional',
		'more check info --{checkId}': 'Show details of a specified checks',
		'list logs': 'Show a list of all logs file available to be read (compressed and uncompressed)',
		'more log info --{fileName}': 'Show details of a specified log file' 
	};

	// Show a header for the help page that is as wide as the screen
	cli.horizontalLine();
	cli.centered('CLI MANUAL');
	cli.horizontalLine();
	cli.verticalSpace(2);

	// Show each command, followed by its explanation, in white and yellow respectively
	for (var key in commands) {
		if (commands.hasOwnProperty(key)) {
			var value = commands[key];
			var line = '\x1b[33m'+key+'\x1b[0m';
			var padding = 60 - line.length;

			for (i = 0; i < padding; ++i) {
				line += ' ';
			}
			line += value;
			console.log(line);
			cli.verticalSpace();
		}
	};

	cli.verticalSpace(1);
	cli.horizontalLine();
}

// Create a vertical space
cli.verticalSpace = function(lines) {
	lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
	for (i = 0; i < lines; ++i) {
		console.log('');
	}
};

// Create a horizontal line accross the screen
cli.horizontalLine = function(){
	// Get the available screen size
	var width = process.stdout.columns;

	var line = '';
	for (i = 0; i < width; ++i) {
		line += '-';
	}
	console.log(line);
};

// Create centered text on the screen
cli.centered = function(str) {
	str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

	// Get the available screen size
	var width = process.stdout.columns;

	// Calculate the left padding there should be
	var leftPadding = Math.floor((width - str.length) / 2);

	// Put in left padded spaces before the string itself
	var line = '';
	for (i = 0; i < leftPadding; ++i) {
		line += ' ';
	};
	line += str;
	console.log(line);
}

cli.responders.exit = function() {
	process.exit(0);
}
cli.responders.stats = function() {
	// Compile an object of stats
	var stats = {
		'Load Average': os.loadavg().join(' '),
		'CPU Count': os.cpus().length,
		'Free Memory': os.freemem(),
		'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
		'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
		'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
		'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
		'Uptime': os.uptime() + ' Seconds'
	};

	// Show a header for the stats
	cli.horizontalLine();
	cli.centered('SYSTEM STATISTICS');
	cli.horizontalLine();
	cli.verticalSpace(2);

	// Log out each stat
	for (var key in stats) {
		if (stats.hasOwnProperty(key)) {
			var value = stats[key];
			var line = '\x1b[33m'+key+'\x1b[0m';
			var padding = 60 - line.length;
			for (i = 0; i < padding; ++i) {
				line += ' ';
			}
			line += value;
			console.log(line);
			cli.verticalSpace();
		}
	};
	cli.verticalSpace(1);
	cli.horizontalLine();
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