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
}

// Container for users submethods
handlers._users = {};

/* User - POST 
 * Required data: firstName, lastName, email, password, tosAgreement
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
	
	var password 
		= typeof(data.payload.password) == 'string'
		&& data.payload.password.length > 0
		? data.payload.password
		: false;

	var tosAgreement 
		= typeof(data.payload.tosAgreement) == 'boolean'
		? data.payload.tosAgreement
		: false;

	if (firstName && lastName && email && password && tosAgreement){
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
						'hashedPassword' : hashedPassword,
						'tosAgreement' : tosAgreement
					};
				
					// Store the user
					_data.create('users', email, userData, function(err){
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
 * Required data: email
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

	var password 
		= typeof(data.payload.password) == 'string'
		&& data.payload.password.length > 0
		? data.payload.password
		: false;

	if (email){
		if (firstName || lastName || password) {
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
			callback(403, {'Error' : 'Missing fields to update'});
		}
	} else {
		callback(403, {'Error' : 'Missing valid email address'});
	}
};

// User - DELETE
handlers._users.delete = function(data, callback){
	// @TODO implement file write
	// delete user file and all the associate data
	callback(200, {'Success' : 'Hi from handlers function'});
};


// Token
handlers.token = function(data, callback) {
	if (['get', 'post', 'put', 'delete'].indexOf(data.method) > -1) {
		handlers._tokens[data.method](data, callback);
	} else {
		callback(405);
	}	
}

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
					_data.create('tokens', tokenId, tokenObject, function(err){
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

// Exports model
module.exports = handlers;
