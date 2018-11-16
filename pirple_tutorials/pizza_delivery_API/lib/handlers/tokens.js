/* 
 * token handlers
 */

// Dependencies
var _data = require('../data');
var helpers = require('../helpers');


// Token submethod
_tokens = {};

/*
 * Token - POST
 * Required data: email, password
 * optional data: none
 */
_tokens.post = function(data, callback){
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
_tokens.get = function(data, callback){
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
_tokens.put = function(data, callback){
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
_tokens.delete = function(data, callback){
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
_tokens.verifyToken = function(tokenId, email, callback) {
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

;

// Exports model
module.exports = _tokens;
