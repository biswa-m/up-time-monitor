/* 
 * shopping cart handlers
 */

// Dependencies
var _data = require('../data');
var helpers = require('../helpers'); 
var _tokens = require('./tokens');

// Container for shooping cart submodels
var _cart = {};

/* Cart - post 
 * required data: 
	headers: email, token
	payload: cartItems (instatnce of array containing productId, quantity)
   optional data: none
 */ 
_cart.post = function(data, callback){
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

	if (email && tokenId) {
		// verify token
		_tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
			if (tokenIsValid) {
				// vaidate cartItems
				var cartItems = typeof(data.payload.cartItems) == 'object'
					&& data.payload.cartItems instanceof Array
					&& data.payload.cartItems.length > 0
					? data.payload.cartItems
					: false

				if (cartItems) {
					// Read the menu and save it to menuData
					_data.read('menus', 'menu', function(err, menuData){
						if (!err || menuData) {
							helpers.verifyCartItems(cartItems, menuData, function(cartItemsAreValid, errMsg){
								if (cartItemsAreValid) {
									// object to write on file
									var cartData = {'cartItems' : cartItems};
									
									_data.create('carts', email, cartData, true, function(err){
										if (!err) {
											callback(200);
										} else {
											callback(500, {'Error' : 'Could write to file'});
										}
									});
								} else {
									callback(400, errMsg);
								}
							});
						} else {
							callback(500, {'Error' : 'Could not read menu from file'});
							return;
						} 
					});
				} else {
					callback(403, {'Error' : 'Missing required fields'});
				}
			} else {
				callback(400, msg);
			}
		});
	} else {
		callback(403, {'Error' : 'Missing required field(s) in header'});
	}
};

/* cart - get
 * required data: 
 *	headers: email, token
 * optional data: none
 */
_cart.get = function(data, callback){
	// Validate required data
	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.queryStringObject.email) == 'string'
		&& data.queryStringObject.email.trim().length > 0
		&& emailRegEx.test(data.queryStringObject.email.trim())
		? data.queryStringObject.email.trim()
		: false;

	var tokenId = 
		typeof(data.headers.token) == 'string'
		&& data.headers.token.length == 20
		? data.headers.token
		: false;

	if (email && tokenId) {
		// verify token
		_tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
			if (tokenIsValid) {
				// Read cart
				_data.read('carts', email, function(err, cartData){
					// @TODO update cartData with price

					if (!err && cartData) {
						callback(200, cartData);
					} else {
						callback(500, {'Error' : 'Could not read cart from file'});
					}
				});
			} else {
				callback(400, msg);
			}
		});
	} else {
		callback(403, {'Error' : 'Missing required field(s) in header'});
	}
};

/* cart - delete
 * Required data : email(as payload)
 * optional data : none
 */
_cart.delete = function(data, callback){
	// Validate required data
	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.payload.email) == 'string'
		&& data.payload.email.length > 0
		&& emailRegEx.test(data.payload.email)
		? data.payload.email
		: false;

	var tokenId = 
		typeof(data.headers.token) == 'string'
		&& data.headers.token.length == 20
		? data.headers.token
		: false;

	if (email && tokenId) {
		// verify token
		_tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
			if (tokenIsValid) {
				// Check the existance of the cart
				_data.read('carts', email, function(err, cartData){
					if (!err && cartData) {
						_data.delete('carts', email, function(err){
							if (!err) {
								callback(200);
							} else {
								callback(500, {'Error' : 'Could not delete the cart'});
							}
						});
					} else {
						callback(400, {'Error' : 'There is no cart for the user'})
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

// Exports model
module.exports = _cart;
