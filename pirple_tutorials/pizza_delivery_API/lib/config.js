/* 
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Staging (default) environments
environments.staging = {
	'httpport' : 3000,
	'httpsport' : 3001,
	'envName' : 'staging',
	'hashingSecret': 'ThisIsASecretCode',
	'stripeApiKey' : 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
	'emailGateway' : {'from' : 'Pizza shop <postmaster@sandbox8074d9f0387148cf96433bfc622ff9b7.mailgun.org>'}
};

// Production environments
environments.production = {
	'httpport' : 5000,
	'httpsport' : 5001,
	'envName' : 'production',
	'hashingSecret': 'ThisIsAnotherSecretCode',
	'stripeApiKey' : 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
	'emailGateway' : {'from' : 'Pizza shop <postmaster@sandbox8074d9f0387148cf96433bfc622ff9b7.mailgun.org>'}
};

// Check command-line arguments for environment
var currentEnvironment = 
	typeof(process.env.NODE_ENV) == 'string'
	? process.env.NODE_ENV.toLowerCase()
	: '';

// Check currentEnvironment is defined
var environmentToExport =
	typeof(environments[currentEnvironment]) == 'object'
	? environments[currentEnvironment]
	: environments.staging;

// Export the module
module.exports = environmentToExport;
