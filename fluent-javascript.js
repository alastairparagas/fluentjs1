/**
	Prototypal Inheritance in Javascript
	This was originally written by Eric Elliot during his talk on 
	O'Reilly's Fluent Web Conference. Added are my annotations, edits
	and additions for a better explanation for Javascript adventurers
	like me - Alastair Paragas!
*/


/*
	"extend" function that you see sprinkled around this code is
	a reference to jQuery's $.extend method 
	(http://api.jquery.com/jquery.extend/).
	jQuery's extend method accepts objects as parameters and combines
	those objects into the object that is provided as the first parameter
	
	So in reality, you can think of extend as extend(destinationObject, 
	[sourceObject1 -> sourceObjectN])
*/
var extend = $.extend;


/*
	Constructor Functions ------->
	Calling "new" on the executed function "Bar" automatically creates a new
	object. Everything binded to "this" inside the "Bar" function
	becomes a property of the new object.
*/
(function () {

	function Bar() {
		this.band = 'lame';
	}

	var myBar = new Bar();
	
	/*
		You forgot to call "new" on a constructor function? If you're
		running on Javascript strict mode, Javascript throws an error.
		If you're not, everything binded to "this" becomes a global
		variable. DANGEROUS!
	*/
	var brokenBar = Bar();

	test('Constructor', function () {
		equal(typeof myBar, 'object', 'myBar should be an object');
		equal(brokenBar.band, 'lame', 'brokenBar should have a band.'); // Fails
	});

}());

/*
	Safe object creation with Constructor functions ---------------------->
	This is much like the code above, except it guards against you accidentally
	forgetting to "new" a constructor function. If you do, the constructor function
	automatically creates an instance of itself.
*/
(function () {

	function Bar() {
		if (!(this instanceof Bar)) {
			return new Bar();
		}
		this.band = 'lame';
	}

	var myBar = Bar();

	test('Constructor', function () {
		equal(myBar.band, 'lame', 'myBar should have a band.');
	});

}());


/*
	One-time object use -------------------------------------------->
	If you plan to use objects once - just create an object literal!
*/
(function () {

	var bar = {
		band: 'Dr. Teeth and the Electric Mayhem'
	};

	test('Literal', function () {
		equal(bar.band, 'Dr. Teeth and the Electric Mayhem', 'Literal assignments should work.');
	});

}());


/*
	Repetitive object use ---------------->
	If you plan to use multiple objects at once - have a function that
	returns an object instead. Behind the scenes, every time you call
	createBar(), a new reference is made, so you can safely change objects
	created with createBar().
*/
(function () {
	
	function createBar() {
		return {
			band: 'Dr. Teeth and the Electric Mayhem'
		};
	}
	var bar = createBar();

	test('Factories', function () {
		equal(bar.band, 'Dr. Teeth and the Electric Mayhem', 'Factories should work.');
	});

}());


/*
	Douglas Crockford's Object.create function ----------------------->
	This actually now exists in the web, but not when Crockford wrote the article
	containing this code (http://javascript.crockford.com/prototypal.html)
	
	This is the actual Object.create implementation in modern browsers
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
	
	What Object.create does is it accepts an object and puts that object in the prototype
	chain of the new object. 
	
	In Javascript, there are no classes - only objects. The way an object can "inherit" from
	another object is through the prototypal chain. Each Javascript object has a prototypal chain
	that ends at Object.prototype.
*/
if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}

(function () {

	var barPrototype = {
		open: function open() { /* ... */ },
		close: function close() { /* ... */ },
	};
	
	function createBar() {
		return Object.create(barPrototype);
	}

	var bar = createBar();

	test('Object.create', function () {
		ok(bar.open, 'Object should have access to prototype methods.');
	});

}());


/*
	Inheritance using Constructor functions ------------------------->
	The open and close functions are methods on the "bar" object that
	is constructed using the constructor function "Bar". However,
	these methods are on the prototype chain, so everytime you "new Bar()",
	you reference the same methods - the methods are "inherited".
*/
(function () {

	function Bar() {
	}

	Bar.prototype.open = function open() { /* ... */ };
	Bar.prototype.close = function close() { /* ... */ };

	var bar = new Bar();

	test('Old prototype assignment', function () {
		ok(bar.open, 'Object should have access to prototype methods.');
	});

}());


/*
	Inheritance in Javascript using Object.create ------------------->
	Using Object.create, barPrototype is now in the prototype chain
	of any object constructed by the createBar() function. 
	
	The above practice of inheritance using constructor functions is often
	looked down upon because it locks your inheritance to one parent
	instead of being able to switch your parents constantly.
*/
(function () {

	var barPrototype = {
		open: function open() { /* ... */ },
		close: function close() { /* ... */ },
	};
	function createBar() {
		return Object.create(barPrototype);
	}

	var bar = createBar();

	test('New prototype assignment', function () {
		ok(bar.open, 'Object should have access to prototype methods.');
	});

}());


/*
	"Private properties" in Javascript ------------------------>
	To simulate private properties just like how you have them in a classical
	programming language like Java, create a simple variable and mutate them
	through your object's methods that you expose when you return the function!
	
	In this example, "isOpen" simulates a private variable!
*/
(function () {

	function createBar() {
		var isOpen = false;

		return {
			open: function open() {
				isOpen = true;
				return this;
			},
			close: function close() {
				isOpen = false;
				return this;
			},
			isOpen: function isOpenMethod() {
				return isOpen;
			}
		};
	}

	var bar = createBar();

	test('Privileged methods', function () {
		// Notice that "this" in the open() and close() methods is a reference to the newly returned object.
		equal(bar.open().isOpen(), true, 'Privileged methods should have access'  + ' to private variables.');
		equal(bar.close().isOpen(), false,  'Private variable data is shared between' + ' privileged methods.');
	});

}());


/*
	Multiple inheritance ---------------------------------------->
	Membership and Availability are objects we want to inherit from for
	our new object.
*/
var membership = {
		add: function (member) {
			this.members[member.name] = member;
			return this;
		},
		getMember: function (name) {
			return this.members[name];
		}
	},
	availability = {
		open: function open() {
			isOpen = true;
			return this;
		},
		close: function close() {
			isOpen = false;
			return this;
		},
		isOpen: function isOpenMethod() {
			return isOpen;
		}
	};

/*
	Want to "inherit" from multiple objects? Combine those objects
	you want to inherit from (in this case, using jQuery's extend method),
	and then add the resulting object from the combination of the
	objects into a new object's prototype.
*/
(function () {
	'use strict';
	
	var barPrototype = extend({}, membership, 
							  availability); 

	function createBar() {
		var instance = Object.create(barPrototype);
		instance.members = {};
		return instance;
	}

	var bar = createBar();

	test('Mixin methods', function () {
		equal(bar.open().isOpen(), true, 'Availability mixin works.');
		ok(bar.add({
			name:'johnny',
			joined: new Date()})
		   .getMember('johnny'),
		   'Membership mixin works.');
	});

}());

/*
	Same as above, but now, not only are you inheriting
	from multiple objects (and then combining those objects so
	you technically inherit from just one object), but now, you
	are also combining other objects into your newly constructed
	object.
*/
(function () {
	'use strict';
	
	var barPrototype = extend({}, membership,
							  availability);

	function createBar(options) {
		var defaults = {
				name: 'The Saloon',
				specials: 'Whisky, Gin, Tequila'
			},
			instance = Object.create(barPrototype);

		return extend(instance, defaults, options);
	}

	var bar = createBar({
		name: 'The Dead Goat Saloon'
	});

	test('Defaults and options', function () {
		equal(bar.specials, 'Whisky, Gin, Tequila', 'Defaults should work.');
		equal(bar.name, 'The Dead Goat Saloon', 'Options should override defaults.');
	});  

}());


/*
	The two below examples do the same thing, except one is by using the switch case
	and the other, using an object.
*/
(function () {
	
	function doAction(action) {
		var actionlist = ['hack', 'slash', 'run'],
			action = actionlist[Math.round((Math.random() * (actionlist.length -1)))];

		switch (action) {
			case 'hack':
				return 'hack';
				break;
			case 'slash':
				return 'slash';
				break;
			case 'run':
				return 'run';
				break;
			default:
				throw new Error('Invalid action.');
				break;
		}
	}

	test('Switch ... case', function () {
		var testActions = {
			hack: true,
			slash: true,
			run: true
		};
		ok(testActions[doAction()], 'Should return a valid action');
	});

}());


(function () {
	
	function doAction(action) {
		var actionlist = ['hack', 'slash', 'run'],
			action = actionlist[Math.round((Math.random() * (actionlist.length -1)))];

		actions = {
			'hack': function () {
				return 'hack';
			},
			'slash': function () {
				return 'slash';
			},
			'run': function () {
				return 'run';
			}
		};

		if (typeof actions[action] !== 'function') {
			throw new Error('Invalid action.');
		}

		return actions[action]();
	}

	test('Command object', function () {
		var testActions = {
			hack: true,
			slash: true,
			run: true
		};
		ok(testActions[doAction()], 'Should return a valid action');
	});

}());