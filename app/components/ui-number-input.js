import Ember from 'ember';
var isEmpty = Ember.isEmpty;
var typeOf = Ember.typeOf;

export default Ember.TextField.extend({
	classNames: ['ui-number-input'],
	classNameBindings: ['bsFormControl', 'sizeClass', 'statusClass', 'statusVisualize:visualize','showSpinners::hide-spinners'],
	attributeBindinds: ['type','minAttr','maxAttr','step'],
	pattern: '[0-9]*',
	showSpinners: false,
	type: 'number',
	bs: true,
	bsFormControl: function() {
		return this.get('bs') ? 'form-control' : false;
	}.property('bs'),
	status: 'default',
	statusIsDefault: Ember.computed.equal('status','default'),
	statusClass: function() {
		var status = this.get('status');
		if (typeOf(status) === 'function') {
			status = status(this); // resolve function call
		}
		if(['error','err'].contains(status)) {
			return 'status-error';
		} else if(['warn','warning'].contains(status)) {
			return 'status-warning';
		} else if(['success','ok'].contains(status)) {
			return 'status-success';
		} else {
			return 'status-default';
		}
	}.property('status','value'), // we look at 'value' for function based statuses
	statusVisualize: false,
	size: 'default',
	sizeClass: function() {
		var size = this.get('size');
		if(['lg','large'].contains(size)) {
			return 'input-lg';
		} else if(['sm','small'].contains(size)) {
			return 'input-sm';
		} else {
			return false;
		}
	}.property('size'),
	min: null,
	max: null,
	step: null,
	// EVENT HANDLING
	focusOut: function(evt) {
		// console.log('focus just lost: %o. Value was: %s', evt, this.get('value'));
	},
	keyDown: function(evt) {
		var self = this;
		var corrections = this.get('corrections').filterBy('event','keyDown');
		console.log('key up: %o. Value was: %s. keyCode was %s. charCode was %s.', evt, this.get('value'), evt.keyCode, evt.which);
		var acceptOrReject = true;
		corrections.forEach(function(correction) {
			console.log('running correction: %s', correction.id);
			acceptOrReject = acceptOrReject ? correction.rule(self, evt) : false;
		});
		console.log(acceptOrReject ? 'true' : 'false');
		if(!acceptOrReject) {
			evt.preventDefault();
		}
		return acceptOrReject;
	},
	// CORRECTION RULES
	corrections: [],	// active rules
	defaultCorrectionRules: ['numericOnly'], 
	correctionRules: [], // opportunity for container to add rules
	_addCorrectionRules: function() {
		Ember.run.next(this,function() {
			var adding = this.get('correctionRules') || [];
			if(!isEmpty(this.get('defaultCorrectionRules'))) {
				adding = adding.concat(this.get('defaultCorrectionRules'));
			}
			var corrections = this.get('corrections');
			adding = typeOf(adding) === 'string' ? adding.split(',') : adding;
			var self = this;
			adding.forEach(function(correction) {
				// correction is either an object which means it's really an external rule definition
				// or its a string which is a reference to the internal rules
				if(typeOf(correction) === 'string') {
					// INTERNAL RULE
					var libraryItem = self.get('correctionLibrary').findBy('id',correction);
					if(isEmpty(libraryItem)) {
						console.warn('Couldn\'t find correction rule "%s"', correction);
					} else {
						self.set('corrections', corrections.addObject(libraryItem));
					}
				} else if(typeOf(correction) === 'object'){
					// EXTERNAL RULE
					if(isEmpty(correction.id)) {
						console.warn('External correction rule does not have an ID. Ignoring. %o', correction);
					} else if(isEmpty(correction.rule) || ofType(correction.rule) !== 'function') {
						console.warn('Correction rule "%s" is missing its rule definition!', correction.id);						
					} else if(isEmpty(correction.event)) {
						console.warn('Correction rule "%s" is missing an event definition.', correction.id);						
					} else {
						// Looks like external rule is correctly formatted
						self.set('corrections', corrections.addObject(correction));
					}
				} else {
					// UNKNOWN
					console.warn('Correction rule "%s" is not formatted correctly', correction);
				}
			});
		});
	}.on('didInsertElement'),
	correctionLibrary: [
		{
			id:'numericOnly',
			event: 'keyDown',
			emphasis: null,
			message: 'Only numeric characters are allowed.',
			rule: function(context,event) {
				var keyCode = event.keyCode;
				var validControlCodes = context.get('_KEYBOARD.controlKeys');
				var numericKeys = context.get('_KEYBOARD.numericKeys');
				if(numericKeys.concat(validControlCodes).contains(keyCode)) {
					return true;
				} else {
					return false;
				}
			} 
		}
	],
	// REFERENCE VARIABLES
	_KEYBOARD: {
		controlKeys: [8,9,37,39,38,40,46], // 8:esc, 9:tab, 37:left, 39:right, 38:up, 40:down, 46: delete
		numericKeys: [48,49,50,51,52,53,54,55,56,57]
	}
	
});
