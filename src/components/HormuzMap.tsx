"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const blockadeIcon = new L.DivIcon({
  html: '<div style="background:#ff3b3b;width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,59,59,0.3);box-shadow:0 0 12px rgba(255,59,59,0.5);"></div>',
  className: "",
  iconSize: [12, 12],
});

const shipIcon = new L.DivIcon({
  html: '<div style="background:#4c8dff;width:8px;height:8px;border-radius:50%;border:2px solid rgba(76,141,255,0.3);box-shadow:0 0 8px rgba(76,141,255,0.4);"></div>',
  className: "",
  iconSize: [8, 8],
});

const waitingShips = [
  { lat: 24.5, lng: 58.8, name: "Tanker Group A - Waiting" },
  { lat: 24.2, lng: 59.1, name: "Tanker Group B - Waiting" },
  { lat: 24.8, lng: 59.5, name: "Tanker Group C - Waiting" },
  { lat: 23.9, lng: 58.5, name: "Cargo Vessels - Anchored" },
];

const blockadePoints = [
  { lat: 26.6, lng: 56.2, name: "IRGC Naval Position Alpha" },
  { lat: 26.4, lng: 56.4, name: "Mine Field Zone" },
  { lat: 26.3, lng: 56.6, name: "IRGC Fast Attack Boats" },
  { lat: 26.7, lng: 56.0, name: "Anti-Ship Missile Battery" },
];

const reroutePath: [number, number][] = [
  [24.5, 58.8],
  [22.0, 60.0],
  [15.0, 55.0],
  [10.0, 50.0],
  [2.0, 45.0],
  [-5.0, 40.0],
  [-15.0, 35.0],
  [-34.0, 18.5],
];

export default function HormuzMap() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Strait of Hormuz — Live Overview</h3>
          <p className="text-[11px] text-muted mt-0.5">Ship positions, blockade zones, and reroute paths</p>
        </div>
        <div className="flex items-center gap-5 text-[10px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-red shadow-sm shadow-accent-red/50" /> Blockade
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-blue shadow-sm shadow-accent-blue/50" /> Ships
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-amber shadow-sm shadow-accent-amber/50" /> Reroute
          </span>
        </div>
      </div>
      <MapContainer
        center={[26.0, 56.0]}
        zoom={6}
        style={{ height: 420 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <Circle
          center={[26.5, 56.3]}
          radius={30000}
          pathOptions={{
            color: "#ff3b3b",
            fillColor: "#ff3b3b",
            fillOpacity: 0.1,
            weight: 1.5,
            dashArray: "6 4",
          }}
        />

        {blockadePoints.map((point) => (
          <Marker key={point.name} position={[point.lat, point.lng]} icon={blockadeIcon}>
            <Popup>
              <span className="text-xs font-bold text-red-600">{point.name}</span>
            </Popup>
          </Marker>
        ))}

        {waitingShips.map((ship) => (
          <Marker key={ship.name} position={[ship.lat, ship.lng]} icon={shipIcon}>
            <Popup>
              <span className="text-xs">{ship.name}</span>
            </Popup>
          </Marker>
        ))}

        <Polyline
          positions={reroutePath}
          pathOptions={{ color: "#ffb800", weight: 2, dashArray: "8 6", opacity: 0.7 }}
        />
      </MapContainer>
    </div>
  );
}
