import Ember from 'ember';
var typeOf = Ember.typeOf;

export default Ember.Mixin.create({
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
	statusVisualize: false
});
