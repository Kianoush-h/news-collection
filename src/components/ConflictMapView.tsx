"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import { conflictEvents } from "@/lib/mock-data";
import "leaflet/dist/leaflet.css";

export default function ConflictMapView() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Conflict Event Map</h3>
          <p className="text-[11px] text-muted mt-0.5">Click markers for event details</p>
        </div>
        <div className="flex items-center gap-5 text-[10px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-red shadow-sm shadow-accent-red/50" /> Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-amber shadow-sm shadow-accent-amber/50" /> High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-blue shadow-sm shadow-accent-blue/50" /> Medium
          </span>
        </div>
      </div>
      <MapContainer
        center={[30.0, 52.0]}
        zoom={4}
        style={{ height: 500 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {conflictEvents.map((event, i) => {
          const color =
            event.severity === "critical"
              ? "#ff3b3b"
              : event.severity === "high"
              ? "#ffb800"
              : "#4c8dff";

          const radius =
            event.severity === "critical" ? 12 : event.severity === "high" ? 9 : 7;

          return (
            <CircleMarker
              key={i}
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
                  <div className="text-xs text-gray-500 mt-0.5">{event.date}</div>
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
