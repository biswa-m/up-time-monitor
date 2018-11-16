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

// Create a string of random alphanumeric character, of a given length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0
        ? strLength : false;
    if (strLength) {
        // Define all possible characters that could go into a string
        var possibleCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890';

        // start the final string
        var str = '';
        for (i = 1; i <= strLength; i++) {
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
        // return the final string
        return str;
    } else {
        return false;
    }
};

// Validate cart items
helpers.verifyCartItems = function(cartItems, menuData, callback){
    var cartItemsAreValid = true;
    var msg = {};

    cartItems.forEach(function(item){
        // Validate item
        var productId = typeof(item.productId) == 'string' && item.productId.length > 0 ? item.productId : false;
        var quantity = typeof(item.quantity) == 'number' && item.quantity > 0 ? item.quantity : false;

        if (productId && quantity) {
            // Match productId
            if (!menuData[productId]) {
                cartItemsAreValid = false;
                msg = {'Error' : 'Product id doesnot exist'};
            }
        } else {
            cartItemsAreValid = false;
            msg = {'Error' : 'Missing valid productId or purchase quantity'};
        }
    });
    callback(cartItemsAreValid, msg);
};



// Export helpers
module.exports = helpers;
