'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PlaceAndReviewsDetails, User } from '@/lib/types';
import { CircleMarker } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface UserMapProps {
  user: User;
  placeAndReviewsDetails: PlaceAndReviewsDetails;
}

const mockCoordinates: [number, number] = [40.7128, -74.006];

export default function ReviewsMap({ user, placeAndReviewsDetails }: UserMapProps) {
  const [isLocated, setIsLocated] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>(); // Default NYC coordinates

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

  if (!isLocated) {
    return (
      <div className="w-full h-96 bg-base-200 rounded-lg animate-pulse flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's current location marker */}
        <CircleMarker center={userLocation as [number, number]} radius={5} color="blue" fillColor="white">
          <Popup>
            <div className="text-center">
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-base-content/70">Your Location</div>
              <div className="text-xs text-base-content/50">@{user.username}</div>
            </div>
          </Popup>
        </CircleMarker>

        {/* Markers for reviewed places from followed users */}
        {Object.values(placeAndReviewsDetails).map(({ place, visited, count }) => {
          return (
            <Marker key={`${place.id}`} position={place.coordinates}>
              <Popup>
                <div className="max-w-xs">
                  <div className="font-semibold">{place.name}</div>
                  <div className="text-sm text-base-content/70 mb-2">{place.address}</div>
                  <div className="text-sm">
                    {visited ? (
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-500">★</span> Visited!
                      </div>
                    ) : null}
                    <div className="text-xs text-base-content/50">{count === 1 ? '1 review' : `${count} reviews`}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
