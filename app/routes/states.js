import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    trailSelected(state, trail) {
      this.transitionTo('states.show.trails.show', trail);
    }
  }
});
