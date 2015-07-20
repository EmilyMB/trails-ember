import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('trail', {state: params.state_name});
  }
});
