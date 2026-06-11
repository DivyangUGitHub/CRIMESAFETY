"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  ChevronDown,
  Star,
  User,
  Building2,
  X,
  Crosshair,
  Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import HoverFooter from "../components/hover-footer";

interface PoliceStation {
  id: string;
  name: string;
  stationId: string;
  officerInCharge: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  rating: number;
  jurisdiction: string;
  emergencyNumber: string;
  services: string[];
  isFromAPI?: boolean;
  distance?: number;
}

// Static Police Stations Database - All Major Cities
const policeStationsData: PoliceStation[] = [
  // ========== DELHI / NCR ==========
  {
    id: "101",
    name: "Connaught Place Police Station",
    stationId: "CP001",
    officerInCharge: "Shri Dinesh Kumar",
    address: "H Block, Connaught Circus",
    city: "Delhi NCR",
    state: "Delhi",
    pincode: "110001",
    phone: "+91-11-2341-1234",
    email: "cp@delhipolice.gov.in",
    latitude: 28.6329,
    longitude: 77.2199,
    rating: 4.3,
    jurisdiction: "Connaught Place, Janpath, Rajiv Chowk",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Tourist Police", "Lost & Found", "Cyber Cell"]
  },
  {
    id: "102",
    name: "Tughlak Road Police Station",
    stationId: "TR002",
    officerInCharge: "Shri Rajesh Meena",
    address: "Tughlak Road, Near AIIMS",
    city: "Delhi NCR",
    state: "Delhi",
    pincode: "110011",
    phone: "+91-11-2306-1234",
    email: "tughlakroad@delhipolice.gov.in",
    latitude: 28.5937,
    longitude: 77.2035,
    rating: 4.1,
    jurisdiction: "Tughlak Road, South Extension, Green Park",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "VIP Security", "Women Cell"]
  },
  {
    id: "103",
    name: "Chandni Chowk Police Station",
    stationId: "CC003",
    officerInCharge: "Shri Manoj Kumar",
    address: "Chandni Chowk, Near Red Fort",
    city: "Delhi NCR",
    state: "Delhi",
    pincode: "110006",
    phone: "+91-11-2392-4567",
    email: "chandnichowk@delhipolice.gov.in",
    latitude: 28.6559,
    longitude: 77.2315,
    rating: 4.0,
    jurisdiction: "Chandni Chowk, Red Fort Area, Old Delhi",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Tourist Police", "Market Security"]
  },
  {
    id: "104",
    name: "Defence Colony Police Station",
    stationId: "DC004",
    officerInCharge: "Smt. Neha Sharma",
    address: "Defence Colony Flyover",
    city: "Delhi NCR",
    state: "Delhi",
    pincode: "110024",
    phone: "+91-11-2433-7890",
    email: "defencecolony@delhipolice.gov.in",
    latitude: 28.5704,
    longitude: 77.2306,
    rating: 4.4,
    jurisdiction: "Defence Colony, Lajpat Nagar, Greater Kailash",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Cyber Cell", "Women Cell", "Community Policing"]
  },
  {
    id: "105",
    name: "Vasant Kunj Police Station",
    stationId: "VK005",
    officerInCharge: "Shri Amit Singh",
    address: "Sector C, Vasant Kunj",
    city: "Delhi NCR",
    state: "Delhi",
    pincode: "110070",
    phone: "+91-11-2689-1234",
    email: "vasantkunj@delhipolice.gov.in",
    latitude: 28.5343,
    longitude: 77.1524,
    rating: 4.2,
    jurisdiction: "Vasant Kunj, Mahipalpur, Andheria Mod",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Airport Security", "Traffic Control"]
  },
  {
    id: "106",
    name: "Noida Police Station",
    stationId: "N006",
    officerInCharge: "Shri Anurag Singh",
    address: "Sector 14A, Noida",
    city: "Delhi NCR",
    state: "Uttar Pradesh",
    pincode: "201301",
    phone: "+91-120-242-1234",
    email: "noida@uppolice.gov.in",
    latitude: 28.5746,
    longitude: 77.3251,
    rating: 4.1,
    jurisdiction: "Sector 14-18, Noida City Center",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Cyber Cell", "Women Cell"]
  },
  {
    id: "107",
    name: "Gurugram Police Station",
    stationId: "GG007",
    officerInCharge: "Shri Vikas Sharma",
    address: "Sector 51, Gurugram",
    city: "Delhi NCR",
    state: "Haryana",
    pincode: "122018",
    phone: "+91-124-422-1234",
    email: "gurugram@haryanapolice.gov.in",
    latitude: 28.4504,
    longitude: 77.0821,
    rating: 4.0,
    jurisdiction: "Sector 45-56, Golf Course Road",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Cyber Cell", "Corporate Security"]
  },

  // ========== MUMBAI ==========
  {
    id: "201",
    name: "Mumbai Police Headquarters",
    stationId: "MH001",
    officerInCharge: "Commissioner of Police",
    address: "Police Headquarters, Crawford Market",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91-22-2262-1234",
    email: "cp@mumbaipolice.gov.in",
    latitude: 18.9434,
    longitude: 72.8329,
    rating: 4.5,
    jurisdiction: "South Mumbai, Fort Area",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "HQ Administration", "Special Branch", "Cyber Crime HQ"]
  },
  {
    id: "202",
    name: "Colaba Police Station",
    stationId: "CL002",
    officerInCharge: "Shri Rajesh Pradhan",
    address: "Colaba Causeway, Near Regal Cinema",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400005",
    phone: "+91-22-2282-1234",
    email: "colaba@mumbaipolice.gov.in",
    latitude: 18.9168,
    longitude: 72.8211,
    rating: 4.3,
    jurisdiction: "Colaba, Cuffe Parade, Nariman Point",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Tourist Police", "Coastal Security"]
  },
  {
    id: "203",
    name: "Bandra Police Station",
    stationId: "BD003",
    officerInCharge: "Smt. Vidya Kulkarni",
    address: "Bandra West, Near Bandra Station",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    phone: "+91-22-2642-1234",
    email: "bandra@mumbaipolice.gov.in",
    latitude: 19.0548,
    longitude: 72.8274,
    rating: 4.2,
    jurisdiction: "Bandra, Khar, Santacruz",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Women Cell", "Cyber Cell"]
  },
  {
    id: "204",
    name: "Andheri Police Station",
    stationId: "AN004",
    officerInCharge: "Shri Sunil Gupta",
    address: "Andheri East, Near Airport Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400069",
    phone: "+91-22-2682-1234",
    email: "andheri@mumbaipolice.gov.in",
    latitude: 19.1143,
    longitude: 72.8453,
    rating: 4.0,
    jurisdiction: "Andheri, Juhu, Vile Parle",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Airport Security", "Traffic Control"]
  },

  // ========== BANGALORE ==========
  {
    id: "301",
    name: "Infantry Road Police Station",
    stationId: "BN001",
    officerInCharge: "Shri Kumar Reddy",
    address: "Infantry Road, Near Cunningham Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    phone: "+91-80-2286-1234",
    email: "infantryroad@bcp.gov.in",
    latitude: 12.9853,
    longitude: 77.6071,
    rating: 4.2,
    jurisdiction: "Central Bangalore, Shivajinagar",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Cyber Cell", "Women Cell"]
  },
  {
    id: "302",
    name: "Indiranagar Police Station",
    stationId: "IN002",
    officerInCharge: "Smt. Kavita Raj",
    address: "100 Feet Road, Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560038",
    phone: "+91-80-2525-1234",
    email: "indiranagar@bcp.gov.in",
    latitude: 12.9755,
    longitude: 77.6455,
    rating: 4.3,
    jurisdiction: "Indiranagar, Domlur, Ulsoor",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Cyber Cell", "Night Patrol"]
  },
  {
    id: "303",
    name: "Whitefield Police Station",
    stationId: "WF003",
    officerInCharge: "Shri Manjunath",
    address: "Whitefield Main Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    phone: "+91-80-2845-1234",
    email: "whitefield@bcp.gov.in",
    latitude: 12.9691,
    longitude: 77.7498,
    rating: 4.1,
    jurisdiction: "Whitefield, ITPL, Brookefield",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "IT Corridor Security", "Cyber Cell"]
  },

  // ========== CHENNAI ==========
  {
    id: "401",
    name: "Egmore Police Station",
    stationId: "CH001",
    officerInCharge: "Shri Sekar",
    address: "Egmore, Near Railway Station",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600008",
    phone: "+91-44-2819-1234",
    email: "egmore@chennaipolice.gov.in",
    latitude: 13.0731,
    longitude: 80.2596,
    rating: 4.2,
    jurisdiction: "Egmore, Chetpet, Kilpauk",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Railway Police", "Traffic Control"]
  },
  {
    id: "402",
    name: "T Nagar Police Station",
    stationId: "TN002",
    officerInCharge: "Smt. Lakshmi",
    address: "T Nagar, Near Pondy Bazaar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600017",
    phone: "+91-44-2434-1234",
    email: "tnagar@chennaipolice.gov.in",
    latitude: 13.0437,
    longitude: 80.2440,
    rating: 4.3,
    jurisdiction: "T Nagar, Nungambakkam, Kodambakkam",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Market Security", "Women Cell"]
  },

  // ========== HYDERABAD ==========
  {
    id: "501",
    name: "Hussain Sagar Police Station",
    stationId: "HY001",
    officerInCharge: "Shri Prakash",
    address: "Hussain Sagar, Tank Bund Road",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500029",
    phone: "+91-40-2323-1234",
    email: "hussainsagar@hyderabadpolice.gov.in",
    latitude: 17.4111,
    longitude: 78.4760,
    rating: 4.2,
    jurisdiction: "Hussain Sagar, Khairatabad, Somajiguda",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Tourist Police", "Lake Security"]
  },
  {
    id: "502",
    name: "Cyberabad Police Station",
    stationId: "CB002",
    officerInCharge: "Shri Venkatesh",
    address: "HiTech City, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    phone: "+91-40-2311-1234",
    email: "cyberabad@hyderabadpolice.gov.in",
    latitude: 17.4484,
    longitude: 78.3751,
    rating: 4.4,
    jurisdiction: "HiTech City, Gachibowli, Madhapur",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Cyber Crime HQ", "IT Security"]
  },

  // ========== Kolkata (Additional) ==========
  {
    id: "601",
    name: "Bidhannagar Police Station",
    stationId: "KB001",
    officerInCharge: "Shri Arup Banerjee",
    address: "Sector I, Salt Lake",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700064",
    phone: "+91-33-2337-1234",
    email: "bidhannagar@kolkatapolice.gov.in",
    latitude: 22.5848,
    longitude: 88.4169,
    rating: 4.2,
    jurisdiction: "Salt Lake, Sector I-V",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Cyber Cell", "Women Cell"]
  },
  {
    id: "602",
    name: "Park Street Police Station",
    stationId: "PS002",
    officerInCharge: "Smt. Mita Ghosh",
    address: "Park Street, Near St. Xavier's",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    phone: "+91-33-2229-1234",
    email: "parkstreet@kolkatapolice.gov.in",
    latitude: 22.5565,
    longitude: 88.3525,
    rating: 4.5,
    jurisdiction: "Park Street, Mullick Bazar",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Tourist Police", "Night Patrol"]
  },
  {
    id: "603",
    name: "Howrah Police Station",
    stationId: "HW003",
    officerInCharge: "Shri Debasish Das",
    address: "G.T. Road, Howrah Station Area",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "711101",
    phone: "+91-33-2641-1234",
    email: "howrah@howrahpolice.gov.in",
    latitude: 22.5913,
    longitude: 88.3145,
    rating: 4.3,
    jurisdiction: "Howrah Station Area, Kadamtala",
    emergencyNumber: "100",
    services: ["24/7 Emergency", "Railway Police", "River Security"]
  }
];

// City options for filter
const cities = ["All", "Kolkata", "Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Hyderabad"];

// Function to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function PoliceStationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<PoliceStation | null>(null);
  const [filterCity, setFilterCity] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [liveStations, setLiveStations] = useState<PoliceStation[]>([]);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const itemsPerPage = 6;

  // 🔴 NEW: Live API Search Function
  const searchLivePoliceStations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setLiveStations([]);
      return;
    }

    setIsSearchingAPI(true);
    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query + " police station india"
      )}&format=json&limit=10&addressdetails=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const apiStations: PoliceStation[] = data.map((item: any, index: number) => {
          const address = item.address || {};
          return {
            id: `api_${item.place_id}`,
            name: item.display_name.split(",")[0] || `${address.amenity || "Police Station"}`,
            stationId: `API${index + 1}`,
            officerInCharge: "Information Not Available",
            address: item.display_name,
            city: address.city || address.town || address.village || address.state || "Unknown",
            state: address.state || "Unknown",
            pincode: address.postcode || "N/A",
            phone: "Call 100 for emergency",
            email: "N/A",
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            rating: 4.0,
            jurisdiction: "Information from OpenStreetMap",
            emergencyNumber: "100",
            services: ["24/7 Emergency", "Community Policing"],
            isFromAPI: true,
            distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, parseFloat(item.lat), parseFloat(item.lon)) : null
          };
        });
        setLiveStations(apiStations);
      } else {
        setLiveStations([]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setLiveStations([]);
    } finally {
      setIsSearchingAPI(false);
    }
  };

  const getUserLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSortBy("distance");
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
          alert("Unable to get your location. Please enable location access.");
        }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation not supported by your browser");
    }
  };

  // 🔴 NEW: Search on query change (API + Static)
  useEffect(() => {
    if (searchQuery.length >= 3) {
      // Search in static database
      const staticFiltered = stationsWithDistance.filter(station => {
        const matchesSearch = 
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.stationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.pincode.includes(searchQuery);
        return matchesSearch;
      });
      
      // Also search live API
      searchLivePoliceStations(searchQuery);
      
      // Combine static + live for display (but we'll handle separately)
      // We'll show static results normally, API results in a separate section
    } else if (searchQuery.length === 0) {
      setLiveStations([]);
    }
  }, [searchQuery]);

  // Get stations with distance
  const stationsWithDistance = policeStationsData.map(station => ({
    ...station,
    distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, station.latitude, station.longitude) : null
  }));

  // Filter static stations
  let filteredStations = stationsWithDistance.filter(station => {
    const matchesSearch = 
      searchQuery.length < 3 || 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.stationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.pincode.includes(searchQuery);
    
    const matchesCity = filterCity === "All" || station.city === filterCity;
    return matchesSearch && matchesCity;
  });

  // Sort static stations
  filteredStations.sort((a, b) => {
    if (sortBy === "distance" && a.distance !== null && b.distance !== null) {
      return a.distance - b.distance;
    }
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const totalPages = Math.ceil((filteredStations.length + liveStations.length) / itemsPerPage);
  const paginatedStations = [...filteredStations, ...liveStations].slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCity, sortBy]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/10 to-black pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-500/30 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              All <span className="text-red-500">Police Stations</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Static Data + Live OpenStreetMap API - Search any city in India
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-4 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by city, area, pincode (e.g., Delhi, Bangalore, Mumbai, Kolkata, Chennai)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <button
                onClick={getUserLocation}
                disabled={isLocating}
                className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-white flex items-center gap-2 hover:bg-red-500/30 transition disabled:opacity-50"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                ) : (
                  <Crosshair className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm">Near Me</span>
              </button>

              <div className="relative">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-black border border-red-500/30 rounded-xl text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50 w-[180px]"
                >
                  {cities.map(city => (
                    <option key={city} value={city} className="bg-black text-white">
                      {city === "All" ? "All Cities" : city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-black border border-red-500/30 rounded-xl text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50 w-[180px]"
                >
                  <option value="name" className="bg-black text-white">Sort by Name</option>
                  <option value="rating" className="bg-black text-white">Sort by Rating</option>
                  <option value="distance" disabled={!userLocation} className="bg-black text-white">
                    Sort by Distance {!userLocation && "(Enable location)"}
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Live API Search Indicator */}
          {isSearchingAPI && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-5 h-5 text-red-400 animate-spin mr-2" />
              <span className="text-gray-400 text-sm">Searching live data from OpenStreetMap...</span>
            </div>
          )}

          {/* Live API Results Count */}
          {!isSearchingAPI && searchQuery.length >= 3 && liveStations.length > 0 && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-green-400 text-sm flex items-center gap-2">
                <span>🌍 Live OpenStreetMap Data</span>
                <span className="text-gray-400">• Found {liveStations.length} stations from live API</span>
              </p>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400 text-sm">
              Found <span className="text-red-400 font-semibold">{filteredStations.length + liveStations.length}</span> police stations
              {liveStations.length > 0 && <span className="text-green-400 ml-2">({liveStations.length} from Live API)</span>}
              {userLocation && <span className="text-gray-500 ml-2">• Sorted by nearest location</span>}
            </p>
          </div>

          {/* Police Stations Grid */}
          {(filteredStations.length > 0 || liveStations.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedStations.map((station, index) => (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 overflow-hidden hover:border-red-500/40 transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="bg-gradient-to-r from-red-500/10 to-red-700/10 p-4 border-b border-red-900/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition">
                            {station.name}
                          </h3>
                          {station.isFromAPI && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              Live
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">ID: {station.stationId}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-white text-xs">{station.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Officer In-Charge</p>
                        <p className="text-white text-sm">{station.officerInCharge}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-gray-300 text-sm line-clamp-2">{station.address}</p>
                        <p className="text-gray-500 text-xs mt-1">City: {station.city} | Pincode: {station.pincode}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-red-400" />
                      <span className="text-gray-300 text-sm">{station.phone}</span>
                    </div>

                    {station.distance !== null && (
                      <div className="text-xs text-green-400 mt-2">
                        📍 {station.distance.toFixed(1)} km from your location
                      </div>
                    )}

                    <button className="w-full mt-2 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No police stations found for "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">Try searching by city name (e.g., Delhi, Mumbai, Kolkata, Chennai)</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-red-400 hover:text-red-300 text-sm"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white/5 border border-red-500/30 text-white disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-gray-400 text-sm">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-white/5 border border-red-500/30 text-white disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/90 backdrop-blur-xl rounded-2xl border border-red-500/30 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-800 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{selectedStation.name}</h3>
              <button onClick={() => setSelectedStation(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between border-b border-red-900/30 pb-3">
                <div><p className="text-xs text-gray-500">Station ID</p><p className="text-white">{selectedStation.stationId}</p></div>
                <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>{selectedStation.rating}</span></div>
              </div>
              <div><p className="text-xs text-gray-500">Officer In-Charge</p><p className="text-white">{selectedStation.officerInCharge}</p></div>
              <div><p className="text-xs text-gray-500">Address</p><p className="text-gray-300">{selectedStation.address}</p></div>
              <div><p className="text-xs text-gray-500">City / State</p><p className="text-white">{selectedStation.city}, {selectedStation.state}</p></div>
              <div><p className="text-xs text-gray-500">Pincode</p><p className="text-white">{selectedStation.pincode}</p></div>
              <div><p className="text-xs text-gray-500">Jurisdiction</p><p className="text-gray-300">{selectedStation.jurisdiction}</p></div>
              <div><p className="text-xs text-gray-500">Emergency</p><p className="text-white text-xl font-bold text-red-400">{selectedStation.emergencyNumber}</p></div>
              <div><a href={`tel:${selectedStation.phone}`} className="block text-blue-400 hover:underline">{selectedStation.phone}</a></div>
              {selectedStation.isFromAPI && (
                <div className="text-xs text-gray-500 italic">* Information provided by OpenStreetMap</div>
              )}
              <div className="pt-4 flex gap-3">
                <a href={`tel:${selectedStation.phone}`} className="flex-1 bg-red-500/20 border border-red-500/30 py-2 rounded-xl text-red-400 text-center hover:bg-red-500/30">Call Now</a>
                <a href={`https://maps.google.com/?q=${selectedStation.latitude},${selectedStation.longitude}`} target="_blank" className="flex-1 bg-white/5 border border-white/10 py-2 rounded-xl text-white text-center hover:bg-white/10">Get Directions</a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <HoverFooter />
    </>
  );
}