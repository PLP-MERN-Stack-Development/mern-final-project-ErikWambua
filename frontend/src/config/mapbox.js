// Mapbox configuration

// Mapbox Access Token
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoibWF0cHVsc2UyNTQiLCJhIjoiY2x3MXh5ejB3MGE1eTJpczJwNjR4MnRrZiJ9.example';

// Map Styles
export const MAP_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v12',
  navigation: 'mapbox://styles/mapbox/navigation-day-v1',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
};

// Default Map Settings
export const MAP_SETTINGS = {
  style: MAP_STYLES.streets,
  center: [36.8219, -1.2921], // Nairobi [lng, lat]
  zoom: 12,
  minZoom: 10,
  maxZoom: 18,
  pitch: 0,
  bearing: 0,
  attributionControl: true,
  logoPosition: 'bottom-left',
};

// Map Bounds (Nairobi Area)
export const NAIROBI_BOUNDS = {
  north: -1.163,
  south: -1.444,
  east: 37.103,
  west: 36.650,
};

// Popular Locations in Nairobi
export const NAIROBI_LANDMARKS = {
  CBD: { lng: 36.8219, lat: -1.2864, name: 'CBD' },
  Westlands: { lng: 36.8089, lat: -1.2676, name: 'Westlands' },
  Eastleigh: { lng: 36.8470, lat: -1.2758, name: 'Eastleigh' },
  Kibera: { lng: 36.7820, lat: -1.3133, name: 'Kibera' },
  Karen: { lng: 36.6854, lat: -1.3197, name: 'Karen' },
  Ngong: { lng: 36.6525, lat: -1.3524, name: 'Ngong' },
  Thika: { lng: 37.0693, lat: -1.0332, name: 'Thika' },
  Ruiru: { lng: 36.9617, lat: -1.1463, name: 'Ruiru' },
  Embakasi: { lng: 36.8939, lat: -1.3197, name: 'Embakasi' },
  Kasarani: { lng: 36.8982, lat: -1.2196, name: 'Kasarani' },
};

// Route Colors
export const ROUTE_COLORS = {
  active: '#10B981', // matatu-green
  inactive: '#6B7280', // gray
  selected: '#1E40AF', // nairobi-blue
  highlight: '#F7B731', // matatu-yellow
};

// Marker Icons Configuration
export const MARKER_CONFIG = {
  vehicle: {
    color: '#10B981',
    size: 40,
    icon: 'bus',
  },
  stage: {
    color: '#1E40AF',
    size: 30,
    icon: 'location',
  },
  user: {
    color: '#3B82F6',
    size: 20,
    icon: 'circle',
  },
  alert: {
    color: '#EF4444',
    size: 35,
    icon: 'alert',
  },
};

// Layer Configuration
export const LAYER_CONFIG = {
  routes: {
    type: 'line',
    paint: {
      'line-color': '#1E40AF',
      'line-width': 4,
      'line-opacity': 0.8,
    },
  },
  stages: {
    type: 'circle',
    paint: {
      'circle-radius': 8,
      'circle-color': '#1E40AF',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFFFFF',
    },
  },
  vehicles: {
    type: 'symbol',
    layout: {
      'icon-image': 'bus',
      'icon-size': 1,
      'icon-rotate': ['get', 'bearing'],
      'icon-rotation-alignment': 'map',
      'icon-allow-overlap': true,
    },
  },
};

// Animation Settings
export const ANIMATION_CONFIG = {
  duration: 1000, // 1 second
  easing: 'easeInOutCubic',
  essential: true,
};

// Clustering Configuration
export const CLUSTER_CONFIG = {
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50,
  clusterProperties: {
    sum: ['+', ['get', 'value']],
  },
};

// Main Mapbox Configuration Object
export const mapboxConfig = {
  accessToken: MAPBOX_TOKEN,
  ...MAP_SETTINGS,
  styles: MAP_STYLES,
  bounds: NAIROBI_BOUNDS,
  landmarks: NAIROBI_LANDMARKS,
  routeColors: ROUTE_COLORS,
  markers: MARKER_CONFIG,
  layers: LAYER_CONFIG,
  animation: ANIMATION_CONFIG,
  clustering: CLUSTER_CONFIG,
};

export default mapboxConfig;
