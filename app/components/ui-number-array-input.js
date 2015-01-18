import Ember from 'ember';

var run = Ember.run;
var typeOf = Ember.typeOf;

export default Ember.Component.extend({

	tagName: 'span',
	classNames: ['ui-number-array-input'],
	// two-way bindings
	value: [],
	elements: null, // the number of elements in the array
	placeholder: null,
	align: 'left',
	size: null,
	min: null,
	max: null,
	correctionRules: null,
	status: null,
	statusVisualize: false,
	// available one-way bindings (aka, read-only)
	// --------------------------
	// provides an array of objects which represent the array elements
	// this just makes the templating easier and allows further ornamentation
	arrayElements: Ember.A([]),
	samples: [],
	sum: null,
	average: null,
	
	// observers and event handlers
	// ----------------------------
	// on initialisation ensure element count is defaulted to 
	// the value's array length (if not already specified)	
	_elementsInit: function() {
		var value = this.get('value');
		var elements = this.get('elements');
		if(value && !elements) {
			this.set('elements', value.length);
		}
	}.on('didInsertElement'),
	_arrayElementsSourceChange: function() {
		run.next(this, function() {
			var elements = this.get('elements');
			var value = this.get('value');
			var arrayElements = [];
			for(var i=0; i < elements; i++) {
				// ensure value always has full array length
				if(i >= value.length) {
					value[i] = null; 
				}
				// assign base name/value pair
				arrayElements[i] = Ember.Object.create({ id: i, value: value[i] ? Number(value[i]) : null });
				// add appropriate ornamentation
				var o = this.getProperties('placeholder','min','max','align', 'size', 'correctionRules','status','statusVisualize');
				var alwaysArrayProps = ['correctionRules'];
				for (var property in o) {
					// if always an "array"
					if (alwaysArrayProps.contains(property) && o[property]) {
						o[property] = o[property].split(',');
					}
					// split comma-seperated list 
					if (typeOf(o[property]) === 'string' && o[property].indexOf(',') !== -1) {
						o[property] = o[property].split(',');
					}
					// set
					if (['string','number','boolean','function'].contains(typeOf(o[property])) || property === 'correctionRules') {
						// uniform value across all inputs
						arrayElements[i][property] = o[property];
					} else if (typeOf(o[property]) === 'array') {
						// specific values
						arrayElements[i][property] = o[property][i];
					}
				};
			}
			this.set('arrayElements',arrayElements);
		});
	}.observes('elements','placeholder','align','min','max','size','correctionRules','status','statusVisualize').on('didInsertElement'),
	_arrayElementDidChange: function() {
		run.next(this, function() {
			var elements = this.get('arrayElements')
			this.set('value', elements.map(function(item,index){
				if (item.value) {
					return Number(item.value);					
				} else {
					return null;
				}
			}));
			var sum = 0;
			var samples = [];
			elements.map(function(item) {
				if (item.value) {
					sum += Number(item.value);
					samples.pushObject(Number(item.value));
				} else {
					return false;
				}
			});
			this.set('samples', samples);
			this.set('sum', sum);
			var average = samples.length === 0 ? null : sum / samples.length;
			this.set('average', average);
		});
	}.observes('arrayElements.@each.value'),
	
	// // ACTIONS
	// actions: {
	// 	elementDidChange: function() {
	// 		console.log("element did change");
	// 		this.set('value', this.get('arrayElements').map(function(item,index){
	// 			return item.value;
	// 		}));
	// 	}
	// }
	

});
