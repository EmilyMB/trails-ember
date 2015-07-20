/* globals L */

import Ember from 'ember';
const accessToken = 'pk.eyJ1IjoibHlkaWFzMzAzIiwiYSI6ImM0WG9rY28ifQ.bM1Nx1fsDmbAFLVP1f9Img';

export default Ember.Component.extend({
  map: null,
  classNames: ['state-map'],
  trailClickedAction: 'trailSelected',

  _initializeMap: Ember.on('didInsertElement', function () {

    L.mapbox.accessToken = accessToken;

    let map = L.mapbox.map('state-map', 'lydias303.4be232dc');
    this.set('map', map);
    this.addPoints();
  }),

  addPoints() {
    const trails = this.get('model');
    trails.forEach(function(trail) {
      this.setPoint(trail);
    }, this);
  },

  setPoint(trail) {
    var point =
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [trail.get('lng'), trail.get('lat')]
        },
        'properties': {
          'id': trail.get('id'),
          'name': trail.get('name'),
          'description': trail.get('description') || 'No description available',
          'state': trail.get('state'),
          'marker-symbol': 'park',
          'marker-color': '#0C5CFE',
          'marker-size': 'small'
        }
      };
    this.get('map').setView([trail.get('lat'), trail.get('lng')], 5);

    let onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: function(layer) {
          let content = `<h2>${this.feature.properties.name}</h2>
            <p>${this.feature.properties.description}</p>`;
          this.bindPopup(content);
          this.openPopup();
        },
        mouseout() {
          this.closePopup();
        },
        click: function (e) {
          this.sendAction('trailClickedAction', feature.properties.state, feature.properties.id);
        }.bind(this)
      });
    };

    L.geoJson(point, {
      onEachFeature: onEachFeature
    }).addTo(this.get('map'));
    // L.mapbox.featureLayer(point).addTo(this.get('map'));
  }
});
