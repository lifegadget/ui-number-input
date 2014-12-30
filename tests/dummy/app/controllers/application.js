import Ember from 'ember';

export default Ember.Controller.extend({

	staticStatus: 'success',
	dynStatus: function(context) {
		var value = Number(context.get('value'));
		if(value > 1) {
			return 'success';
		} else if(value < 0) {
			return 'error';
		} else if(value === 0) {
			return 'warning';
		} else {
			return 'default';
		}
	}
});
