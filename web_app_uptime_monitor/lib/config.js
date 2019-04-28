/* 
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Stagging (default) environment
environments.staging = {
	'httpport' : 3000,
	'httpsport': 3001,
	'envName' : 'staging',
	'hashingSecret' : 'thisIsASecret',
	'maxChecks' : 5,
	'twilio' : {
		'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
		'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
		'fromPhone' : '+15005550006'
	},
	'templateGlobals' : {
		'appName' : 'UptimeChecker',
		'companyName' : "Neo's hub",
		'yearCreated' : '2018',
		'baseUrl' : 'http://localhost:3000/'
	}
};

// Production environment
environments.production = {
	'httpport' : 5000,
	'httpsport' : 5001,
	'envName' : 'productiona',
	'hashingSecret' : 'thisIsAlsoASecret',
	'maxChecks' : 5,
	'twilio' : {
		'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
		'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
		'fromPhone' : '+15005550006'
	},
	'templateGlobals' : {
		'appName' : 'UptimeChecker',
		'companyName' : "Neo's hub",
		'yearCreated' : '2018',
		'baseUrl' : 'http://localhost:5000/'
	}
};

// Check command-line argument for environment
var currentEnvironment = 
	typeof(process.env.NODE_ENV) == 'string'
	? process.env.NODE_ENV.toLowerCase()
	: '';

// Check the current environment is defined above
var environmentToExport = 
	typeof(environments[currentEnvironment]) == 'object'
	? environments[currentEnvironment]
	: environments.staging;



// Export the module
module.exports = environmentToExport;
