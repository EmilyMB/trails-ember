import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    stateSelected(selected) {
      this.transitionTo('states.show', selected);
    }
  }
});
