"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { GlassCard } from "@/components/ui/glass-card";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";
import type { NearbyProvider } from "@/types/database";
import Link from "next/link";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "20px",
};

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8892b0" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2d2d4e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e0e1a" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
];

interface MapProvider extends NearbyProvider {
  lat?: number;
  lng?: number;
}

interface ProviderMapProps {
  providers: MapProvider[];
  center: { lat: number; lng: number };
  className?: string;
}

export function ProviderMap({ providers, center, className }: ProviderMapProps) {
  const [selectedProvider, setSelectedProvider] = useState<MapProvider | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    // Map loaded
  }, []);

  if (loadError) {
    return (
      <GlassCard hoverable={false} className={className}>
        <div className="h-[400px] flex items-center justify-center text-[var(--color-text-muted)]">
          Failed to load Google Maps
        </div>
      </GlassCard>
    );
  }

  if (!isLoaded) {
    return (
      <div className={className}>
        <div className="h-[400px] skeleton rounded-2xl" />
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        options={{
          styles: darkMapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {/* User location marker */}
        <MarkerF
          position={center}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#6366f1",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          }}
        />

        {/* Provider markers */}
        {providers.map((provider) => {
          if (!provider.lat || !provider.lng) return null;
          return (
            <MarkerF
              key={provider.provider_id}
              position={{ lat: provider.lat, lng: provider.lng }}
              onClick={() => setSelectedProvider(provider)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#06b6d4",
                fillOpacity: 0.9,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          );
        })}

        {/* Info Window */}
        {selectedProvider && selectedProvider.lat && selectedProvider.lng && (
          <InfoWindowF
            position={{
              lat: selectedProvider.lat,
              lng: selectedProvider.lng,
            }}
            onCloseClick={() => setSelectedProvider(null)}
          >
            <div className="bg-[#12122a] p-3 rounded-lg min-w-[200px]">
              <Link href={`/customer/providers/${selectedProvider.provider_id}`}>
                <h3 className="font-semibold text-white text-sm mb-1">
                  {selectedProvider.full_name}
                </h3>
                {selectedProvider.headline && (
                  <p className="text-xs text-gray-400 mb-2">{selectedProvider.headline}</p>
                )}
                <div className="flex items-center justify-between">
                  <StarRating rating={selectedProvider.rating_avg} size="sm" />
                  <span className="text-xs font-bold text-[#818cf8]">
                    {formatCurrency(selectedProvider.hourly_rate)}/hr
                  </span>
                </div>
              </Link>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
