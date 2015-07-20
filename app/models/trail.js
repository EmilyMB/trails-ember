import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  lat: DS.attr('number'),
  lng: DS.attr('number'),
  length: DS.attr('string')
});
