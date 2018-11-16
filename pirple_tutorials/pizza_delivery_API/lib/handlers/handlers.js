/* 
 * Request handlers
 */

// Dependencies
var _data = require('../data');
var helpers = require('../helpers');
var _carts = require('./carts');
var _tokens = require('./tokens');
var _users = require('./users');
var _menu = require('./menu');

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
		_users[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Token
handlers.token = function(data, callback) {
	if (['get', 'post', 'put', 'delete'].indexOf(data.method) > -1) {
		_tokens[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Menu Item 
handlers.menu = function(data, callback) {
	if (['get'].indexOf(data.method) > -1) {
		_menu[data.method](data, callback);
	} else {
		callback(405);
	}	
};

// Handler for shopping cart
handlers.cart = function(data, callback){
	if (['get', 'post', 'delete'].indexOf(data.method) > -1){
		_carts[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Exports model
module.exports = handlers;
