import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('map', { path: '/' });
  this.route('states', function() {
    this.route('show', { path: ':state_name'}, function() {
      this.route('trails', function() {
        this.route('show', { path: ':id' });
      });
    });
  });

});

export default Router;
