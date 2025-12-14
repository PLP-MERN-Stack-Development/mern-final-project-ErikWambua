import React, { useEffect, useRef } from 'react';
import { Popup } from 'react-map-gl';
import { Users, Navigation, Clock, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const VehicleMarker = ({ map, trip, onClick }) => {
  const markerRef = useRef(null);
  const { t, formatCurrency } = useLanguage();

  useEffect(() => {
    if (!map || !markerRef.current) return;

    const marker = markerRef.current;
    
    // Create popup
    const popup = new Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: 'bottom',
      offset: 25,
    })
      .setLngLat([trip.location.lng, trip.location.lat])
      .setHTML(`
        <div class="p-3 min-w-[200px]">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-gray-900">${trip.route?.name || 'Route'}</span>
            <span class="text-sm ${trip.capacity === 14 ? 'text-red-600' : trip.capacity >= 7 ? 'text-yellow-600' : 'text-green-600'}">
              ${trip.capacity === 14 ? 'FULL' : `${trip.capacity}/14`}
            </span>
          </div>
          <div class="text-sm text-gray-600">
            <div class="flex items-center mb-1">
              <span class="mr-2">👤</span>
              <span>${trip.driver?.name || 'Driver'}</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">🚌</span>
              <span>${trip.vehicle?.registration || 'Vehicle'}</span>
            </div>
          </div>
        </div>
      `);

    // Add click handler
    marker.addEventListener('click', () => {
      if (onClick) onClick(trip);
    });

    // Show popup on hover
    marker.addEventListener('mouseenter', () => {
      popup.addTo(map);
    });

    marker.addEventListener('mouseleave', () => {
      popup.remove();
    });

    return () => {
      marker.removeEventListener('click', onClick);
      marker.removeEventListener('mouseenter', () => {});
      marker.removeEventListener('mouseleave', () => {});
      popup.remove();
    };
  }, [map, trip, onClick]);

  const getMarkerColor = () => {
    if (trip.capacity === 14) return 'bg-red-500'; // Full
    if (trip.capacity >= 7) return 'bg-yellow-500'; // Half full
    return 'bg-green-500'; // Empty
  };

  const getVehicleIcon = () => {
    if (trip.capacity === 14) return '🚌'; // Full bus
    if (trip.capacity >= 7) return '🚐'; // Half full minibus
    return '🚗'; // Empty
  };

  return (
    <div
      ref={markerRef}
      className={`vehicle-marker ${getMarkerColor()} ${trip.capacity === 14 ? 'animate-vibrate' : 'animate-drive'}`}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: trip.capacity === 14 ? 1000 : 100,
        '--rotation': `${trip.heading || 0}deg`,
      }}
      data-lng={trip.location.lng}
      data-lat={trip.location.lat}
    >
      <div className="relative">
        <div className="text-xl">{getVehicleIcon()}</div>
        {trip.capacity === 14 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            FULL
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 bg-white text-gray-800 text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
          {trip.capacity}/14
        </div>
      </div>
    </div>
  );
};

export default VehicleMarker;