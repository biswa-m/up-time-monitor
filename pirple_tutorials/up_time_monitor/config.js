/* 
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Stagging (default) environment
environments.staging = {
	'port' : 3000,
	'envName' : 'staging'
};

// Production environment
environments.production = {
	'port' : 5000,
	'envName' : 'production'
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
