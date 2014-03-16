/**
 * Locstor.js is a JavaScript helper library for HTML5 localStorage.
 *
 * v1.0.7
 *
 * http://locstorjs.com
 *
 * Copyright (c) 2013 Justin de Guzman
 * Released under the MIT license.
 */

(function() {
  var Locstor = function Locstor() {};

  // Private Properties
  // -----------------

  // Common 5MB localStorage limit among current browsers
  var defaultSize = 5242880;

  // Private Methods
  // ---------------

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

  // Initialization
  // ---------------

  // Inital check to see if localStorage is supported in the browser
  (function() {
    var supported = false;

    // Derived from Modernizer (http://github.com/Modernizr/Modernizr)
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      supported = true;
    } catch(e) {
      supported = false;
    }

    // Implements localStorage if not supported
    // From https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage?redirectlocale=en-US&redirectslug=DOM%2FStorage
    if(!supported) {
      window.localStorage = {
        getItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
          return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
            "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        },

        key: function (nKeyId) {
          return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
        },

        setItem: function (sKey, sValue) {
          if(!sKey) { return; }
          document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
          this.length = document.cookie.match(/\=/g).length;
        },

        length: 0,

        removeItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return; }
          document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          this.length--;
        },

        hasOwnProperty: function (sKey) {
          return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
      };

      window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
    }
  })();

  // Enable AMD Support
  if(typeof window.define === "function" && window.define.amd) {
    window.define("locstor", [], function() {
      return Locstor;
    });
  } else {
    // Creates the global Locstor object if you aren't using RequireJS, etc.
    window.Locstor = Locstor;
  }

  // Public Methods
  // --------------

  // Removes all key/value pairs from localStorage
  Locstor.clear = function clear() {
    localStorage.clear();
  };

  // Checks if localStorage contains the specified key
  Locstor.contains = function contains(key) {
    if(typeof key !== 'string') {
      throw new Error('Key must be a string for function contains(key)');
    }

    return this.getKeys().indexOf(key) !== -1;
  };

  // Returns the value of a specified key in localStorage
  // The value is converted to the proper type upon retrieval
  // If the key is not in local storage and the defaultValue is specified, the default value is returned.
  Locstor.get = function get(key,defaultValue) {
    if(typeof key !== 'string') {
      throw new Error('Key must be a string for function get(key)');
    }

    var value = localStorage.getItem(key);  // retrieve value
    var number = parseFloat(value); // to allow for number checking

    if(value === null) {
      // Returns default value if key is not set, otherwise returns null
      return arguments.length === 2 ? defaultValue : null;
    } else if(!isNaN(number)) {
      return number;  // value was of type number
    } else if(value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      return value === 'true';  //value was of type boolean
    } else {
      try {
        value = JSON.parse(value);
        return value;
      } catch(e) {
        return value;
      }
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
    return ie && ie > 7 ? localStorage.remainingSpace : defaultSize - this.getSize();
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
    if(typeof key === 'string') {
      localStorage.removeItem(key);
    } else if(key instanceof Array) {
      for(var i = 0; i < key.length; i++) {
        if(typeof key[i] === 'string') {
          localStorage.removeItem(key[i]);
        } else {
          throw new Error('Key in index ' + i + ' is not a string');
        }
      }
    } else {
      throw new Error('Key must be a string or array for function remove(key || array)');
    }
  };

  // Stores the specified key value pair (allows string, number, boolean, object, array)
  // If no key and only an object is passed, this function acts as an alias function for store(object)
  Locstor.set = function set(key, value) {
    if(arguments.length === 1) {
      this.store(key);
    } else if(typeof key === 'string') {
      if(typeof value === 'object') {
        value = JSON.stringify(value);
      }

      localStorage.setItem(key, value);
    } else {
      throw new Error('Invalid arguments for function set(key, value) or function set(object)');
    }
  };

  // Stores the object in localStorage, allowing access to individual object properties
  Locstor.store = function store(value) {
    if(typeof value === 'object' && !(value instanceof Array)) {
      for(var property in value) {
        localStorage.setItem(property, value[property]);
      }
    } else {
      throw new Error('Argument for function set(object) must be an object');
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
})();