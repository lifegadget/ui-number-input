/* jshint node: true */
'use strict';

module.exports = {
	name: 'ui-number-input',
	included: function(app) {
		this._super.included(app);

		app.import('vendor/ui-number-input/ui-number-input.css');
	}
};
