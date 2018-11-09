/*
 * Request handlers
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users
handlers.users = function(data, callback){
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for users submethods
handlers._users = {};

// users submethods
// Required data: firstName, lastName, phone, password, tosAgreement
// optional data: none
handlers._users.post = function(data, callback){
	// check all required data are filled out
	var firstName = 
		typeof(data.payload.firstName) == 'string'
		&& data.payload.firstName.trim().length > 0
		? data.payload.firstName.trim()
		: false;
	var lastName = 
		typeof(data.payload.lastName) == 'string'
		&& data.payload.lastName.trim().length > 0
		? data.payload.lastName.trim()
		: false;
	var phone = 
		typeof(data.payload.phone) == 'string'
		&& data.payload.phone.trim().length == 10
		? data.payload.phone.trim()
		: false;
	var password = 
		typeof(data.payload.password) == 'string'
		&& data.payload.password.trim().length > 0
		? data.payload.password.trim()
		: false;
	var tosAgreement = 
		typeof(data.payload.tosAgreement) == 'boolean'
		&& data.payload.tosAgreement == true
		? true
		: false;

	if (firstName && lastName && phone && password && tosAgreement) {
		// Make sure that the user doesnot already exist
		_data.read('users', phone, function(err, data){
			if (err) {
				// Hash the password
				var hashedPassword = helpers.hash(password);

				if (hashedPassword) {
					// Create user object
					var userObject = {
						'firstName' : firstName,
						'lastName' : lastName,
						'phone' : phone,
						'hashedPassword' : hashedPassword,
						'tosAgreement' : true
					};

					// Store the user
					_data.create('users', phone, userObject, function(err){
						if (!err) {
							callback(200);
						} else {
							console.log(err);
							callback(500, {'Error' : 'Could not create the new user'});
						} 
					});
				} else {
					callback(500, {'Error' : 'Could not hash the user\'s password'});
				}
			
			} else {
				// User already exist
				callback(400, {'Error' : 'A user with that phone number already exists'});
			}
		});
	} else {
		callback(400, {'Error': 'Missing required fields'});
		console.log('missing required fields');
	}

};

// Users - get
/* Required data: phone
 * Optional data: none
 */
handlers._users.get = function(data, callback){
	// Validation of phone no.
	var phone
		= typeof(data.queryStringObject.phone) == 'string'
		&& data.queryStringObject.phone.trim().length == 10
		? data.queryStringObject.phone.trim()
		: false;
	if (phone) {
		// Get the token for the headers
		var token = typeof(data.headers.token) == 'string'
			? data.headers.token : false;
		// Verify given token is valid for the phone no
		handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
			if (tokenIsValid) {
				// Lookup the user
				_data.read('users', phone, function(err, data){
					if (!err && data) {
						// Remove the hashed password from the user object 
						// before returning it to the requestor
						delete data.hashedPassword;
						callback(200, data);
					} else {
						callback(404);	
					}
				});

			} else {
				callback(403, {'Error' : 'Missing valid token in header'});
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}
};

// Users - put
/* Required data: phone
 * Optional data: firstName, lastName, password (atleast one must be specify)
 */
handlers._users.put = function(data, callback){
	// Check for the required field
	var phone
		= typeof(data.payload.phone) == 'string'
		&& data.payload.phone.trim().length == 10
		? data.payload.phone.trim()
		: false;
	// Check for the optional field
	var firstName = 
		typeof(data.payload.firstName) == 'string'
		&& data.payload.firstName.trim().length > 0
		? data.payload.firstName.trim()
		: false;
	var lastName = 
		typeof(data.payload.lastName) == 'string'
		&& data.payload.lastName.trim().length > 0
		? data.payload.lastName.trim()
		: false;
	var password = 
		typeof(data.payload.password) == 'string'
		&& data.payload.password.trim().length > 0
		? data.payload.password.trim()
		: false;
	
	// Error if the phone is invalid
	if (phone) {
		if (firstName || lastName || password) {
			// Get the token for the headers
			var token = typeof(data.headers.token) == 'string'
				? data.headers.token : false;
			// Verify given token is valid for the phone no
			handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
				if (tokenIsValid) {
					// Lookup the user
					_data.read('users', phone, function(err, userData){
						if (!err && userData) {
							// Updatr the fields necessary
							if (firstName) {
								userData.firstName = firstName;
							}
							if (lastName) {
								userData.lastName = lastName;
							}
							if (password) {
								userData.hashedPassword = helpers.hash(password);
							}

							// Store the new update
							_data.update('users', phone, userData, function(err) {
								if (!err) {
									callback(200);	
								} else {
									console.log(err);
									callback(500, {'Error' : 'Could not update the user'});
								}
							})
						} else {
							callback(400, {'Error' : 'The specified user does not exist'});
						}
					});
				} else {
					callback(403, {'Error' : 'Missing valid token in header'});
				}
			});
		} else {
			callback(400, {'Error' : 'Missing fields to update'});	
		}
	} else {
		callback(404, {'Error' : 'Missing required field'});
	}

};

/* Users - delete
 * Required field : phone
 * @TODO only let an authenticated user delete their data
 * @TODO Cleanup any other files associated with the user
 */
handlers._users.delete = function(data, callback){
	// Check the phone number is valid
	var phone
		= typeof(data.queryStringObject.phone) == 'string'
		&& data.queryStringObject.phone.trim().length == 10
		? data.queryStringObject.phone.trim()
		: false;
	if (phone) {
		// Get the token for the headers
		var token = typeof(data.headers.token) == 'string'
			? data.headers.token : false;
		// Verify given token is valid for the phone no
		handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
			if (tokenIsValid) {
				// Lookup the user
				_data.read('users', phone, function(err, data){
					if (!err && data) {
						_data.delete('users', phone, function(err){
							if (!err) { 
								callback(200);
							} else {
								callback(400, {'Error' : 'Could not delete the specified user'});
							}
						});
					} else {
						callback(400, {'Error' : 'Could not find the specified user'});	
					}
				});
			} else {
				callback(403, {'Error' : 'Missing valid token in header'});
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}


};

// Tokens 
handlers.tokens = function(data, callback){
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._tokens[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Tokens submethod
handlers._tokens = {};

// Tokens post
/* Require data: phone, password
 * Optional data: none
 */ 
handlers._tokens.post = function(data, callback){
	// Check for the required field
	var phone
		= typeof(data.payload.phone) == 'string'
		&& data.payload.phone.trim().length == 10
		? data.payload.phone.trim()
		: false;
	var password = 
		typeof(data.payload.password) == 'string'
		&& data.payload.password.trim().length > 0
		? data.payload.password.trim()
		: false;
	if (phone && password) {
		// Look for the user who matches the phone number
		_data.read('users', phone, function(err, userData){
			if (!err && userData) {
				// Hash the sent passoword and compare
				var hashedPassword = helpers.hash(password);
				if (hashedPassword == userData.hashedPassword) {
					// Create a new token with an expiration time 1 hour
					var tokenId = helpers.createRandomString(20);
					var expires = Date.now() + 1000 * 60 * 60;
					var tokenObject = {
						'phone' : phone,
						'id' : tokenId,
						'expires' : expires
					};

					// Store the token
					_data.create('tokens', tokenId, tokenObject, function(err){
						if (!err) {
							callback(200, tokenObject);
						} else {
							callback(500, {'Error' : 'Could not create the new token'});
						}
					});
				} else {
					callback(400, {'Error' : 'Password did not matched'});
				}
			} else {
				callback(400, {'Error' : 'Could not find the specific user'});
			}
		});
	
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}
	
};

// Tokens get
handlers._tokens.get = function(data, callback){
	var id
		= typeof(data.queryStringObject.id) == 'string'
		&& data.queryStringObject.id.trim().length == 20
		? data.queryStringObject.id.trim()
		: false;
	if (id) {
		// Lookup the user
		_data.read('tokens', id, function(err, tokenData){
			if (!err && data) {
				callback(200, tokenData);
			} else {
				callback(404);	
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}
	
};
// Tokens put
/* Required data : id, extend
 * Optional data : none
 */
handlers._tokens.put = function(data, callback){
	var id
		= typeof(data.payload.id) == 'string'
		&& data.payload.id.trim().length == 20
		? data.payload.id.trim()
		: false;
	var extend
		= typeof(data.payload.extend) == 'boolean'
		&& data.payload.extend == true
		? data.payload.extend
		: false;
	if (id && extend) {
		// Lookup the token
		_data.read('tokens', id, function(err, tokenData){
			if (!err && tokenData) {
				// Check token is currently active
				if (tokenData.expires > Date.now()) {
					// set the expiration an hour from now
					tokenData.expires =  Date.now() + 1000 * 60 * 60;
					// Store the new updates
					_data.update('tokens', id, tokenData, function(err) {
						if (!err) {
							callback(200);
						} else {
							callback(500, {'Error' : 'Could not update the token'});
						}
					});
				} else {
					callback(400, {'Error' : 'The token is already expired'});
				}
			} else {
				callback(400, {'Error' : 'Specified token does not exist'});
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field(s)'});
	}

};

/* Tokens delete 
 * Required data: id
 * Optional data: none
 */
handlers._tokens.delete = function(data, callback){
	// Check the id is valid
	var id
		= typeof(data.queryStringObject.id) == 'string'
		&& data.queryStringObject.id.trim().length == 20
		? data.queryStringObject.id.trim()
		: false;
	if (id) {
		// Lookup the token
		_data.read('tokens', id, function(err, data){
			if (!err && data) {
				_data.delete('tokens', id, function(err){
					if (!err) { 
						callback(200);
					} else {
						callback(400, {'Error' : 'Could not delete the specified token'});
					}
				});
			} else {
				callback(400, {'Error' : 'Could not find the specified token'});	
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback) {
	_data.read('tokens', id, function(err, tokenData){
		if(!err && tokenData) {
			// check that the token is for the given user and has not expired
			if (tokenData.phone == phone && tokenData.expires > Date.now()) {
				callback(true);
			} else {
				callback(false);
			}
		} else {
			callback(false);
		}
	});
}

// Ping requests
handlers.ping = function(data, callback){
        callback(200);
};

//Not found handler
handlers.notFound = function(data, callback){
        callback(404);
};

// Export the module
module.exports = handlers;
