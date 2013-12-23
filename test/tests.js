/**
 * This file contains the unit tests for locstor.js
 *
 * Run these tests using QUnit (currently using v1.12.0) from http://qunitjs.com/
 *
 * Copyright (c) 2013 Justin de Guzman
 * Released under the MIT license.
 */

(function() {
	// Clears localStoroage before and after every test
	var modelOptions = {
		setup: function() {
			Locstor.clear();
		},
		teardown: function() {
			Locstor.clear();
		}
	};

	// Module to check if methods execute given correct parameters
	module('Public Method (Execution)', modelOptions);

	test('clear()', function() {
		Locstor.set('name', 'John Smith');
		Locstor.clear();

		deepEqual(Locstor.isEmpty(), true, 'LocaLocstortorage was cleared');
	});

	test('contains(key)', function() {
		Locstor.set('name', 'John Wayne');

		deepEqual(Locstor.contains('name'), true, 'Found presence of "name"');
		deepEqual(Locstor.contains('age'), false, 'Could not find presence of "age"');
	});

	test('get(key)', function() {
		var person = {
			name: 'John Smith',
			age: 27,
			married: 'false',
			pet: {name: 'Spike', species: 'dog'}
		};

		Locstor.set(person);

		deepEqual(Locstor.get('name'), 'John Smith', '"name" was retrieved from localStorage');
		deepEqual(Locstor.get('age'), 27, '"age" was retrieved from localStorage');
		deepEqual(Locstor.get('married'), false, '"married" was retrieved from localStorage');
		equal(Locstor.get('pet'), {name: 'Spike', species: 'dog'}, '"pet" was retrieved from localStorage');
		deepEqual(Locstor.get('location'), null, '"location" retrieved as null from localStorage');
	});

	test('get(key, defaultValue)', function() {
		Locstor.set('notificationsEnabled', true);
		deepEqual(Locstor.get('notificationsEnabled', false), true, '"notificationsEnabled" retrieved as true from localStorage' );

		deepEqual(Locstor.get('locationServicesEnabled', false), false, '"location" retrieved as null from localStorage');
	});

	test('getKeys()', function() {
		Locstor.set('first', 'Adam');
		Locstor.set('last', 'Smith');

		deepEqual(Locstor.getKeys(), ['first', 'last'], 'Keys were retrieved');
	});

	test('getRemainingSpace()', function() {
		deepEqual(Locstor.getRemainingSpace(), 5242880 - 2, 'Remaining space was calculated');
	});

	test('getSize()', function() {
		var message = 'Size of locaLocstortorage was retrieved. This test takes ' +
						'into account Chrome\'s 2 initial bytes. If it failed ' +
						'on a different browser, that might be the cause.';
		deepEqual(Locstor.getSize(), 2, message);
	});

	test('isEmpty()', function() {
		deepEqual(Locstor.isEmpty(), true, 'LocaLocstortorage is empty');

		Locstor.set('name', 'Pocahontas');
		deepEqual(Locstor.isEmpty(), false, 'isEmpty() detects contents');
	});

	test('remove(key)', function() {
		Locstor.set('name', 'Sheldon Cooper');
		Locstor.remove('name');

		deepEqual(Locstor.contains('name'), false, 'Key/value was removed');

		var animal = {
			name: 'Bugs',
			species: 'Rabbit',
			snack: 'Carrots'
		};

		Locstor.set(animal);
		Locstor.remove(['name', 'species', 'snack']);
		deepEqual(Locstor.contains('name'), false, 'Array item 1 was removed');
		deepEqual(Locstor.contains('species'), false, 'Array item 2 was removed');
		deepEqual(Locstor.contains('snack'), false, 'Array item 3 was removed');
	});

	test('set(key, value)', function() {
		Locstor.set('username', 'locstor_monstor');

		deepEqual(Locstor.get('username'), 'locstor_monstor', 'Key / string value pair was set');

		Locstor.set('colors', ['red', 'green', 'blue']);
		deepEqual(Locstor.get('colors'), ['red', 'green', 'blue'], 'Key / array was set');

		// To test object equality because equal(obj1, obj2, message) faiLocstor
		var equalObjects = function equalObjects(obj1, obj2) {
			for(var property in obj1) {
				if(obj1[property] !== obj2[property]) {
					return false;
				}
			}

			return true;
		};

		var person = {name: 'Dustin', job: 'Food Taster'};
		Locstor.set('myObj', person);
		ok(equalObjects(person, Locstor.get('myObj')), 'Key / object was set');

		Locstor.set({species: 'Warthog', tail: 'Long'});
		deepEqual(Locstor.get('species'), 'Warthog', 'Alias function for store(object) works');
	});

	test('store(object)', function() {
		var person = {
			name: 'James Bond',
			age: 40,
			organization: 'MI6'
		};

		Locstor.store(person);

		deepEqual(Locstor.get('name'), 'James Bond', 'Object was stored');
	});

	test('toObject()', function() {
		Locstor.set('first', 'Sarah');
		Locstor.set('last', 'Connor');

		deepEqual(Locstor.toObject(), {first: 'Sarah', last: 'Connor'}, 'LocaLocstortorage is empty');
	});

	// Module to check if methods fail given incorrect parameters
	module('Public Method (Error Checking)', modelOptions);

	test('contains()', function() {
		throws(
			function() {
				Locstor.contains(98);
			},
			'Contains fails when passed a number'
		);

		throws(
			function() {
				Locstor.contains({name: 'Pedro', hairColor: 'Brown'});
			},
			'Contains fails when passed an object'
		);

		throws(
			function() {
				Locstor.contains(true);
			},
			'Contains fails when passed a boolean'
		);

		throws(
			function() {
				Locstor.contains(['red', 'green']);
			},
			'Contains fails when passed an array'
		);
	});

	// These unit tests cover both get(string key) and get(string key, type defaultValue)
	test('get(key) / get(key, defaultValue)', function() {
		throws(
			function() {
				Locstor.get(98);
			},
			'Get fails when passed a number'
		);

		throws(
			function() {
				Locstor.get({name: 'Pedro', hairColor: 'Brown'});
			},
			'Get fails when passed an object'
		);

		throws(
			function() {
				Locstor.get(true);
			},
			'Get fails when passed a boolean'
		);

		throws(
			function() {
				Locstor.get(['red', 'green']);
			},
			'Get fails when passed an array'
		);
	});

	test('remove(key)', function() {
		throws(
			function() {
				Locstor.remove(98);
			},
			'Remove fails when passed a number'
		);

		throws(
			function() {
				Locstor.remove({name: 'Pedro', hairColor: 'Brown'});
			},
			'Remove fails when passed an object'
		);

		throws(
			function() {
				Locstor.remove(true);
			},
			'Remove fails when passed a boolean'
		);
	});

	test('set(value)', function() {
		throws(
			function() {
				Locstor.set(98);
			},
			'Set fails when passed a single parameter as number'
		);

		throws(
			function() {
				Locstor.set('Abraham Lincoln');
			},
			'Set fails when passed a single parameter as string'
		);

		throws(
			function() {
				Locstor.set(true);
			},
			'Set fails when passed a single parameter as boolean'
		);

		throws(
			function() {
				Locstor.set(['red', 'green']);
			},
			'Set fails when passed a single parameter as array'
		);

		throws(
			function() {
				Locstor.set(98, 98);
			},
			'Set fails when the passed key is a number'
		);

		throws(
			function() {
				Locstor.set({name: 'Pedro'}, 'Abraham Lincoln');
			},
			'Set fails when the pass key is an object'
		);

		throws(
			function() {
				Locstor.set(true, true);
			},
			'Set fails when the passed key is a boolean'
		);

		throws(
			function() {
				Locstor.set(['red', 'green'], ['red', 'green']);
			},
			'Set fails when the passed key is an array'
		);
	});

	test('store(value)', function() {
		throws(
			function() {
				Locstor.store(98);
			},
			'Remove fails when passed a number'
		);

		throws(
			function() {
				Locstor.store('Abraham Lincoln');
			},
			'Store fails when passed an string'
		);

		throws(
			function() {
				Locstor.store(true);
			},
			'Store fails when passed a boolean'
		);

		throws(
			function() {
				Locstor.store(['red', 'green']);
			},
			'Store fails when passed an array'
		);
	});
})();
