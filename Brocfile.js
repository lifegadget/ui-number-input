/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var app = new EmberAddon();
// Bootstrap just used for Dummy app, not dependency for widget
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/bootstrap/dist/js/bootstrap.js');

app.import('vendor/ui-number-input/ui-number-input.css');
// app.import('dist/assets/vendor.css');

module.exports = app.toTree();
