import Ember from 'ember';
var isEmpty = Ember.isEmpty;
var typeOf = Ember.typeOf;

import InputStatusMixin from '../mixins/input-status';
import InputCorrectionMixin from '../mixins/input-correction';
import UiEventListenerMixin from '../mixins/ui-event-listener';

export default Ember.TextField.extend(InputStatusMixin,InputCorrectionMixin,UiEventListenerMixin,{
	classNames: ['ui-number-input'],
	classNameBindings: ['bsFormControl', 'sizeClass', 'statusClass', 'alignClass','statusVisualize:visualize','showSpinners::hide-spinners', 'visualStyleClass'],
	attributeBindings: ['type','minAttr','maxAttr','step','visualStyleStyle:style'],
	pattern: '[0-9]*',
	showSpinners: false,
	type: 'number',
	bs: true,
	bsFormControl: function() {
		return this.get('bs') ? 'form-control' : false;
	}.property('bs'),
	inputSize: 'default',
	sizeClass: function() {
		var size = this.get('inputSize');
		if(['lg','large'].contains(size)) {
			return 'input-lg';
		} else if(['sm','small'].contains(size)) {
			return 'input-sm';
		} else {
			return false;
		}
	}.property('inputSize'),
	min: null,
	max: null,
	step: null,
	align: null, // values are left/right/center
	alignClass: function() {
		var align = this.get('align');
		if(!align) {
			align='left';
		}
		return 'align-text-%@'.fmt(align);
	}.property('align'),
	// EVENT HANDLING
	focusOut: function(evt) {
		return this.processCorrections('focusOut',evt);
	},
	keyDown: function(evt) {
		return this.processCorrections('keyDown',evt);
	},
	// MIXIN CONFIG
	defaultCorrectionRules: ['numericOnly'],
	emphasize: function(animationType) {
		// this.set('animationClass', animationType);
		var self = this;
		if (!isEmpty(animationType)) {
			this.$().addClass('%@ animated'.fmt(animationType)).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				self.$().removeClass('%@ animated'.fmt(animationType));
			});
		}
	},
	// VISUAL STYLE
	visualStyle: null,
	visualStyleClass: function() { // class adjustments
		var style = this.get('visualStyle') || '';
		if (style.indexOf('square') > -1) {
			if(!this.get('align')) {
				this.set('align', 'center');
			}
			return style;
		} else {
			return null;
		}
	}.property('visualStyle'),
	// direct style adjustments
	visualStyleStyle: function() {
		var style = this.get('visualStyle') || '';
		if (style.indexOf('square') > -1) {
			var height = Number(this.get('_componentWidth')) - 30;
			var fontSize = height / 35;
			return 'height: %@px; font-size: %@em;'.fmt(height, fontSize);
		} else {
			return null;
		}
	}.property('visualStyle','_componentWidth'),
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

});
