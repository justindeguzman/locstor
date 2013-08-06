/**
 * Locstor.js is a JavaScript helper library for HTML5 localStorage.
 *
 * v1.0.0
 *
 * http://locstorjs.com
 *
 * Copyright (c) 2013 Justin de Guzman
 * Released under the MIT license.
 */

function Locstor() {}
// Private Methods
// ---------------

// Checks if the specified string can be parsed to JSON
var isJSON = function isJSON(string) {
	try {
		JSON.parse(string);
		return true;
	} catch(e) {
		return false;
	}
};

// IE detection method courtesy of James Padolsey
// http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments
var ie = (function(){
	var undef, v = 3, div = document.createElement('div');
	while (
		div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i>< ![endif]-->',
		div.getElementsByTagName('i')[0]
	);

	return v > 4 ? v : undef;
}());

// Public Methods
// --------------

// Removes all key/value pairs from localStorage
Locstor.clear = function clear() {
	localStorage.clear();
};

// Checks if localStorage contains the specified key
Locstor.contains = function contains(key) {
	if(typeof key != 'string') {
		throw 'Key must be a string for function contains(key)';
	}

	return this.getKeys().indexOf(key) !== -1;
};

// Returns the value of a specified key in localStorage
// The value is converted to the proper type upon retrieval 
Locstor.get = function get(key) {
	if(typeof key != 'string') {
		throw 'Key must be a string for function get(key)';
	}

	var value = localStorage[key];	// retrieve value
	var number = parseFloat(value);	// to allow for number checking

	if(!isNaN(number)) {
		return number;	// value was of type number
	} else if(value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
		return value === 'true';	//value was of type boolean
	} else if(value === 'null') {
		return null;	// value was null
	} else if(isJSON(value)) {
		return JSON.parse(value);	// value was of type object or array
	} else {
		return value;	// value was of type string
	}
};

// Returns an array of keys currently stored in localStorage
Locstor.getKeys = function getKeys() {
	var result = [];
	
	for(var i = 0; i < localStorage.length; i++) {
		result.push(localStorage.key(i));
	}

	return result;
};

// Returns how much space is left in localStorage
// The most common limit for browsers today is 5MB, as specified by default size
// IE8+ has a properly implemented remainingSpace property which is used if
// possible, otherwise it is approximated by subtracting the defaultSize with
// the total size of all the strings in localStorage
Locstor.getRemainingSpace = function getRemainingSpace() {
	var defaultSize = 5242880;

	var result = ie > 7 ? localStorage.remainingSpace : defaultSize - this.getSize();
	return result;
};

// Returns the size of the total contents in localStorage 
Locstor.getSize = function getSize() {
	return JSON.stringify(localStorage).length;
};

// Returns true if localStorage has no key/value pairs
Locstor.isEmpty = function isEmpty() {
	return this.getKeys().length === 0;
};

// Removes the specified key/value pair from localStorage given a key
// Optionally takes an array to remove key/value pairs specified in the array
Locstor.remove = function remove(key) {
	if(typeof key == 'string') {
		localStorage.removeItem(key);
	} else if(key instanceof Array) {
		for(var i = 0; i < key.length; i++) {
			if(typeof key[i] == 'string') {
				localStorage.removeItem(key[i]);
			} else {
				throw 'Key in index ' + i + ' is not a string';
			}
		}
	} else {
		throw 'Key must be a string or array for function remove(key || array)';
	}
};

// Stores the specified key value pair (allows string, number, boolean, object, array)
// If no key and only an object is passed, this function acts as an alias function for store(object)
Locstor.set = function set(key, value) {
	if(arguments.length == 1) {
		this.store(key);
	} else if(typeof key == 'string') {
		if(typeof value === 'object') {
			value = JSON.stringify(value);
		}

		localStorage[key] = value;
	} else {
		throw 'Invalid arguments for function set(key, value) or function set(object)';
	}
};

// Stores the object in localStorage, allowing access to individual object properties
Locstor.store = function store(value) {
	if(typeof value == 'object' && !(value instanceof Array)) {
		for(var property in value) {
			localStorage[property] = value[property];
		}
	} else {
		throw 'Argument for function set(object) must be an object';
	}
};

// Returns an object representation of the current state of localStorage
Locstor.toObject = function toObject() {
	var o = {};
	var keys = this.getKeys();

	for(var i = 0; i < keys.length; i++) {
		var key = keys[i];
		o[key] = this.get(key);
	}

	return o;
};