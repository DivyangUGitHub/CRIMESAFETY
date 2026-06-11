'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
// TypeScript may complain about importing CSS without type declarations in this project setup
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Crosshair, 
  Search, 
  Navigation, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Home,
  Building,
  Store,
  School,
  Hospital
} from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLocation?: { lat: number; lng: number };
  radius?: number;
}

interface PlaceSuggestion {
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
}

// Custom marker component
function LocationMarker({ onLocationSelect, position }: any) {
  const [currentPosition, setCurrentPosition] = useState(position);
  
  useMapEvents({
    click(e) {
      setCurrentPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng, `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
    },
  });
  
  return currentPosition ? (
    <Marker position={currentPosition}>
      <Popup>
        <div className="text-center">
          <p className="font-semibold">Selected Location</p>
          <p className="text-sm text-gray-600">
            Lat: {currentPosition.lat.toFixed(6)}<br />
            Lng: {currentPosition.lng.toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

export default function MapPicker({ onLocationSelect, initialLocation, radius = 500 }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [28.6139, 77.2090]
  );
  const [mapZoom, setMapZoom] = useState(13);

  // Common places for quick selection
  const commonPlaces = [
    { icon: Home, name: "Home", color: "from-blue-500 to-cyan-500" },
    { icon: Building, name: "Work", color: "from-purple-500 to-indigo-500" },
    { icon: Store, name: "Market", color: "from-orange-500 to-red-500" },
    { icon: School, name: "School", color: "from-green-500 to-emerald-500" },
    { icon: Hospital, name: "Hospital", color: "from-red-500 to-pink-500" },
  ];

  // Search for places using Nominatim (OpenStreetMap)
  const searchPlaces = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const results: PlaceSuggestion[] = data.map((item: any) => ({
        name: item.display_name.split(',')[0],
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search location');
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    toast.loading('Getting your location...', { id: 'location' });
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
          reverseGeocode(latitude, longitude);
          onLocationSelect(latitude, longitude, 'Current Location');
          toast.success('Location detected!', { id: 'location' });
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get your location. Please check permissions.', { id: 'location' });
          setIsLocating(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setIsLocating(false);
    }
  };

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      const formattedAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(formattedAddress);
      onLocationSelect(lat, lng, formattedAddress);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  // Handle place selection from search
  const handlePlaceSelect = (place: PlaceSuggestion) => {
    setSelectedLocation({ lat: place.lat, lng: place.lng });
    setMapCenter([place.lat, place.lng]);
    setMapZoom(16);
    setAddress(place.address);
    onLocationSelect(place.lat, place.lng, place.address);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    toast.success(`Selected: ${place.name}`);
  };

  // Handle map click
  const handleMapClick = (lat: number, lng: number, addr: string) => {
    setSelectedLocation({ lat, lng });
    reverseGeocode(lat, lng);
  };

  // Get radius color based on selection
  const getRadiusColor = () => {
    return '#ef4444';
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
              placeholder="Search for a location (e.g., Central Park, NYC)"
              className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={searchPlaces}
            disabled={isSearching}
            className="glass px-4 py-2 rounded-lg text-white disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="glass px-4 py-2 rounded-lg text-white disabled:opacity-50 relative"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearch && (searchResults.length > 0 || isSearching) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 glass rounded-lg overflow-hidden z-20 max-h-64 overflow-y-auto"
            >
              {isSearching ? (
                <div className="p-4 text-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : (
                searchResults.map((result, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handlePlaceSelect(result)}
                    className="w-full p-3 text-left hover:bg-white/10 transition border-b border-white/10 last:border-none"
                  >
                    <div className="font-semibold text-white">{result.name}</div>
                    <div className="text-sm text-gray-400 truncate">{result.address}</div>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Places */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {commonPlaces.map((place, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${place.color} bg-opacity-20 hover:bg-opacity-30 transition text-white text-sm whitespace-nowrap`}
            onClick={() => {
              // Simulate quick place selection (in real app, you'd have saved coordinates)
              toast.success(`${place.name} selected`);
            }}
          >
            <place.icon className="w-4 h-4" />
            {place.name}
          </motion.button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative">
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-white/20">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />
            
            <LocationMarker 
              onLocationSelect={handleMapClick} 
              position={selectedLocation}
            />
            
            {selectedLocation && (
              <>
                <Circle
                  center={[selectedLocation.lat, selectedLocation.lng]}
                  radius={radius}
                  pathOptions={{
                    color: getRadiusColor(),
                    fillColor: getRadiusColor(),
                    fillOpacity: 0.2,
                  }}
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-semibold text-gray-900">Selected Location</p>
                      <p className="text-xs text-gray-600 mt-1">{address || 'Location selected'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Radius: {radius}m
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>

        {/* Map Controls Overlay */}
        <div className="absolute bottom-4 right-4 space-y-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
            className="glass w-8 h-8 rounded-lg flex items-center justify-center text-white"
          >
            +
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
            className="glass w-8 h-8 rounded-lg flex items-center justify-center text-white"
          >
            -
          </motion.button>
        </div>

        {/* Selected Location Info */}
        <AnimatePresence>
          {selectedLocation && address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-20 glass rounded-lg p-3 z-10"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Selected Location</p>
                  <p className="text-gray-400 text-xs truncate">{address}</p>
                  <div className="flex gap-2 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => reverseGeocode(selectedLocation.lat, selectedLocation.lng)}
                      className="text-xs bg-white/10 px-2 py-1 rounded text-white"
                    >
                      Confirm
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedLocation(null);
                        setAddress('');
                      }}
                      className="text-xs bg-white/10 px-2 py-1 rounded text-white"
                    >
                      Clear
                    </motion.button>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instruction Text */}
      <div className="text-center text-sm text-gray-400">
        <p>Click anywhere on the map to select a location</p>
        <p className="text-xs mt-1">The circle shows the affected radius (500m)</p>
      </div>
    </div>
  );
}