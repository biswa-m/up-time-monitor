/* 
 * Request handlers
 */

// Dependencies
var _data = require('../data');
var helpers = require('../helpers');
var _tokens = require('./tokens');

// Container for users submethods
_users = {};

/* User - POST 
 * Required data: firstName, lastName, email, address, password, tosAgreement
 * Otional data: None
 */
_users.post = function(data, callback){
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

_users.get = function(data, callback){
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
		_tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
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
_users.put = function(data, callback){
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

			// Verify tokenId is belongs to the user and is not expired
			_tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
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

/* User - DELETE 
 * Required data: email
 * Otional data: none
 */
_users.delete = function(data, callback){
	// Validate data required data
	var emailRegEx = /^[^\.\s]?(".*)?[^\s@]+(.*")?[^\.]?@[^-][^\s@]+\.[^\s@]/g;
	var email 
		= typeof(data.payload.email) == 'string'
		&& data.payload.email.length > 0
		&& emailRegEx.test(data.payload.email)
		? data.payload.email
		: false;

	if (email){
		// Validate token id
		var tokenId = 
			typeof(data.headers.token) == 'string'
			&& data.headers.token.length == 20
			? data.headers.token
			: false;

		// Verify tokenId is belongs to the user and is not expired
		_tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
			if (tokenIsValid) {
				// Look up the user
				_data.read('users', email, function(err, userData){
					if (!err && userData) {
						// Store the new update
						_data.delete('users', email, function(err){
							if (!err) {
								// Check if the user has a cart
								_data.read('carts', email, function(err){
									if (!err) {
										// Delete user cart
										_data.delete('carts', email, function(err){
											if (!err) {
												callback(200);
											} else {
												callback(500, {'Error' : 'The user\'s cart could not be deleted'});
											}
										});
									} else {
										callback(200);
									}
								});

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
		callback(403, {'Error' : 'Missing valid email address'});
	}
};

// Exports model
module.exports = _users;
