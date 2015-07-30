/* globals L */

import Ember from 'ember';
let accessToken = 'pk.eyJ1IjoiY2x1aHJpbmciLCJhIjoiNWF2Z1l6ZyJ9.8peAq7kTQyvXShlVv1K82w';
let zoom = 5;

function pointer(trail) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [trail.get('lng'), trail.get('lat')]
    },
    properties: {
      id: trail.get('id'),
      name: trail.get('name'),
      description: trail.get('description') || 'No description available',
      state: trail.get('state')
    }
  };
}

export default Ember.Component.extend({
  map: null,
  classNames: ['state-map'],
  trailClickedAction: 'trailSelected',

  _initializeMap: Ember.on('didInsertElement', function () {

    L.mapbox.accessToken = accessToken;

    let map = L.mapbox.map('state-map', 'emilymb.n10534gb', {
      touchZoom: false,
      scrollWheelZoom: false,
      animate: false
    });
    this.set('map', map);

    let trails = this.get('model');
    let firstTrail = trails.get('firstObject');

    map.setView([firstTrail.get('lat'), firstTrail.get('lng')], zoom);
    this.send('addPoints', trails);
  }),

  actions: {
    addPoints(trails) {
      let points = [];
      trails.forEach((trail) => {
        points.push(pointer(trail));
      });
      this.send('setPoints', points);
    },

    setPoints(points) {
      let onEachFeature = (feature, layer) => {
        layer.on({
          mouseover() {
            let content = `<b>${this.feature.properties.name}</b>`;
            this.bindPopup(content).openPopup();
          },
          mouseout() {
            this.closePopup();
          },
          click: function () {
            this.sendAction('trailClickedAction',
              feature.properties.state, feature.properties.id);
          }.bind(this)
        });
      };

      L.geoJson(points, { onEachFeature }).addTo(this.get('map'));
    }
  }
});
