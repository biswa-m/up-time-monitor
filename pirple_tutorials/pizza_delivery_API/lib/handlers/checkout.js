/* @TODO
	6. send email notification
	7. Delete cart
*/

/*
 * Handler for checkout process
 */

// Dependencies
var _data = require('../data');
var helpers = require('../helpers');
var config = require('../config');


// Container for the module
var _checkOut = {};

/* checkout - get
 * Required data: email, token, payload.currency, payload.source
 * Optional data: none
 */
_checkOut.post = function(data, callback) {
	// Validate required data
    var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
    var email
        = typeof(data.headers.email) == 'string'
        && data.headers.email.length > 0
        && emailRegEx.test(data.headers.email)
        ? data.headers.email
        : false;

    var tokenId =
        typeof(data.headers.token) == 'string'
        && data.headers.token.length == 20
        ? data.headers.token
        : false;
	
	var currency = typeof(data.payload.currency) == 'string'
		&& data.payload.currency.length > 0
		? data.payload.currency
		: false;
		
    var source = typeof(data.payload.source) == 'string'
		&& data.payload.source.length > 0 
		? data.payload.source
		: false;

	if (email && tokenId && currency && source) {
		// verify token
        _tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
            if (tokenIsValid) {
				_checkOut.totalCartAmount(email, function(err, amount, cartData){
					if (!err &&  amount && cartData) {
						// Create order no of random string of length 24
						var orderId = helpers.createRandomString(24);

						// Payload for payment gateway
						var payload = {
							'amount' : amount,
							'currency' : currency,
							'source' : source,
							'description' : orderId
						};
						// Receive payment via payment gateway
						helpers.receivePayment(orderId, payload, function(err, paymentData){
							if (!err && paymentData) {
								// Write order to file
								_data.create('orders', orderId, {cartData, paymentData}, false,function(err){
									if (!err) {
										callback(200, paymentData);

										// Delete existing shopping cart
										_data.delete('carts', email, function(err){
											if (!err) {
												console.log('Cart deleted for ' + email);
											} else {
												console.log('Failed to delete cart for ' + email);
											}
										});
									
									} else {
										callback(501, {'Error' : 'Payment received, Failed to place the order'});
									}
								});
							} else {
								callback(500, {'Error' : err, paymentData});
							}
						});
					} else {
						callback(500, {'Error' : err});
					}
				});
           } else {
                callback(400, msg);
            }
        });
	} else {
		callback(403, {'Error' : 'Missing required field(s)'});
	}
};

_checkOut.totalCartAmount = function(email, callback){
	 // Read cart
	_data.read('carts', email, function(err, cartData){
		if (!err && cartData) {
			// Read menu
			_data.read('menus', 'menu', function(err, menuData){
				if (!err && menuData) {
					// calculate total price
					helpers.calculateTotalPrice(cartData, menuData, function(err, totalPrice){
						if(!err && (typeof(totalPrice) == 'number') && totalPrice > 0) {
							callback(false, totalPrice, cartData);	
						} else {
							callback('Error calculating total price');
						}
					});
				} else {
					callback('Could not read from menu');
				}
			});
		} else {
			callback('Could not read cart');
		}
	});

};




// Export module
module.exports = _checkOut;
