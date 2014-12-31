import Ember from 'ember';
var isEmpty = Ember.isEmpty;
var typeOf = Ember.typeOf;

export default Ember.TextField.extend({
	classNames: ['ui-number-input'],
	classNameBindings: ['bsFormControl', 'sizeClass', 'statusClass', 'statusVisualize:visualize','showSpinners::hide-spinners'],
	attributeBindings: ['type','minAttr','maxAttr','step'],
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
		return this.processCorrections('focusOut',evt);
	},
	keyDown: function(evt) {
		return this.processCorrections('keyDown',evt);
	},
	processCorrections: function(eventType, evt, options) {
		options = options || {};
		var self = this;
		var activeCorrections = this.get('activeCorrections').filterBy('event',eventType);
		var isAcceptable = true; // whitelist
		activeCorrections.forEach(function(correction) {
			// console.log('[%s] processing %s: %o', self.get('elementId'), eventType, correction);
			isAcceptable = isAcceptable ? correction.rule(self, evt) : false;
		});
		if(!isAcceptable) {
			evt.preventDefault();
		}
		return isAcceptable;
	},
	// MESSAGE QUEUEING
	messageQueue: [],
	/**
	 * Adds messages to queue. Queue items can be dismissed explictly or can timeout 
	 * if an 'expiry' is placed on the queue.
	 */
	addMessageQueue: function(message,options) {
		options = options || {};
		var now = new Date().getUTCMilliseconds();
		var expires = options.expiry ? now + options.expiry : null;
		this.set('messageQueue', this.get('messageQueue').concat({timestamp: new Date(), message: message, expires: expires}));
	},
	// CORRECTION RULES
	activeCorrections: [],	// active rules
	defaultCorrectionRules: ['numericOnly'], 
	correctionRules: [], // opportunity for container to add rules
	_addCorrectionRules: function() {
		var self = this;
		var adding = self.get('correctionRules') || [];
		var activeCorrections = self.get('activeCorrections');
		adding = typeOf(adding) === 'string' ? adding.split(',') : adding;
		if(!isEmpty(this.get('defaultCorrectionRules'))) {
			adding = adding.concat(this.get('defaultCorrectionRules'));
		}
		adding.forEach(function(correction) {
			// correction is either an object which means it's really an external rule definition
			// or its a string which is a reference to the internal rules
			if(typeOf(correction) === 'string') {
				// INTERNAL RULE
				var libraryItem = self.get('correctionLibrary').findBy('id',correction);
				if(isEmpty(libraryItem)) {
					console.warn('Couldn\'t find correction rule "%s"', correction);
				} else {
					self.set('activeCorrections', self.get('activeCorrections').concat(libraryItem));
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
					self.set('activeCorrections', activeCorrections.addObject(correction));
				}
			} else {
				// UNKNOWN
				console.warn('Correction rule "%s" is not formatted correctly', correction);
			}
		});
	}.on('didInsertElement'),
	correctionLibrary: [
		{
			id:'numericOnly',
			event: 'keyDown',
			emphasis: null,
			rule: function(context,event) {
				var keyCode = event.keyCode;
				var validControlCodes = context.get('_KEYBOARD.controlKeys');
				var numericKeys = context.get('_KEYBOARD.numericKeys');
				var keyCombos = context.get('_KEYBOARD.keyCombos');
				if(numericKeys.concat(validControlCodes).contains(keyCode) || keyCombos(event)) {
					return true;
				} else {
					context.addMessageQueue('Only numeric characters are allowed.', {expiry: 2000, type: 'warning'});
					return false;
				}
			} 
		},
		{
			id:'min',
			event: 'focusOut',
			emphasis: 'danger',
			rule: function(context,event) {
				var min = context.get('min');
				var value = context.get('value');
				if(min !== null && value < min) {
					context.set('value',min);
					context.addMessageQueue('Minimum value of %@ was surpassed, resetting to minimum.'.fmt(context.get('min')), {expiry: 2000, type: 'warning'});
					return false;
				} else {
					return true;
				}
			} 
		},
		{
			id:'max',
			event: 'focusOut',
			emphasis: 'danger',
			rule: function(context,event) {
				var max = context.get('max');
				var value = context.get('value');
				if(max !== null && value > max) {
					context.set('value',max);
					context.addMessageQueue('Maximum value of %@ was surpassed, resetting to maximum.'.fmt(context.get('max')), {expiry: 2000, type: 'warning'});
					return false;
				} else {
					return true;
				}
			} 
		},
		{
			id:'stepUp',
			event: 'focusOut',
			emphasis: 'danger',
			rule: function(context,event) {
				var step = Number(context.get('step'));
				var value = Number(context.get('value')) || 0;
				var max = Number(context.get('max'));
				var modulus = value % step;
				if(step !== null && modulus !== 0) {
					if(max && value + (step - modulus) > max) {
						// Can not step UP if that violates max amount
						context.set('value', value - modulus);
						context.addMessageQueue('Value must be a multiple of %@ while maintaining a maximum of %@; upjusted value from %@ to %@.'.fmt(step,max,value,context.get('value')), {expiry: 2000, type: 'warning'});
					} else {
						// Step up
						context.set('value', value + (step - modulus));
						context.addMessageQueue('Value must be a multiple of %@, upjusted value from %@ to %@.'.fmt(step,value,context.get('value')), {expiry: 2000, type: 'warning'});
					}
					return false;
				} else {
					return true;
				}
			} 
		},
		{
			id:'stepDown',
			event: 'focusOut',
			emphasis: 'danger',
			rule: function(context,event) {
				var step = Number(context.get('step'));
				var value = Number(context.get('value')) || 0;
				var min = Number(context.get('min'));
				var modulus = value % step;
				if(step !== null && modulus !== 0) {
					if(min && (value - modulus) < min) {
						// Can not step DOWN if that violates min amount
						context.set('value', value + (step - modulus));
						context.addMessageQueue('Value must be a multiple of %@ while maintaining a minimum of %@; upjusted value from %@ to %@.'.fmt(step,min,value,context.get('value')), {expiry: 2000, type: 'warning'});
					} else {
						// Step up
						context.set('value', value - modulus);
						var message = 'Value must be a multiple of %@, upjusted value from %@ down to %@.'.fmt(step,value,context.get('value'));
						context.sendAction('correctionRule', message, context);
						context.addMessageQueue(message, {expiry: 2000, type: 'warning'});
					}
					return false;
				} else {
					return true;
				}
			} 
		},
	],
	// REFERENCE VARIABLES
	_KEYBOARD: {
		controlKeys: [8,9,27,36,37,39,38,40,46], // 8:delete, 9:tab, 27: escape, 36:home, 37:left, 39:right, 38:up, 40:down, 46: backspace
		numericKeys: [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,187,189], // 48-57 are standard, 96-105 are numpad numeric keys, - and + symbols are 187/189
		modifierKeys: [16,17,18], // 16: shift, 17: cntrl, 18: alt
		// allows checking of key combinations; by default just checks 
		// for ctrl-A/cmd-A but options array allows setting what is allowed
		keyCombos: function(evt, options) {
			options = options || {};
			var isAcceptable = false;
			var config = [
				{ id: 'ctrlKey', value: options.ctrlKey || [65] }, // ctrl-A
				{ id: 'shiftKey', value: options.shiftKey || [] },
				{ id: 'metaKey', value: options.metaKey || [65,82] }, // 65: cmd/win-A, cmd/win-R
				{ id: 'altKey', value: options.altKey || [] },
			];
			config.forEach(function(item) {
				if (evt[item.id]) {
					if (item.value.contains(evt.keyCode)) {
						isAcceptable = true;
					}
				}
			});
			
			return isAcceptable;
		} 
	}
});
