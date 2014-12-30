import Ember from 'ember';
var isEmpty = Ember.isEmpty;

export default Ember.TextField.extend({
	classNames: ['ui-number-input'],
	classNameBindings: ['noNumberControls', 'bsFormControl', 'sizeClass', 'statusClass'],
	attributeBindinds: ['type','minAttr','maxAttr','step'],
	noNumberControls: true,
	type: 'number',
	bs: true,
	bsFormControl: function() {
		return this.get('bs') ? 'form-control' : false;
	}.property('bs'),
	status: 'default',
	statusClass: function() {
		var status = this.get('status');
		if(['error','err'].contains(status)) {
			return 'has-error';
		} else if(['sm','small'].contains(status)) {
			return 'input-sm';
		} else {
			return false;
		}
	}.property('status'),
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
});
