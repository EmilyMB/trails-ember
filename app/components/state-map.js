/* globals L */

import Ember from 'ember';
const accessToken = 'pk.eyJ1IjoiY2x1aHJpbmciLCJhIjoiNWF2Z1l6ZyJ9.8peAq7kTQyvXShlVv1K82w';
const zoom = 5;

export default Ember.Component.extend({
  map: null,
  classNames: ['state-map'],
  trailClickedAction: 'trailSelected',

  _initializeMap: Ember.on('didInsertElement', function () {

    L.mapbox.accessToken = accessToken;

    let map = L.mapbox.map('state-map', 'emilymb.n10534gb');
    this.set('map', map);
    this.addPoints();
  }),

  addPoints() {
    const trails = this.get('model');
    const firstTrail = trails.get('firstObject');
    this.get('map').setView([firstTrail.get('lat'), firstTrail.get('lng')], zoom);

    trails.forEach(function(trail) {
      this.setPoint(trail);
    }, this);
  },

  pointStyle() {
    return { color: "white" };
  },

  setPoint(trail) {
    let point =
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
          'marker-color': '#0C0',
          'marker-size': 'small'
        }
      };

    let onEachFeature = (feature, layer) => {
      layer.on({
        mouseover() {
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
      style: this.pointStyle,
      onEachFeature: onEachFeature
    }).addTo(this.get('map'));
    // L.mapbox.featureLayer(point).addTo(this.get('map'));
  }
});
