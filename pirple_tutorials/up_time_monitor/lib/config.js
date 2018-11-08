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
	'hashingSecret' : 'thisIsASecret'
};

// Production environment
environments.production = {
	'httpport' : 5000,
	'httpsport' : 5001,
	'envName' : 'productiona',
	'hashingSecret' : 'thisIsAlsoASecret'
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
