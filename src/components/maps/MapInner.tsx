'use client';

import React, { useEffect } from 'react';
import {
  MapContainer as LeafletMapContainer,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker,
  Popup as LeafletPopup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Battery, Wifi, Clock, MapPin } from 'lucide-react';
import { Animal, GPSLocation, Sighting } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { TrackingBadge } from '@/components/ui/Badge';

const MapContainer = LeafletMapContainer as any;
const TileLayer = LeafletTileLayer as any;
const Marker = LeafletMarker as any;
const Popup = LeafletPopup as any;

interface MapInnerProps {
  animals?: (Animal & { lastLocation?: GPSLocation })[];
  selectedAnimalId?: string;
  onAnimalSelect?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  showSightings?: boolean;
  sightings?: Sighting[];
  interactive?: boolean;
  className?: string;
}

// Controller to pan smoothly when selection changes
function MapFlyTo({ target }: { target?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 15, { duration: 1.2 });
    }
  }, [map, target]);
  return null;
}

// Create custom DOM markers
function createCollarMarker(animal: Animal, isSelected: boolean) {
  const isDog = animal.species === 'dog';
  const color = isDog ? '#244C3A' : '#D98A55';
  const ringColor = isSelected ? '#17372C' : 'rgba(255,255,255,0.9)';

  const html = `
    <div style="
      position: relative;
      width: ${isSelected ? '38px' : '30px'};
      height: ${isSelected ? '38px' : '30px'};
      background-color: ${color};
      border: 3px solid ${ringColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: ${isSelected ? '12px' : '10px'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: transform 0.2s ease;
    ">
      ${isDog ? '🐕' : '🐈'}
      <span style="
        position: absolute;
        top: -3px;
        right: -3px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: ${
          animal.trackingStatus === 'recently_updated'
            ? '#4CAF50'
            : animal.trackingStatus === 'last_reported'
            ? '#FFC107'
            : '#9E9E9E'
        };
        border: 2px solid white;
      "></span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [isSelected ? 38 : 30, isSelected ? 38 : 30],
    iconAnchor: [isSelected ? 19 : 15, isSelected ? 19 : 15],
  });
}

function createSightingMarker(sighting: Sighting) {
  const isDog = sighting.species === 'dog';
  const html = `
    <div style="
      width: 26px;
      height: 26px;
      background-color: #A9B9A3;
      border: 2px dashed #244C3A;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    ">
      ${isDog ? '🐕' : '🐈'}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-sighting-marker',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export default function MapInner({
  animals = [],
  selectedAnimalId,
  onAnimalSelect,
  center = [22.5726, 88.3639], // Default to Kolkata (Central)
  zoom = 13,
  showSightings = false,
  sightings = [],
  interactive = true,
  className = 'w-full h-full min-h-[480px]',
}: MapInnerProps) {
  // Find selected animal coordinate if available
  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId);
  const targetCoord: [number, number] | undefined =
    selectedAnimal?.lastLocation
      ? [selectedAnimal.lastLocation.latitude, selectedAnimal.lastLocation.longitude]
      : undefined;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/80 ${className}`}>
      <MapContainer
        center={targetCoord || center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        style={{ width: '100%', height: '100%', minHeight: '480px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFlyTo target={targetCoord} />

        {/* Animal Markers */}
        {animals.map((animal) => {
          if (!animal.lastLocation) return null;
          const pos: [number, number] = [
            animal.lastLocation.latitude,
            animal.lastLocation.longitude,
          ];
          const isSelected = animal.id === selectedAnimalId;

          return (
            <Marker
              key={animal.id}
              position={pos}
              icon={createCollarMarker(animal, isSelected)}
              eventHandlers={{
                click: () => onAnimalSelect?.(animal.id),
              }}
            >
              <Popup className="pawtrace-popup" closeButton={true}>
                <div className="w-56 p-1 text-text-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream relative shrink-0">
                      <Image
                        src={
                          animal.primaryPhoto && !animal.primaryPhoto.startsWith('/images/')
                            ? animal.primaryPhoto
                            : animal.species === 'cat'
                            ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200'
                            : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'
                        }
                        alt={animal.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display text-base leading-snug truncate">
                        {animal.name}
                      </h4>
                      <p className="text-[11px] font-mono text-text-secondary">
                        {animal.pawtraceId}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs border-t border-border-light pt-2">
                    <p className="flex items-center gap-1.5 text-text-secondary truncate">
                      <MapPin className="w-3 h-3 text-sage shrink-0" />
                      {animal.locality}
                    </p>
                    <p className="flex items-center gap-1.5 text-text-secondary">
                      <Clock className="w-3 h-3 text-sage shrink-0" />
                      {formatRelativeTime(animal.lastLocation.timestamp)}
                    </p>
                    {animal.lastLocation.batteryLevel !== undefined && (
                      <p className="flex items-center gap-1.5 text-text-secondary">
                        <Battery className="w-3 h-3 text-sage shrink-0" />
                        Collar Battery: {animal.lastLocation.batteryLevel}%
                      </p>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border-light flex items-center justify-between">
                    <TrackingBadge status={animal.trackingStatus} size="sm" />
                    <Link
                      href={`/animals/${animal.id}`}
                      className="text-xs text-forest hover:text-forest-deep font-semibold flex items-center gap-0.5"
                    >
                      Profile <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Community Sightings Markers */}
        {showSightings &&
          sightings.map((sighting) => (
            <Marker
              key={sighting.id}
              position={[sighting.latitude, sighting.longitude]}
              icon={createSightingMarker(sighting)}
            >
              <Popup>
                <div className="w-52 p-1 text-xs space-y-1">
                  <div className="font-semibold text-forest">Community Sighting</div>
                  <p className="text-text-secondary">{sighting.locality}</p>
                  {sighting.notes && <p className="italic text-text-tertiary">"{sighting.notes}"</p>}
                  <p className="text-[10px] text-text-tertiary">
                    {formatRelativeTime(sighting.sightedAt)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
