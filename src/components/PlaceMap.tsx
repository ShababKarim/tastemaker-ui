'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Place } from '@/lib/types';
import { CircleMarker } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface PlaceMapProps {
  place: Place;
}

const mockCoordinates: [number, number] = [40.7128, -74.006];

export default function PlaceMap({ place }: PlaceMapProps) {
  const [isLocated, setIsLocated] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>();

  useEffect(() => {
    // Get user's actual location from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User located @ ${[latitude, longitude]}`);
          setUserLocation(mockCoordinates);
          setIsLocated(true);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
      );
    }
  }, []);

  const handleMapClick = () => {
    // Open Google Maps with route from user location to destination
    if (userLocation && place.coordinates) {
      const [userLat, userLng] = userLocation;
      const [destLat, destLng] = place.coordinates;

      const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  if (!isLocated) {
    return (
      <div className="w-full h-96 bg-base-200 rounded-lg animate-pulse flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Calculate center point between user and place
  const centerLat = (userLocation![0] + place.coordinates[0]) / 2;
  const centerLng = (userLocation![1] + place.coordinates[1]) / 2;
  const center: [number, number] = [centerLat, centerLng];

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={handleMapClick}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's current location marker */}
        <CircleMarker center={userLocation as [number, number]} radius={5} color="blue" fillColor="white">
          <Popup>
            <div className="text-center">
              <div className="font-semibold">Your Location</div>
              <div className="text-sm text-base-content/70">Starting point</div>
            </div>
          </Popup>
        </CircleMarker>

        {/* Place location marker */}
        <Marker position={place.coordinates}>
          <Popup>
            <div className="max-w-xs">
              <div className="font-semibold">{place.name}</div>
              <div className="text-sm text-base-content/70 mb-2">{place.address}</div>
              <div className="text-xs text-base-content/50 italic">Click map to get directions</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
