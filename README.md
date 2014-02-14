##[locstor.js](locstorjs.com) - A localStorage Helper Library
-----------------------------------------------------------
**Supports all modern browsers and IE6+**
Contents
--------
1. [Why locstor.js?](#why-locstor)
1. [API](#API)
1. [Running Unit Tests](#running-unit-tests)
1. [How to Contribute](#contributing)
1. [Questions / Comments](#q-and-a)

<a id = 'why-locstor'></a>Why locstor.js?
-----------------------------------------

**Let's face it, HTML5 localStorage is awesome. In an era of increasingly complex web applications, localStorage allows developers to persistently store data with ease. Locstor.js extends upon localStorage by providing:**

- **Automatic Type Conversions**    

	Let's store a number in localStorage. 
	```
	//add number to localStorage
	localStorage['year'] = 1984;
	```
	When we try to retrieve that number, we instead get back a string.
	```
	var num = localStorage['year'];
	console.log(typeof num); // outputs "string"
	```
	We can use locstor.js to avoid this unexpected behavior.
	```
	var num = Locstor.get('year');
	console.log(typeof num); // outputs "number"
	```
	Now that we retrieved our value back in the proper type, we can perform numeric 	operations on it without converting it or parsing it or worrying about type 		conversion errors. It's not just numbers: booleans, objects, and arrays are supported too.

- **Easier Storage and Access**
	
	I know what you're thinking, how is it possible for localStorage to be even easier? All you do is pass a value to a key. One problem to think about is when you store objects. 
	

	Let's take our object here...
	```
	var person = {
		name: 'Justin',
		location: 'California',
		eyeColor: 'brown'
	};
	```
	…and store it.
	```
	localStorage['me'] = person;
	```
	If we tried to access a property of that object in localStorage, we'd have to 		retrieve it and parse it first.
	```
	var name = localStorage['me'].name; // doesn't work
	```
	However, if we used locstor.js, we wouldn't need to worry about doing those steps.
	```
	Locstor.store(person);
	
	var name = Locstor.get('name'); // this works
	```
	And if you wanted to store the object without separating the properties, we can do 	that too!
	```
	Locstor.set('me', person);
	Locstor.get('me'); // returns an object
	```
	
- **Older Browser Support**

	Older browsers do not natively support HTML5 Local Storage. Locstor.js automatically checks if localStorage is compatible with your current browser. If it detects localStorage is incompatible, the library falls back to cookies. But don't worry, **even with older browsers, locstar.js works exactly the same.**	
	
	`Note: If you need IE < 8 support, you need to include Douglas Crockford's` [json2.js](https://github.com/douglascrockford/JSON-js)
	
	####*There's a lot more features than that. Check out the API to read about the rest!*

<a id = 'API'></a>API
-----------------------------------------
**Below you can find the public methods available for use in locstor.js. Please note that this library is a defensive one. Illegal parameters will cause the method to fail instead of attempting to continue and execute. This is by design to avoid unexpected behavior when using localStorage.**

###Installation
####Include this line in your .html file
	<script src='locstor.min.js'></script>
	
####Or via [bower](http://bower.io/)
	bower install locstor
	
###Public Methods
+ [**clear**()](#method-clear)
+ [**contains**(string key)](#method-contains)
+ [**get**(string key)](#method-get)
+ [**get**(string key, type defaultValue)](#method-get-default)
+ [**getKeys**()](#method-getkeys)
+ [**getRemainingSpace**()](#method-getspace)
+ [**getSize**()](#method-getsize)
+ [**isEmpty**()](#method-isempty)
+ [**remove**(string key)](#method-remove)
+ [**remove**(array[])](#method-remove-array)
+ [**set**(string key, type value)](#method-set)
+ [**set**(object o)](#method-set-alias)
+ [**store**(object o)](#method-store)
+ [**toObject**()](#method-toobject)

**<a id = 'method-clear'></a><u>clear()</u>**  
Removes all key / value pairs from localStorage
```
Locstor.clear();
```

**<a id = 'method-contains'></a><u>contains( _string key_ )</u>**  
Returns true if localStorage contains the specified key
```
Locstor.set('name', 'John Smith');
Locstor.contains('name');	// returns true
Locstor.contains('age');	// returns false
```

**<a id = 'method-get'></a><u>get( _string key_ )</u>**  
Returns the proper-type value of a specified key in localStorage
```
var person = {
	name: 'Adam',
	age: 28,
	married: true,
	children: ['Frankie', 'Sarah'];
	pet: {name: 'Spike', species: 'Dog'};
};

Locstor.store(person);

Locstor.get('name');		// returns a string
Locstor.get('age');			// returns a number
Locstor.get('married');		// returns a boolean
Locstor.get('children');	// returns an array
Locstor.get('pet');			// returns an object
Locstor.get('occupation');	// returns null because key is not set
```

**<a id = 'method-get'></a><u>get( _string key_, _type defaultValue_ )</u>**  
Similar to the get( _string key_ ) method except returns a default value if the value retrieved is null
```
Locstor.set('notificationsEnabled', true);		// set value of notificationsEnabled to true
Locstor.get('notificationsEnabled', false);		// returns true because key was previously set to true
Locstor.get('locationServicesEnabled', false);	// returns false (the default value) because key was not previously set
```

**<a id = 'method-getkeys'></a><u>getKeys()</u>**  
Returns an array of keys currently stored in localStorage. The order of the keys is not guaranteed.
```
Locstor.set('width', 400);
Locstor.set('height', 300);
Locstor.set('color', 'red');

Locstor.getKeys();	// returns ['width', 'height', 'color']
```

**<a id = 'method-getspace'></a><u>getRemainingSpace()</u>**  
Returns an approximation of how much space is left in localStorage
```
Locstor.getRemainingSpace();	// returns a number
```

**<a id = 'method-getsize'></a><u>getSize()</u>**  
Returns the size of the total contents in localStorage. 
```
Locstor.getSize();	// returns a number
```

**<a id = 'method-isempty'></a><u>isEmpty()</u>**  
Returns true if localStorage has no key/value pairs
```
Locstor.set('username', 'locstor_monstor');
Locstor.isEmpty();	// returns false

Locstor.clear();
Locstor.isEmpty();	// returns true 
```

**<a id = 'method-remove'></a><u>remove( _string key_ )</u>**  
Removes the specified key/value pair from localStorage given a key
```
Locstor.set('distance', 10);
Locstor.remove('distance');
Locstor.contains('distance');	// returns false
```

**<a id = 'method-remove-array'></a><u>remove( _array[]_ )</u>**  
Removes key/value pairs with keys specified in an array
```
Locstor.set('city', 'New York City');
Locstor.set('state', New York);
Locstor.set('country', 'United States');

Locstor.remove(['city', 'state', 'country']);
```

**<a id = 'method-set'></a><u>set( _string key, type value_ )</u>**  
Sets the specified key/value pair (allows string, number, boolean, object, array)
```
Locstor.set('weapon', 'longsword');								// Sets a string
Locstor.set('health', 99);										// Sets a number
Locstor.set('maxLevel', true);									// Sets a boolean
Locstor.set('armor', {metal: 'steel', defense: 99});			// Sets an object
Locstor.set('items', ['Health Potion', 'Wand', 'Lobster']);		// Sets an array
```

**<a id = 'method-set-alias'></a><u>set( _object o_ )</u>**  
Alias function for method [store(object o)](#method-store)
```
See method below.
```

**<a id = 'method-store'></a><u>store( _object o_ )</u>**  
Stores a given object in localStorage, allowing access to individual object properties
```
var person = {
	name: 'Abraham Lincoln',
	occupation: 'President',
	height: 6
};

Locstor.store(person);

Locstor.get('name');		// returns 'Abraham Lincoln'
Locstor.get('occupation');	// returns 'President'
Locstor.get('height');		// returns 6
```

**<a id = 'method-toobject'></a><u>toObject()</u>**  
Returns an object representation of the current state of localStorage
```
Locstor.set('name', 'Justin');
Locstor.set('eyeColor', 'brown');
Locstor.set('gender', 'male');

Locstor.toObject(); // returns {name: 'Justin', eyeColor: 'brown', gender: 'male'}
```
<a id = 'running-unit-tests'></a>Running Unit Tests
---------------------------------------------------
This library uses QUnit to perform unit tests. Each method from the API has two tests, one to make sure it executes properly and the other to make it fail. The two tests of each method are in the *tests.js* file, each respectively under the *Public Method (Execution)* module or the *Public Method (Error Checking)* module.

***To run the tests, open tests/index.html in a browser.***

<a id = 'contributing'></a>Contributing
---------------------------------------
Open source software is important, which is why I decided to release this library under the MIT license. If you use this library in your project, please consider giving credit where it is due. This will allow even more developers to know about this library and in turn contribute.

If you found bugs or ways to improve the source code, or extended the library for your own project, please submit a pull request!

*The source folder contains:*
	
	AUTHORS	(list of contributors)
	LICENSE	(MIT)
	locstor.js	(uncompressed and full of comments)
	locstor.min.js	(minified for production)
	bower.json (bower package manager configuration)
	README.md
	test
		|_	index.html	(launch to view tests)
			tests.js	(unit tests go here)
			resources	(qunit files)
				|_	qunit.css
					qunit.js
	TODO.md	(to be done)
	VERSION-CHANGES

<a id = 'q-and-a'></a>Questions / Comments
------------------------------------------
I would love to hear how you've used this library and/or how it's helped you.

Send questions and comments to <a href = 'mailto:justin@justindeguzman.net'>justin@justindeguzman.net</a>.
