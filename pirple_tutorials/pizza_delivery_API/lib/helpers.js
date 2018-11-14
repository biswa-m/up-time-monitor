/* 
 * Helper module
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');

// Instantiate the helper module
var helpers = {};

// Json to object
helpers.parseJsonToObject = function(str){
	try {
		var obj = JSON.parse(str);
		return obj;
	} catch(e) {
		return {};
	} 
};

// Create a SHA256 hash
helpers.hash = function(str){
    if (typeof(str) == 'string' && str.length > 0) {
        var hash = crypto
            .createHmac('sha256', config.hashingSecret)
            .update(str)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
};


// Export helpers
module.exports = helpers;
