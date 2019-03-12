/* 
 * Menu handlers
 */

// Dependencies
var _data = require('../data');
var _tokens = require('./tokens');

// Container for menu submethods
_menu = {};

/*
 * Menu - get
 * required data: token, email 
 * optional data: none
 */
_menu.get = function(data, callback){
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
		_tokens.verifyToken(tokenId, email, function(tokenIsValid, msg){
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

// Exports model
module.exports = _menu;
