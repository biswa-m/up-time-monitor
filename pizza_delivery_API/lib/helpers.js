/* 
 * Helper module
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');
var StringDecoder = require('string_decoder').StringDecoder;

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

// calculate total price of cart items based on menu
helpers.calculateTotalPrice = function(cartData, menuData, callback){
	var errMsg = false; 
	var totalPrice = 0;

	cartData.cartItems.forEach(function(item){
        // Validate item
        var productId = typeof(item.productId) == 'string' && item.productId.length > 0 ? item.productId : false;
        var quantity = typeof(item.quantity) == 'number' && item.quantity > 0 ? item.quantity : false;

		if (productId && quantity) {
			if (menuData[productId]) {
				if (typeof(menuData[productId].price) == 'number' && menuData[productId].price >= 0){
					totalPrice += menuData[productId].price * quantity;		
				} else {
					errMsg = {'Error' : 'Could not read valid price of an item'}
				}
			} else {
				errMsg = {'Error' : 'Invalid productId'};
			}
        } else {
            errMsg = {'Error' : 'Missing valid productId or purchase quantity'};
        }
	});
    callback(errMsg, totalPrice);
};

// Accept payment using stripe.com
helpers.receivePayment = function(orderId, payload, callback){
	// Stringify the payload
	var stringPayload = querystring.stringify(payload);

	// Object for https request
	var requestOptions = {
		'protocol' : "https:",
		'hostname' : "api.stripe.com",
		'method' : 'POST',
		'path' : "/v1/charges", 
		'auth' : config.stripeApiKey +':',
		'headers' : {
			//"Authorization" : "Basic c2tfdGVzdF80ZUMzOUhxTHlqV0Rhcmp0VDF6ZHA3ZGM6",
			"Content-Type" : "application/x-www-form-urlencoded",
			"Content-Length" : Buffer.byteLength(stringPayload)
		}
	};

	// Instatntiate the request object
	var req = https.request(requestOptions, function(res){
		// Grab the status of the sent request
		var status = res.statusCode;
		if (status == 200 || status == 201) {
			var buffer = ''; 
			var decoder =  new StringDecoder('utf-8');

			res.on('data', function(data){
				buffer += decoder.write(data);
			});

			res.on('end', function(){
				buffer += decoder.end();
				var paymentData = helpers.parseJsonToObject(buffer);
				if (paymentData.paid && paymentData.status === 'succeeded') {
					callback(false, paymentData);
				} else {
					callback('Payment failled', paymentData);
				}
			});
		
		} else {
			callback('Status code returned by api.stripe.com was: ' + status, {});
		}
	});

	// Add the payload
	req.write(stringPayload);

	// Bind to the error event so it  does not get throw
	req.on('error', function(e){
		callback(e);
		console.log(e);
	});

	// End the request
	req.end();
};

// Send email via api.mailgun.com
helpers.sendEmail = function(payload, callback){
	// Stringify the payload
	var stringPayload = querystring.stringify(payload);

	// Object for https request
	var requestOptions = {
		'protocol' : "https:",
		'hostname' : "api.mailgun.net",
		'method' : 'POST',
		'path' : config.emailGateway.path, 
		'auth' : config.emailGateway.auth,
		'payload' : stringPayload,
		'headers' : {
			"Content-Type" : "application/x-www-form-urlencoded",
			"Content-Length" : Buffer.byteLength(stringPayload)
		}
	};

	// Instatntiate the request object
	var req = https.request(requestOptions, function(res){
		// Grab the status of the sent request
		var status = res.statusCode;
		if (status == 200 || status == 201) {
			var buffer = ''; 
			var decoder =  new StringDecoder('utf-8');

			res.on('data', function(data){
				buffer += decoder.write(data);
			});

			res.on('end', function(){
				buffer += decoder.end();
				callback(buffer);
			});
		
		} else {
			callback('Status code returned by email gateway was: ' + status);
		}
	});

	// Add the payload
	req.write(stringPayload);

	// Bind to the error event so it  does not get throw
	req.on('error', function(e){
		callback(e);
		console.log(e);
	});

	// End the request
	req.end();
};



// Export helpers
module.exports = helpers;
