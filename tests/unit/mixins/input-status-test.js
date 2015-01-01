import Ember from 'ember';
import InputStatusMixin from 'ui-number-input/mixins/input-status';

module('InputStatusMixin');

// Replace this with your real tests.
test('it works', function() {
  var InputStatusObject = Ember.Object.extend(InputStatusMixin);
  var subject = InputStatusObject.create();
  ok(subject);
});
