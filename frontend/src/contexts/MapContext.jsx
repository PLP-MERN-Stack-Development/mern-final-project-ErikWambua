import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const MapContext = createContext();

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within MapProvider');
  }
  return context;
};

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [visibleVehicles, setVisibleVehicles] = useState([]);
  const [mapCenter, setMapCenter] = useState([36.8219, -1.2921]); // Nairobi default
  const [mapZoom, setMapZoom] = useState(13);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const mapRef = useRef(null);

  const flyTo = useCallback((coordinates, zoom = 15) => {
    if (map) {
      map.flyTo({
        center: coordinates,
        zoom: zoom,
        duration: 1000
      });
    }
  }, [map]);

  const fitBounds = useCallback((bounds, padding = 50) => {
    if (map) {
      map.fitBounds(bounds, {
        padding: padding,
        duration: 1000
      });
    }
  }, [map]);

  const toggleFollowUser = useCallback(() => {
    setIsFollowingUser(prev => !prev);
    if (!isFollowingUser && userLocation) {
      flyTo(userLocation.coordinates);
    }
  }, [isFollowingUser, userLocation, flyTo]);

  const addMarker = useCallback((id, coordinates, options = {}) => {
    if (!map) return null;
    
    const marker = new window.mapboxgl.Marker(options)
      .setLngLat(coordinates)
      .addTo(map);
    
    return marker;
  }, [map]);

  const removeMarker = useCallback((marker) => {
    if (marker) {
      marker.remove();
    }
  }, []);

  const updateVehicleLocation = useCallback((vehicleId, location) => {
    setVisibleVehicles(prev => {
      const existing = prev.find(v => v.id === vehicleId);
      if (existing) {
        return prev.map(v => 
          v.id === vehicleId 
            ? { ...v, location, lastUpdate: new Date() }
            : v
        );
      } else {
        return [...prev, { id: vehicleId, location, lastUpdate: new Date() }];
      }
    });
  }, []);

  const clearVehicles = useCallback(() => {
    setVisibleVehicles([]);
  }, []);

  const value = {
    map,
    setMap,
    mapRef,
    userLocation,
    setUserLocation,
    selectedRoute,
    setSelectedRoute,
    selectedTrip,
    setSelectedTrip,
    visibleVehicles,
    setVisibleVehicles,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    isFollowingUser,
    toggleFollowUser,
    mapStyle,
    setMapStyle,
    flyTo,
    fitBounds,
    addMarker,
    removeMarker,
    updateVehicleLocation,
    clearVehicles
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
