'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
// TypeScript may complain about importing CSS without type declarations in this project setup
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, Crosshair, Filter } from 'lucide-react';

// Fix for default markers
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
}

interface Crime {
  id: string;
  title: string;        // ✅ Fixed - removed 'zz'
  description: string;
  latitude: number;
  longitude: number;
  severity: string;
  status: string;
  date: string;
  category: string;
}

interface CrimeMapProps {
  crimes?: Crime[];
  center?: [number, number];
  zoom?: number;
}

// Custom marker icons by severity
const getMarkerIcon = (severity: string) => {
  const colors = {
    CRITICAL: '#ef4444',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#22c55e',
  };
  
  const color = colors[severity as keyof typeof colors] || '#3b82f6';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        animation: pulse 1.5s ease-in-out infinite;
      ">
        <div style="
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 50%;
          border: 2px solid ${color};
          opacity: 0.6;
          animation: ripple 1.5s ease-in-out infinite;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function CrimeMap({ crimes = [], center = [28.6139, 77.2090], zoom = 13 }: CrimeMapProps) {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tileLayers = {
    street: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const filteredCrimes = filter === 'all' 
    ? crimes 
    : crimes.filter(crime => crime.severity === filter);

  if (!isMounted) {
    return (
      <div className="h-[600px] w-full rounded-xl overflow-hidden bg-black/50 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
          className="glass p-2 rounded-lg"
        >
          <Layers className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`glass p-2 rounded-lg ${showHeatmap ? 'bg-red-500' : ''}`}
        >
          <Map className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="glass p-2 rounded-lg"
          onClick={() => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition((pos) => {
                // Center map on user location
              });
            }
          }}
        >
          <Crosshair className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Filter Bar */}
      <div className="absolute top-4 left-4 z-10 glass rounded-lg p-2">
        <div className="flex gap-2">
          {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
            <motion.button
              key={severity}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(severity)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filter === severity 
                  ? 'bg-red-500 text-white' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {severity === 'all' ? 'All' : severity}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[600px] w-full rounded-xl overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url={tileLayers[mapType]}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          
          <MapController center={center} />
          
          {filteredCrimes.map((crime) => (
            <div key={crime.id}>
              <Marker
                position={[crime.latitude, crime.longitude]}
                icon={getMarkerIcon(crime.severity)}
                eventHandlers={{
                  click: () => setSelectedCrime(crime),
                }}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-gray-900">{crime.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{crime.description}</p>
                    <div className="mt-2 flex gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        crime.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                        crime.status === 'INVESTIGATING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {crime.status}
                      </span>
                      <span className="text-gray-500">
                        {new Date(crime.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              <Circle
                center={[crime.latitude, crime.longitude]}
                radius={crime.severity === 'CRITICAL' ? 500 : crime.severity === 'HIGH' ? 300 : 150}
                pathOptions={{
                  color: crime.severity === 'CRITICAL' ? '#ef4444' : 
                         crime.severity === 'HIGH' ? '#f97316' :
                         crime.severity === 'MEDIUM' ? '#eab308' : '#22c55e',
                  fillColor: crime.severity === 'CRITICAL' ? '#ef4444' : 
                             crime.severity === 'HIGH' ? '#f97316' :
                             crime.severity === 'MEDIUM' ? '#eab308' : '#22c55e',
                  fillOpacity: 0.2,
                }}
              />
            </div>
          ))}
        </MapContainer>
      </div>

      {/* Selected Crime Sidebar */}
      <AnimatePresence>
        {selectedCrime && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 h-full w-96 glass p-6 z-20 shadow-2xl overflow-y-auto"
          >
            <button
              onClick={() => setSelectedCrime(null)}
              className="absolute top-4 right-4 text-white hover:text-red-400"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4 pr-8">{selectedCrime.title}</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Category</p>
                <p className="text-white">{selectedCrime.category}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Severity</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                  selectedCrime.severity === 'CRITICAL' ? 'bg-red-500' :
                  selectedCrime.severity === 'HIGH' ? 'bg-orange-500' :
                  selectedCrime.severity === 'MEDIUM' ? 'bg-yellow-500' :
                  'bg-green-500'
                } text-white`}>
                  {selectedCrime.severity}
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white">{selectedCrime.status}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white">{new Date(selectedCrime.date).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-white text-sm">{selectedCrime.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        .leaflet-container {
          background: #0a0a0a;
        }
      `}</style>
    </div>
  );
}