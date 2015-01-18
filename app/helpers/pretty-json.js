import Ember from 'ember';

export function json(input) {
  return JSON.stringify(input);
}

export default Ember.Handlebars.makeBoundHelper(json);
