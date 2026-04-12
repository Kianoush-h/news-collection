"use client";

import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLiveData } from "@/hooks/useLiveData";

interface ConflictEvent {
  date: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  lat: number;
  lng: number;
}

interface FireHotspot {
  lat: number;
  lng: number;
  brightness: number;
  frp: number;
  date: string;
  time: string;
  confidence: string;
  daynight: string;
}

interface MetaData {
  conflictEvents: ConflictEvent[];
}

interface FiresData {
  fires: FireHotspot[];
}

export default function ConflictMapView() {
  const { data: meta } = useLiveData<MetaData>("/api/meta", 3600000);
  const { data: firesData } = useLiveData<FiresData>("/api/fires", 300000);
  const [showFires, setShowFires] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  const events = meta?.conflictEvents ?? [];
  const fires = firesData?.fires ?? [];

  // Cluster fire data — group nearby hotspots to avoid overwhelming the map
  const clusteredFires = clusterFires(fires, 0.15);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-card-border flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold">Conflict & Thermal Hotspot Map</h3>
          <p className="text-[11px] text-muted mt-0.5">
            {events.length} news events + {fires.length} NASA FIRMS fire detections (24h)
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <button
            onClick={() => setShowFires((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all ${
              showFires
                ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                : "border-card-border text-muted hover:text-foreground"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Fires ({fires.length})
          </button>
          <button
            onClick={() => setShowEvents((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all ${
              showEvents
                ? "border-accent-blue/30 bg-accent-blue/10 text-accent-blue"
                : "border-card-border text-muted hover:text-foreground"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-blue" />
            Events ({events.length})
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2 border-b border-card-border flex items-center gap-5 text-[10px] text-muted flex-wrap">
        {showFires && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400/80 shadow-sm shadow-orange-500/50" /> Low FRP
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" /> High FRP
            </span>
          </>
        )}
        {showEvents && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-red shadow-sm shadow-accent-red/50" /> Critical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-amber shadow-sm shadow-accent-amber/50" /> High
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-blue shadow-sm shadow-accent-blue/50" /> Medium
            </span>
          </>
        )}
        <span className="ml-auto text-[9px] font-mono">
          Satellite: VIIRS SNPP | Updated every 5 min
        </span>
      </div>

      <MapContainer
        center={[30.0, 52.0]}
        zoom={4}
        style={{ height: 550 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Fire hotspots */}
        {showFires &&
          clusteredFires.map((fire, i) => {
            // Color by fire radiative power
            const intensity = Math.min(1, fire.frp / 50);
            const r = Math.round(255);
            const g = Math.round(160 * (1 - intensity));
            const b = Math.round(50 * (1 - intensity));
            const color = `rgb(${r},${g},${b})`;
            const radius = 3 + Math.min(8, fire.frp / 5);

            return (
              <CircleMarker
                key={`fire-${i}`}
                center={[fire.lat, fire.lng]}
                radius={radius}
                pathOptions={{
                  color: "transparent",
                  fillColor: color,
                  fillOpacity: 0.5 + intensity * 0.3,
                  weight: 0,
                }}
              >
                <Tooltip direction="top" offset={[0, -5]}>
                  <span className="text-xs">
                    <strong>Thermal Hotspot</strong>
                    <br />
                    FRP: {fire.frp.toFixed(1)} MW
                    {fire.count > 1 && ` (${fire.count} detections)`}
                    <br />
                    {fire.date} {fire.time}Z
                  </span>
                </Tooltip>
              </CircleMarker>
            );
          })}

        {/* Conflict events */}
        {showEvents &&
          events.map((event, i) => {
            const color =
              event.severity === "critical"
                ? "#ff3b3b"
                : event.severity === "high"
                ? "#ffb800"
                : "#4c8dff";

            const radius =
              event.severity === "critical" ? 12 : event.severity === "high" ? 9 : 7;

            const typeLabel =
              event.type === "strike"
                ? "Military"
                : event.type === "blockade"
                ? "Naval"
                : event.type === "diplomatic"
                ? "Diplomatic"
                : "Economic";

            return (
              <CircleMarker
                key={`event-${i}`}
                center={[event.lat, event.lng]}
                radius={radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.25,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <span className="text-xs font-bold">{event.title}</span>
                  <br />
                  <span className="text-xs text-gray-600">{event.date}</span>
                </Tooltip>
                <Popup>
                  <div className="max-w-xs">
                    <div className="font-bold text-sm">{event.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {event.date} — {typeLabel}
                    </div>
                    <div className="text-xs mt-1">{event.description}</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}

// Cluster nearby fire hotspots to reduce marker count
interface ClusteredFire {
  lat: number;
  lng: number;
  brightness: number;
  frp: number;
  date: string;
  time: string;
  count: number;
}

function clusterFires(fires: FireHotspot[], threshold: number): ClusteredFire[] {
  const clusters: ClusteredFire[] = [];
  const used = new Set<number>();

  for (let i = 0; i < fires.length; i++) {
    if (used.has(i)) continue;
    used.add(i);

    let sumLat = fires[i].lat;
    let sumLng = fires[i].lng;
    let maxFrp = fires[i].frp;
    let maxBrightness = fires[i].brightness;
    let count = 1;
    let bestDate = fires[i].date;
    let bestTime = fires[i].time;

    for (let j = i + 1; j < fires.length; j++) {
      if (used.has(j)) continue;
      const dLat = Math.abs(fires[i].lat - fires[j].lat);
      const dLng = Math.abs(fires[i].lng - fires[j].lng);
      if (dLat < threshold && dLng < threshold) {
        used.add(j);
        sumLat += fires[j].lat;
        sumLng += fires[j].lng;
        if (fires[j].frp > maxFrp) {
          maxFrp = fires[j].frp;
          bestDate = fires[j].date;
          bestTime = fires[j].time;
        }
        maxBrightness = Math.max(maxBrightness, fires[j].brightness);
        count++;
      }
    }

    clusters.push({
      lat: sumLat / count,
      lng: sumLng / count,
      brightness: maxBrightness,
      frp: maxFrp,
      date: bestDate,
      time: bestTime,
      count,
    });
  }

  return clusters;
}
