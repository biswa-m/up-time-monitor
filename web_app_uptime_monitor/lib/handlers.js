/*
 * Request handlers
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');
var _url = require('url');
var dns = require('dns');

// Define the handlers
var handlers = {};

/*
 * HTML Handlers
 */

// Index handler
handlers.index = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Uptime Monitoring Sample',
			'head.description': 'We offer free uptime monitoring, when site is down we send a text to let you know',
			'body.class': 'index'
		}
		// Read in a template as a string
		helpers.getTemplate('index', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// create account
handlers.accountCreate = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Create an Account',
			'head.description': 'Sign up is easy and only takes a few seconds',
			'body.class': 'accountCreate'
		}
		// Read in a template as a string
		helpers.getTemplate('accountCreate', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Create New Session
handlers.sessionCreate = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Login to your Account',
			'head.description': 'Please enter your phone number and password to access your account',
			'body.class': 'sessionCreate'
		}
		// Read in a template as a string
		helpers.getTemplate('sessionCreate', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Session has been deleted
handlers.sessionDeleted = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Logged Out',
			'head.description': 'You have been logged out of your account',
			'body.class': 'sessionDeleted'
		}
		// Read in a template as a string
		helpers.getTemplate('sessionDeleted', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Edit your account
handlers.accountEdit = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Account Settings',
			'body.class': 'accountEdit'
		}
		// Read in a template as a string
		helpers.getTemplate('accountEdit', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Account has been deleted
handlers.accountDeleted = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Account Deleted',
			'head.description' : 'Your account has been deleted',
			'body.class' : 'accountDeleted'
		}
		// Read in a template as a string
		helpers.getTemplate('accountDeleted', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Create a new check
handlers.checksCreate = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Create a New Check',
			'body.class' : 'checksCreate'
		}
		// Read in a template as a string
			helpers.getTemplate('checksCreate', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Dashboard (view all checks)
handlers.checksList = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Dashboard',
			'body.class' : 'checksList'
		};
		// Read in a template as a string
			helpers.getTemplate('checksList', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Edit a check
handlers.checksEdit = function(data, callback){
	// Reject any request that isn't a GET
	if (data.method == 'get') {
		// Prepare data for interpolation
		var templateData = {
			'head.title' : 'Check Details',
			'body.class' : 'checksEdit'
		};
		// Read in a template as a string
			helpers.getTemplate('checksEdit', templateData, function(err, str){
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, function(err, str) {
					if (!err && str) {
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	} 
};

// Favicon
handlers.favicon = function(data, callback) {
	// Reject any method that isn't a get
	if (data.method == 'get') {
		// Read in the favicon's data
		helpers.getStaticAsset('favicon.ico', function(err, data) {
			if (!err && data) {
				// Callback the data
				callback(200, data, 'favicon');
			} else {
				callback(500);
			}
		});
	} else {
		callback(405);
	}
};

// Public assets
handlers.public = function(data, callback) {
	// Reject any method that isn't a get
	if (data.method == 'get') {
		// Get the filename being requested
		var trimedAssetName = data.trimmedPath.replace('public/', '').trim();
		if (trimedAssetName.length > 0) {
			// Read in the asset's data
			helpers.getStaticAsset(trimedAssetName, function(err, data) {
				if (!err && data) {
					// Determine the content type (default plain text)
					var contentType = 'plain';

					if (trimedAssetName.indexOf('.css') > -1) {
						contentType = 'css';
					}
					if (trimedAssetName.indexOf('.png') > -1) {
						contentType = 'png';
					}
					if (trimedAssetName.indexOf('.jpg') > -1) {
						contentType = 'jpg';
					}
					if (trimedAssetName.indexOf('.ico') > -1) {
						contentType = 'favicon';
					}

					// callback the data
					callback(200, data, contentType);
				} else {
					callback(404);
				}
			})
		} else {
			callback(404);
		}
	} else {
		callback(405);
	}
};


/*
 * JSON API Handlers
 */

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
				_data.read('users', phone, function(err, userData){
					if (!err && userData) {
						_data.delete('users', phone, function(err){
							if (!err) { 
								// Delete each of the checks associated with the user
								
								var userChecks = typeof(userData.checks) == "object"
									&& userData.checks instanceof Array
									? userData.checks
									: [];
								var checksToDelete = userChecks.length;
								if (checksToDelete > 0) {
									var checksDeleted = 0;
									var deletionErrors = false;
									// Loop through the checks
									userChecks.forEach(function(checkId){
										_data.delete('checks', checkId, function(err){
											if (err) {
												deletionErrors = true;
											} 
											checksDeleted++;
											if (checksDeleted == checksToDelete) {
												if (!deletionErrors) {
													callback(200);
												} else {
													callback(500, {'Error' : 'All checks of the user may not have been deleted'});
												}
											}
										});		
									});
								} else {
									callback(200);
								}
							} else {
								callback(500, {'Error' : 'Could not delete the specified user'});
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

// Checks
handlers.checks = function(data, callback){
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._checks[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for all the checks methods
handlers._checks = {};

/* Checks - post
 * Required data: protocol, url, method, successCodes, timeoutSeconds
 * Optional data: none
 */
handlers._checks.post = function(data, callback){
	// Validate inputs
	var protocol 
		= typeof(data.payload.protocol) == 'string'
		&& ['https', 'http'].indexOf(data.payload.protocol) > -1
		? data.payload.protocol
		: false;
	var url
		= typeof(data.payload.url) == 'string'
		&& data.payload.url.trim().length > 0
		? data.payload.url.trim()
		: false;
	var method 
		= typeof(data.payload.method) == 'string'
		&& ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1
		? data.payload.method
		: false;
	var successCodes
		= typeof(data.payload.successCodes) == 'object'
		&& data.payload.successCodes instanceof Array 
		&& data.payload.successCodes.length > 0
		? data.payload.successCodes
		: false;
	var timeoutSeconds
		= typeof(data.payload.timeoutSeconds) == 'number'
		&& data.payload.timeoutSeconds % 1 === 0
		&& data.payload.timeoutSeconds >= 1
		&& data.payload.timeoutSeconds <= 5
		? data.payload.timeoutSeconds
		: false;

	if(protocol && url && method && successCodes && timeoutSeconds) {
		// Get the token from the headers
		var token = typeof(data.headers.token) == 'string' 
			? data.headers.token
			: false;
		//Lookup the user by reading the token
		_data.read('tokens', token, function(err, tokenData){
			if(!err && tokenData) {
				var userPhone = tokenData.phone;
				// Lookup the user
				_data.read('users', userPhone, function(err, userData){
					if (!err && userData) {
						var userChecks = typeof(userData.checks) == "object"
							&& userData.checks instanceof Array
							? userData.checks
							: [];
						// Verify there are less than maximum no of checks
						if (userChecks.length < config.maxChecks) {
							// Verify that the URL given has DNS entries
							var parsedUrl = _url.parse(protocol+'://'+url, true);
							var hostName = typeof(parsedUrl.hostname) == 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
							if (!hostName) return callback(400, {'Error': 'Missing valid required field'});
							
							dns.resolve(hostName, function(err, records) {
								if (!err && records) {
									// Create a random id for the check
									var checkId = helpers.createRandomString(20);
									
									// Create the check object, 
									// and include the user's phone 
									var checkObject = {
										'id' : checkId,
										'userPhone' : userPhone,
										'protocol' : protocol,
										'url' : url,
										'method' : method,
										'successCodes' : successCodes,
										'timeoutSeconds' : timeoutSeconds
									};

									// Save the object
									_data.create('checks', checkId, checkObject, function(err){
										if (!err) {
											// Add the check id to userObject
											userData.checks = userChecks;
											userData.checks.push(checkId);

											// Save the new user data
											_data.update('users', userPhone, userData, function(err) {
												if (!err) {
													// Return the data about chekObject
													callback(200, checkObject);
												} else {
													callback(500, {'Error' : 'Could not update the user with new checks'});
												}		
											});
										} else {
											callback(500, {'Error' : 'Could not create the new check'});
										}
									});
								} else {
									callback(400, {'Error': 'The hostname of the URL did not resolve andy DNS entries'});
								}
							});
						} else {
							callback(400, {'Error' : 'The user already has'
							+' the maximum number of checks ('
							+config.maxChecks+')'});
						}
					} else {
						callback(403);
					}		
				});
			} else {
				callback(403);
			}
		});

	} else {
		callback(400, {'Error' : 'Missing valid required input(s)'});
	} 

};

/* Checks - get
 * Required data : id
 * Optional data : none
 */
handlers._checks.get = function(data, callback){
	// Validation of id.
	var id
		= typeof(data.queryStringObject.id) == 'string'
		&& data.queryStringObject.id.trim().length == 20
		? data.queryStringObject.id.trim()
		: false;
	if (id) {
		// Lookup the check
		_data.read('checks', id, function(err, checkData) {
			if (!err) {
				// Get the token for the headers
				var token = typeof(data.headers.token) == 'string'
					? data.headers.token : false;
				// Verify given token is valid and belong to the user who created the checks
				handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
					if (tokenIsValid) {
						// Return the check data
						callback(200, checkData);
					} else {
						callback(403, {'Error' : 'Missing valid token in header'});
					}
				});

			}else {
				callback(404);
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}
};

/* Checks - put
 * Required data : id
 * Optional data : protocol, url, method, successCodes, timeoutSeconds (one must be set)
 */
handlers._checks.put = function(data, callback){
	// Check for the required field
	var id
		= typeof(data.payload.id) == 'string'
		&& data.payload.id.length == 20
		? data.payload.id
		: false;
	// Check for optional fields
	var protocol 
		= typeof(data.payload.protocol) == 'string'
		&& ['https', 'http'].indexOf(data.payload.protocol) > -1
		? data.payload.protocol
		: false;
	var url
		= typeof(data.payload.url) == 'string'
		&& data.payload.url.trim().length > 0
		? data.payload.url.trim()
		: false;
	var method 
		= typeof(data.payload.method) == 'string'
		&& ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1
		? data.payload.method
		: false;
	var successCodes
		= typeof(data.payload.successCodes) == 'object'
		&& data.payload.successCodes instanceof Array 
		&& data.payload.successCodes.length > 0
		? data.payload.successCodes
		: false;
	var timeoutSeconds
		= typeof(data.payload.timeoutSeconds) == 'number'
		&& data.payload.timeoutSeconds % 1 === 0
		&& data.payload.timeoutSeconds >= 1
		&& data.payload.timeoutSeconds <= 5
		? data.payload.timeoutSeconds
		: false;
	
	// Error if the id is invalid
	if (id) {
		// Check there is atleast one optional fields
		if (protocol || url || method || successCodes || timeoutSeconds) {
			_data.read('checks', id, function(err, checkData){
				if (!err && checkData) {
					// Get the token for the headers
					var token = typeof(data.headers.token) == 'string'
						? data.headers.token : false;
					// Verify given token is valid and belong to the user who created the checks
					handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
						if (tokenIsValid) {
							// Update the check where necessary
							if (protocol) {
								checkData.protocol = protocol;
							}
							if (url) {
								checkData.url = url;
							}
							if (method) {
								checkData.method = method;
							}
							if (successCodes) {
								checkData.successCodes = successCodes;
							}
							if (timeoutSeconds) {
								checkData.timeoutSeconds = timeoutSeconds;
							}

							// Store the new updates
							_data.update('checks', id, checkData, function(err){
								if (!err) {
									callback(200);
								} else {
									callback(500, {'Error' : 'Could not update the check'});
								}
							});
						} else {
							callback(403, {'Error' : 'Missing valid token in header'});
						}
					});


				} else {
					callback(400, {'Error' : 'Check id do not exist'});
				}
			});
		} else {
			callback(400, {'Error' : 'Missing required field'});
		}

	} else {
		callback(400, {'Error' : 'Missing required field(s)'});
	}	
};

/* Checks - delete
 * Required data : id
 * Optional data : none
 */
handlers._checks.delete = function(data, callback){
	// Check the phone number is valid
	var id 
		= typeof(data.queryStringObject.id) == 'string'
		&& data.queryStringObject.id.trim().length == 20
		? data.queryStringObject.id.trim()
		: false;
	if (id) {
		// Lookup the check
		_data.read('checks', id, function(err, checkData){
			if (!err && checkData) {
				// Get the token for the headers
				var token = typeof(data.headers.token) == 'string'
					? data.headers.token : false;
				// Verify given token is valid for the phone no
				handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
					if (tokenIsValid) {
						// Delete the check data
						_data.delete('checks', id , function(err) {
							if (!err) {
								console.log('Deleted '+id+'.json');
								// Lookup the user
								_data.read('users', checkData.userPhone, function(err, userData){
									if (!err && userData) {
										var userChecks = typeof(userData.checks) == "object"
											&& userData.checks instanceof Array
											? userData.checks
											: [];

										// Delete check from their list of checks
											var checkPosition = userChecks.indexOf(id);
											if (checkPosition > -1) {
												userChecks.splice(checkPosition, 1);
												// Re-save user's data
												_data.update('users', checkData.userPhone, userData, function(err) {
													if (!err) {
														callback(200);
													} else {
														callback(500, {'Error' : 'While deleting check id from user data: '+err});
													}				
												});
											} else {
												callback(500, {'Error' : 'Could not find the check in user object'});
											}
									} else {
										callback(500, {'Error' : 'Could not find the user'
										+'who created the check, '
										+'so could not remove from the check list of userObject'});	
									}
								});
								
							} else {
								callback(500, {'Error' : 'Could not delete the check data'});
							}	
						});
					} else {
						callback(403, {'Error' : 'Missing valid token in header'});
					}
				});
			} else {
				callback(400, {'Error' : 'The specified check id does not exist'});			
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required field'});
	}
};

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
