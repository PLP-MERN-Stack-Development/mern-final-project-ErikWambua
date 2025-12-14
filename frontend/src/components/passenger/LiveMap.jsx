import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSocket } from '../../hooks/useSocket';
import VehicleMarker from './VehicleMarker';
import './MapboxOverrides.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const LiveMap = ({ route, center = [-1.286389, 36.817223] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom] = useState(12);
  const [trips, setTrips] = useState([]);
  const { socket } = useSocket();

  // Initialize map
  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));

    // Cleanup
    return () => map.current?.remove();
  }, []);

  // Listen for real-time trip updates
  useEffect(() => {
    if (!socket || !route) return;

    // Join route room
    socket.emit('join-route', route._id);

    // Listen for trip updates
    socket.on('trip-update', (tripData) => {
      setTrips(prev => {
        const existingIndex = prev.findIndex(t => t._id === tripData._id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = tripData;
          return updated;
        } else {
          return [...prev, tripData];
        }
      });
    });

    // Listen for trip ended
    socket.on('trip-ended', (tripId) => {
      setTrips(prev => prev.filter(t => t._id !== tripId));
    });

    return () => {
      socket.off('trip-update');
      socket.off('trip-ended');
      socket.emit('leave-route', route._id);
    };
  }, [socket, route]);

  // Draw route on map
  useEffect(() => {
    if (!map.current || !route?.path) return;

    if (map.current.getSource('route')) {
      map.current.getSource('route').setData(route.path);
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: route.path
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#006600',
          'line-width': 4,
          'line-opacity': 0.7
        }
      });

      // Fit bounds to route
      const bounds = new mapboxgl.LngLatBounds();
      route.path.geometry.coordinates.forEach(coord => {
        bounds.extend(coord);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [route]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Render vehicle markers */}
      {trips.map(trip => (
        <VehicleMarker
          key={trip._id}
          map={map.current}
          trip={trip}
        />
      ))}
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Empty</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Half Full</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Full</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;