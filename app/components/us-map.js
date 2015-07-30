/* globals L */

import Ember from 'ember';
import UsStates from 'trails-ember/lib/data/us-states';
let accessToken = 'pk.eyJ1IjoiY2x1aHJpbmciLCJhIjoiNWF2Z1l6ZyJ9.8peAq7kTQyvXShlVv1K82w';
let states = UsStates["usStates"];
let info = L.control();
let legend = L.control({position: 'bottomright'});
let breakpoints = [0, 50, 100, 200, 500, 1000];

function getColor(d) {
  return d >= 1000 ? '#54278f' :
         d >= 500  ? '#756bb1' :
         d >= 200  ? '#9e9ac8' :
         d >= 100  ? '#bcbddc' :
         d >= 50   ? '#dadaeb' :
                     '#f2f0f7';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.tot_trails),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 1
  };
}

function highlightFeature(e) {
  let layer = e.target;
  info.update(layer.feature.properties);
  layer.setStyle({
    weight: 2.5,
    color: '#444'
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'info legend');

  div.innerHTML = '<b>Number of Trails</b></br>';

  for (let i = 0; i < breakpoints.length; i++) {
    let grade = breakpoints[i];
    let nextGrade = breakpoints[i+1];
    let color = getColor(grade);
    let rangeEnd = nextGrade ? `-${nextGrade - 1}` : `+`;
    let colorSwatch = `<i style="background: ${color}"></i>`;
    div.innerHTML += `${colorSwatch}${grade}${rangeEnd}</br>`;
  }

  return div;
};

info.update = function (props) {
  this._div.innerHTML = props ?
    `<b>${props.name}</b></br> ${props.tot_trails} trails` :
    '<b>Hover for info</b>';
};

info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

export default Ember.Component.extend({

  map: null,
  classNames: ['us-map'],
  stateClickedAction: 'stateSelected',

  _initializeMap: Ember.on('didInsertElement', function () {
    L.mapbox.accessToken = accessToken;

    let map = L.mapbox.map('map', 'cluhring.9d2c52ea');
    this.set('map', map);

    let onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function (e) {
          this.sendAction('stateClickedAction', feature.properties.name);
        }.bind(this)
      });
    };

    let geojson = L.geoJson(states, {
      style,
      onEachFeature
    });

    function resetHighlight(e) {
      info.update();
      geojson.resetStyle(e.target);
    }

    geojson.addTo(map);
    info.addTo(map);
    legend.addTo(map);
  })
});
