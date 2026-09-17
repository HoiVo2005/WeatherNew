"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { type LeafletMouseEvent } from "leaflet";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type WeatherMapProps = {
  coordinates: Coordinates;
  locationName: string;
  onSelectLocation: (coordinates: Coordinates) => void;
};

const markerIcon = L.divIcon({
  className: "weather-map-marker",
  html: `
    <div class="weather-map-marker-inner">
      <span></span>
    </div>
  `,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -40],
});

function MapClickHandler({
  onSelectLocation,
}: {
  onSelectLocation: (coordinates: Coordinates) => void;
}) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onSelectLocation({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function RecenterMap({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(
      [coordinates.latitude, coordinates.longitude],
      Math.max(map.getZoom(), 8),
      {
        duration: 1.2,
      },
    );
  }, [coordinates, map]);

  return null;
}

export default function WeatherMap({
  coordinates,
  locationName,
  onSelectLocation,
}: WeatherMapProps) {
  const [layer, setLayer] = useState<"street" | "topo" | "dark">("street");
  const [showRadar, setShowRadar] = useState(false);
  const [radarPath, setRadarPath] = useState<string | null>(null);

  useEffect(() => {
    if (!showRadar || radarPath) return;

    let cancelled = false;

    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((response) => response.json())
      .then((data: {
        data?: {
          radar?: {
            past?: Array<{ path?: string; time?: number }>;
            nowcast?: Array<{ path?: string; time?: number }>;
          };
        };
      }) => {
        if (cancelled) return;
        const frames = [
          ...(data?.data?.radar?.past ?? []),
          ...(data?.data?.radar?.nowcast ?? []),
        ].filter((frame) => typeof frame.path === "string");
        const latest = frames[frames.length - 1];
        if (latest?.path) setRadarPath(latest.path);
      })
      .catch(() => {
        // Radar unavailable — ignore
      });

    return () => {
      cancelled = true;
    };
  }, [showRadar, radarPath]);

  const tile = useMemo(() => {
    if (layer === "topo") {
      return {
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution: '&copy; OpenStreetMap contributors, SRTM | OpenTopoMap',
      };
    }

    if (layer === "dark") {
      return {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      };
    }

    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors',
    };
  }, [layer]);

  return (
    <div className="weather-map-container">
      <MapContainer
        key={layer}
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={8}
        scrollWheelZoom
        className="weather-map"
      >
        <TileLayer attribution={tile.attribution} url={tile.url} />

        {showRadar && radarPath && (
          <TileLayer
            url={`https://tilecache.rainviewer.com${radarPath}/256/{z}/{x}/{y}/2/1_1.png`}
            opacity={0.7}
            zIndex={400}
          />
        )}

        <Marker
          position={[coordinates.latitude, coordinates.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <strong>{locationName}</strong>
            <br />
            {coordinates.latitude.toFixed(4)},{" "}
            {coordinates.longitude.toFixed(4)}
          </Popup>
        </Marker>

        <MapClickHandler onSelectLocation={onSelectLocation} />
        <RecenterMap coordinates={coordinates} />
      </MapContainer>

      <div className="map-layer-switcher">
        <button className={layer === "street" ? "active" : ""} onClick={() => setLayer("street")}>
          Phố
        </button>
        <button className={layer === "topo" ? "active" : ""} onClick={() => setLayer("topo")}>
          Địa hình
        </button>
        <button className={layer === "dark" ? "active" : ""} onClick={() => setLayer("dark")}>
          Tối
        </button>
        <button
          className={showRadar ? "active" : ""}
          onClick={() => setShowRadar((previous) => !previous)}
          title="Radar mưa (RainViewer)"
        >
          Mưa
        </button>
      </div>

      <div className="map-help">
        Nhấn vào một vị trí trên bản đồ để xem thời tiết
      </div>
    </div>
  );
}