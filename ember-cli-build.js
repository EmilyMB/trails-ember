/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });
  app.import('bower_components/mapbox.js/mapbox.js');
  app.import('bower_components/mapbox.js/mapbox.css');

  return app.toTree();
};
