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
});
