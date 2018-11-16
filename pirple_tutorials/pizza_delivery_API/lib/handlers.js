/* 
 * Request handlers
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Instantiate the container
var handlers = {};

// Default handlers
handlers.default = function(data, callback){
	callback(404, { 'Error' : 'requested path not found'});
};

// ping
handlers.ping = function(data, callback){
	callback(200, {'Success': 'Inside ping handler'});
};

// User
handlers.user = function(data, callback) {
	if (['get', 'post', 'put', 'delete'].indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Container for users submethods
handlers._users = {};

/* User - POST 
 * Required data: firstName, lastName, email, address, password, tosAgreement
 * Otional data: None
 */
handlers._users.post = function(data, callback){
	// Validate data

	var firstName 
		= typeof(data.payload.firstName) == 'string'
		&& data.payload.firstName.length > 0
		? data.payload.firstName
		: false;

	var lastName 
		= typeof(data.payload.lastName) == 'string'
		&& data.payload.lastName.length > 0
		? data.payload.lastName
		: false;

	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.payload.email) == 'string'
		&& data.payload.email.length > 0
		&& emailRegEx.test(data.payload.email)
		? data.payload.email
		: false;
	
	var address 
		= typeof(data.payload.address) == 'string'
		&& data.payload.address.length > 0
		? data.payload.address
		: false;

	var password 
		= typeof(data.payload.password) == 'string'
		&& data.payload.password.length > 0
		? data.payload.password
		: false;

	var tosAgreement 
		= typeof(data.payload.tosAgreement) == 'boolean'
		? data.payload.tosAgreement
		: false;

	if (firstName && lastName && email && address && password && tosAgreement){
		// Make sure that the user doesnot already exist
		_data.read('users', email, function(err, data){
			if (err){
				// Encrypt password
				var hashedPassword = helpers.hash(password); 

				if (hashedPassword){
					// Create object to write on file
					var userData = {
						'firstName' : firstName,
						'lastName' : lastName,
						'email' : email,
						'address' : address,
						'hashedPassword' : hashedPassword,
						'tosAgreement' : tosAgreement
					};
				
					// Store the user
					_data.create('users', email, userData, false, function(err){
						if (!err) {
							callback(200);
						} else {
							callback(500, {'Error' :err});
						}
					});
				} else {
					callback(500, {'Error' : 'Could not hash the user\'s password'});
				}
			} else {
				callback(400, {'Error' : 'A user with that email id already exist'});
			}
		});
	} else {
		callback(403, {'Error' : 'missing valid required field'});
	}
};

/* User - GET
 * Required data: email, tokenId 
 * Optional data: none
 */

handlers._users.get = function(data, callback){
	// validate email id
	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.queryStringObject.email) == 'string'
		&& data.queryStringObject.email.trim().length > 0
		&& emailRegEx.test(data.queryStringObject.email)
		? data.queryStringObject.email.trim()
		: false;

	if (email) {
		var tokenId = 
			typeof(data.headers.token) == 'string'
			&& data.headers.token.length == 20
			? data.headers.token
			: false;

		// Verify tokenId is belongs to the user and is not expired
		handlers._tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
			if (tokenIsValid) {
				// Lookup the user
				_data.read('users', email, function(err, userData){
					if (!err && userData) {
						// Hashed password should not be shown
						delete userData.hashedPassword;
						callback(200, userData);
					} else {
						callback(404);
					}
				});

			} else {
				callback(403, msg);	
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}
};

/* User - PUT 
 * Required data: email
 * Otional data: firstName, lastName, email, password (atleast one must be specify)
 */
handlers._users.put = function(data, callback){
	// Validate data required data
	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.payload.email) == 'string'
		&& data.payload.email.length > 0
		&& emailRegEx.test(data.payload.email)
		? data.payload.email
		: false;
	
	// Validate optional data
	var firstName 
		= typeof(data.payload.firstName) == 'string'
		&& data.payload.firstName.length > 0
		? data.payload.firstName
		: false;

	var lastName 
		= typeof(data.payload.lastName) == 'string'
		&& data.payload.lastName.length > 0
		? data.payload.lastName
		: false;

	var address 
		= typeof(data.payload.address) == 'string'
		&& data.payload.address.length > 0
		? data.payload.address
		: false;

	var password 
		= typeof(data.payload.password) == 'string'
		&& data.payload.password.length > 0
		? data.payload.password
		: false;

	if (email){
		if (firstName || lastName || address || password) {
			// Validate token id
			var tokenId = 
				typeof(data.headers.token) == 'string'
				&& data.headers.token.length == 20
				? data.headers.token
				: false;
			console.log(tokenId);

			// Verify tokenId is belongs to the user and is not expired
			handlers._tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
				if (tokenIsValid) {
					// Look up the user
					_data.read('users', email, function(err, userData){
						if (!err && userData) {
							// update the userData object	
							if (firstName) {
								userData.firstName = firstName;
							}
							if (lastName) {
								userData.lastName = lastName;
							}
							if (address) {
								userData.address = address;
							}
							if (password) {
								userData.hashedPassword = helpers.hash(password);
							}

							// Store the new update
							_data.update('users', email, userData, function(err){
								if (!err) {
									callback(200);
								} else {
									callback(500, {'Error' : 'Could not update the user'});	
								}
							});
						} else {
							callback(400, {'Error' : 'The specified user does not exist'});
						}
					});	
				} else {
					callback(400, msg);
				}
			});
		} else {
			callback(403, {'Error' : 'Missing fields to update'});
		}
	} else {
		callback(403, {'Error' : 'Missing valid email address'});
	}
};

// User - DELETE
handlers._users.delete = function(data, callback){
	// @TODO delete user file and all the associate data
	callback(200, {'Success' : 'Hi from handlers function'});
};


// Token
handlers.token = function(data, callback) {
	if (['get', 'post', 'put', 'delete'].indexOf(data.method) > -1) {
		handlers._tokens[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Token submethod
handlers._tokens = {};

/*
 * Token - POST
 * Required data: email, password
 * optional data: none
 */
handlers._tokens.post = function(data, callback){
	// Validate data
	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.payload.email) == 'string'
		&& data.payload.email.length > 0
		&& emailRegEx.test(data.payload.email)
		? data.payload.email
		: false;
	
		var password 
		= typeof(data.payload.password) == 'string'
		&& data.payload.password.length > 0
		? data.payload.password
		: false;

	if (email && password) {
		// Look up the user
		_data.read('users', email, function(err, userData){
			if (!err && userData) {
				// Match the password
				if (userData.hashedPassword == helpers.hash(password)) {
					// Create a new token with expiration time of 1 hour
					var tokenId = helpers.createRandomString(20); // Generate random string of length 20
					var expire = Date.now() + 1000 * 60 * 60;

					// Object to write on file and to send as payload
					var tokenObject = {
						'email' : email,
						'tokenId' : tokenId,
						'expire' : expire
					};

					// Write tokenObject to a new file
					_data.create('tokens', tokenId, tokenObject, false, function(err){
						if (!err) {
							callback(200, tokenObject);
						} else {
							callback(500, {'Error' : 'Error writting data to file'});
						}
					});
				} else {
					callback(400, {'Error' : 'Wrong password!'});
				}
			} else {
				callback(400, {'Error' : 'Could not find the specific user'});
			}	
		});
	} else {
		callback(403, {'Error' : 'Missing required data'});
	}
};

/* 
 * Token - get
 * required data: tokenId
 * optional data: none
 */
handlers._tokens.get = function(data, callback){
	// validate data
	var tokenId = 
		typeof(data.queryStringObject.tokenId) == 'string'
		&& data.queryStringObject.tokenId.trim().length == 20
		? data.queryStringObject.tokenId.trim()
		: false;
	
	if (tokenId) {
		// Lookup the token
		_data.read('tokens', tokenId, function(err, tokenData){
			if (!err && tokenData) {
				callback(200, tokenData);
			} else {
				callback(400, {'Error' : 'Token does not exist'});
			}
		});

	} else {
		callback(403, {'Error' : 'Missing token id in query string'});
	}
};

/* 
 * Token - put
 * To extend the expiration time by a hour
 * required data: tokenId, extend
 * optional - data
 */
handlers._tokens.put = function(data, callback){
	// validate data
	var tokenId = 
		typeof(data.payload.tokenId) == 'string'
		&& data.payload.tokenId.length == 20
		? data.payload.tokenId
		: false;

	var extend =  
		typeof(data.payload.extend) == 'boolean'
		&& data.payload.extend == true
		? true
		: false;
		
	if (tokenId && extend) {
		// Lookup the token
		_data.read('tokens', tokenId, function(err, tokenData){
			if (!err && tokenData) {
				// Extend the expiration time on tokenData object
				tokenData.expire = Date.now() + 1000 * 60 * 60;

				// Update file
				_data.update('tokens', tokenId, tokenData, function(err){
					if (!err) {
						callback(200);	
					} else {
						callback(500, {'Error' : 'Error updating token data'});
					}
				});
			} else {
				callback(400, {'Error' : 'Token does not exist'});
			}
		});
	} else {
		callback(403, {'Error' : 'Missing required data'});
	}
};

/*
 * Token - delete
 * required data: tokenId
 */
handlers._tokens.delete = function(data, callback){
	// validate data 
	var tokenId = 
		typeof(data.payload.tokenId) == 'string'
		&& data.payload.tokenId.length == 20
		? data.payload.tokenId
		: false;
	
	if (tokenId) {
		// Look up the token
		_data.read('tokens', tokenId, function(err, tokenData){
			if (!err) {
				// Delete token
				_data.delete('tokens', tokenId, function(err){
					if (!err) {
						callback(200);
					} else {
						callback(500, {'Error' : 'Could not delete token'});
					}
				});
			} else {
				callback(400, {'Error' : 'Token does not exist'});
			}
		});
	} else {
		callback(403, {'Error' : 'Missing valid tokenId'});
		console.log(data.payload.tokenId);
	}
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(tokenId, email, callback) {
	_data.read('tokens', tokenId, function(err,tokenData){
		if (!err && tokenData) {
			// match the user and check token expiration
			if (tokenData.email == email && tokenData.expire > Date.now()) {
				callback(true);
			} else {
				callback(false, {'Error' : 'Mismatch token or token expired'});
			}
		} else {
			callback(false, {'Error' : 'Token does not exist'});
		}	
	});
}


// Menu Item 
handlers.menu = function(data, callback) {
	if (['get'].indexOf(data.method) > -1) {
		handlers._menu[data.method](data, callback);
	} else {
		callback(405);
	}	
};


// Container for menu submethods
handlers._menu = {};

/*
 * Menu - get
 * required data: token, email 
 * optional data: none
 */
handlers._menu.get = function(data, callback){

	// Validate required data
	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.headers.email) == 'string'
		&& data.headers.email.length > 0
		&& emailRegEx.test(data.headers.email)
		? data.headers.email
		: false;

	if (email) {
		var tokenId = 
			typeof(data.headers.token) == 'string'
			&& data.headers.token.length == 20
			? data.headers.token
			: false;

		// verify token
		handlers._tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
			if (tokenIsValid) {
				// Read menuData object
				_data.read('menus', 'menu', function(err, menuData){
					if (!err && menuData) {
						callback(200, menuData); 
					} else {
						callback(500, {'Error' : 'Could not read menu from file'});
					}
				});
			} else {
				callback(400, msg);
			}
		});
	} else {
		callback(403, {'Error' : 'Missing required field'});
	}
};


// Handler for shopping cart
handlers.cart = function(data, callback){
	if (['get', 'post', 'delete'].indexOf(data.method) > -1){
		handlers._cart[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for shooping cart submodels
handlers._cart = {};

/* Cart - post 
 * required data: 
	headers: email, token
	payload: cartItems (instatnce of array containing productId, quantity)
   optional data: none
 */ 
handlers._cart.post = function(data, callback){
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
		handlers._tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
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
							handlers.verifyCartItems(cartItems, menuData, function(cartItemsAreValid, errMsg){
								if (cartItemsAreValid) {
									_data.create('carts', email, cartItems, true, function(err){
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
handlers._cart.get = function(data, callback){
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
		handlers._tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
			if (tokenIsValid) {
				// Read cart
				_data.read('carts', email, function(err, cartData){
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
handlers._cart.delete = function(data, callback){
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
		handlers._tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
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

// Validate cart items
handlers.verifyCartItems = function(cartItems, menuData, callback){
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

// Exports model
module.exports = handlers;
