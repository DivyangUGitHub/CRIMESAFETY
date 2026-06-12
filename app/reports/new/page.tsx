// "use client";

// import { useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Shield, 
//   MapPin, 
//   Calendar, 
//   AlertCircle, 
//   Upload, 
//   X,
//   Clock,
//   Phone,
//   User,
//   Building2,
//   Image as ImageIcon,
//   Video,
//   FileText,
//   ChevronRight,
//   ChevronLeft,
//   CheckCircle,
//   Loader2,
//   Camera,
//   Mic,
//   Send,
//   Trash2,
//   Eye,
//   EyeOff,
//   Navigation,
//   Target,
//   Wallet,
//   ShieldAlert,
//   Lock,
//   BadgeAlert,
//   Megaphone,
//   Pill,
//   Car,
//   Paintbrush,
// } from "lucide-react";
// import { useSession } from "next-auth/react";
// import toast from "react-hot-toast";
// import dynamic from "next/dynamic";
// import Navbar from "../../components/Navbar";
// import HoverFooter from "../../components/hover-footer";

// // Dynamically import map to avoid SSR issues
// const MapPicker = dynamic(() => import("../../components/MapPicker"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-64 bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
//       <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
//     </div>
//   ),
// });

// const steps = [
//   { id: 1, name: "Incident Details", icon: FileText },
//   { id: 2, name: "Location & Evidence", icon: MapPin },
//   { id: 3, name: "Review & Submit", icon: Send },
// ];

// const categories = [
//   {
//     value: "THEFT",
//     label: "Theft",
//     icon: Wallet,
//     color: "from-yellow-500 to-orange-500",
//     description: "Stolen property, pickpocketing, robbery",
//   },
//   {
//     value: "ASSAULT",
//     label: "Assault",
//     icon: ShieldAlert,
//     color: "from-red-500 to-pink-500",
//     description: "Physical attack, battery, fighting",
//   },
//   {
//     value: "BURGLARY",
//     label: "Burglary",
//     icon: Lock,
//     color: "from-purple-500 to-indigo-500",
//     description: "Breaking and entering, home invasion",
//   },
//   {
//     value: "FRAUD",
//     label: "Fraud",
//     icon: BadgeAlert,
//     color: "from-blue-500 to-cyan-500",
//     description: "Scams, identity theft, phishing",
//   },
//   {
//     value: "HARASSMENT",
//     label: "Harassment",
//     icon: Megaphone,
//     color: "from-pink-500 to-rose-500",
//     description: "Stalking, threats, bullying",
//   },
//   {
//     value: "DRUGS",
//     label: "Drugs",
//     icon: Pill,
//     color: "from-green-500 to-emerald-500",
//     description: "Drug possession, trafficking",
//   },
//   {
//     value: "TRAFFIC",
//     label: "Traffic",
//     icon: Car,
//     color: "from-orange-500 to-red-500",
//     description: "Accidents, violations, DUI",
//   },
//   {
//     value: "VANDALISM",
//     label: "Vandalism",
//     icon: Paintbrush,
//     color: "from-gray-500 to-slate-500",
//     description: "Property damage, graffiti",
//   },
//   {
//     value: "OTHER",
//     label: "Other",
//     icon: FileText,
//     color: "from-gray-500 to-slate-500",
//     description: "Other criminal activities",
//   },
// ];

// const nearbyStations = [
//   { name: "Central Police Station", distance: "0.5 km", address: "123 Main Street", phone: "+1-555-0100" },
//   { name: "North District Station", distance: "1.2 km", address: "456 North Avenue", phone: "+1-555-0101" },
//   { name: "South District Station", distance: "2.0 km", address: "789 South Road", phone: "+1-555-0102" },
//   { name: "East Division", distance: "1.8 km", address: "321 East Blvd", phone: "+1-555-0103" },
//   { name: "West Precinct", distance: "2.5 km", address: "654 West Street", phone: "+1-555-0104" },
// ];

// export default function NewReportPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [aiAnalyzing, setAiAnalyzing] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
//   const [aiSuggestion, setAiSuggestion] = useState<{ category: string; confidence: number } | null>(null);
  
//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     description: "",
//     location: "",
//     victims: "",
//     contactNumber: "",
//     timeOfOccurring: "",
//     dateOfOccurring: "",
//     nearbyStations: "",
//     isAnonymous: true,
//   });

//   // AI Category Detection
//   const detectCategory = async () => {
//     if (!formData.title && !formData.description) {
//       toast.error("Please enter title or description first");
//       return;
//     }

//     setAiAnalyzing(true);
//     try {
//       const response = await fetch("/api/ai/detect-category", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: formData.title,
//           description: formData.description,
//         }),
//       });
//       const data = await response.json();
//       if (data.category) {
//         setAiSuggestion({ category: data.category, confidence: data.confidence });
//         toast.success(`AI suggests: ${data.category} (${(data.confidence * 100).toFixed(0)}% confidence)`);
//       }
//     } catch (error) {
//       console.error("AI detection failed:", error);
//     } finally {
//       setAiAnalyzing(false);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       setFiles(prev => [...prev, ...newFiles]);
      
//       // Create preview URLs for images
//       newFiles.forEach(file => {
//         if (file.type.startsWith("image/")) {
//           const reader = new FileReader();
//           reader.onload = (e) => {
//             setImagePreviews(prev => [...prev, e.target?.result as string]);
//           };
//           reader.readAsDataURL(file);
//         }
//       });
      
//       toast.success(`${newFiles.length} file(s) added`);
//     }
//   };

//   // ✅ Fixed handleDrop function
//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     setFiles(prev => [...prev, ...droppedFiles]);
    
//     // Create preview URLs for images
//     droppedFiles.forEach(file => {
//       if (file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setImagePreviews(prev => [...prev, e.target?.result as string]);
//         };
//         reader.readAsDataURL(file);
//       }
//     });
    
//     toast.success(`${droppedFiles.length} file(s) added`);
//   };

//   const removeFile = (index: number) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleLocationSelect = (lat: number, lng: number, address: string) => {
//     setSelectedLocation({ lat, lng, address });
//     setFormData(prev => ({ ...prev, location: address }));
//   };

//   const validateStep = () => {
//     if (currentStep === 1) {
//       if (!formData.title) {
//         toast.error("Please enter crime title");
//         return false;
//       }
//       if (!formData.category) {
//         toast.error("Please select crime category");
//         return false;
//       }
//       if (!formData.description || formData.description.length < 20) {
//         toast.error("Please provide detailed description (min 20 characters)");
//         return false;
//       }
//       if (!formData.dateOfOccurring) {
//         toast.error("Please select date of occurrence");
//         return false;
//       }
//       return true;
//     }
//     if (currentStep === 2) {
//       if (!selectedLocation) {
//         toast.error("Please select crime location on map");
//         return false;
//       }
//       return true;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (validateStep() && currentStep < 3) {
//       setCurrentStep(prev => prev + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePrev = () => {
//     if (currentStep > 1) {
//       setCurrentStep(prev => prev - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateStep()) return;
    
//     setLoading(true);
//     const loadingToast = toast.loading("Submitting report...");

//     try {
//       // Upload images first
//       const uploadedImages = [];
//       for (const file of files) {
//         const formDataFile = new FormData();
//         formDataFile.append("file", file);
//         const uploadRes = await fetch("/api/upload", { method: "POST", body: formDataFile });
//         if (uploadRes.ok) {
//           const { url } = await uploadRes.json();
//           uploadedImages.push(url);
//         }
//       }

//       const response = await fetch("/api/reports/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           latitude: selectedLocation?.lat,
//           longitude: selectedLocation?.lng,
//           address: selectedLocation?.address,
//           images: uploadedImages,
//           isAnonymous: formData.isAnonymous,
//         }),
//       });

//       if (response.ok) {
//         toast.success("Crime report submitted successfully!", { id: loadingToast });
//         router.push("/reports");
//       } else {
//         toast.error("Failed to submit report", { id: loadingToast });
//       }
//     } catch (error) {
//       toast.error("Something went wrong", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
      
//       <div className="min-h-screen pt-32 pb-12 px-4 bg-gradient-to-br from-black via-red-950/20 to-black">
//         <div className="max-w-5xl mx-auto">
//           {/* Step Progress Bar */}
//           <div className="mb-8">
//             <div className="flex justify-between items-center relative">
//               {steps.map((step, index) => (
//                 <div key={step.id} className="flex-1 text-center relative z-10">
//                   <motion.div
//                     initial={{ scale: 0.8 }}
//                     animate={{ scale: currentStep >= step.id ? 1 : 0.8 }}
//                     className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-300 ${
//                       currentStep > step.id
//                         ? "bg-green-500 text-white"
//                         : currentStep === step.id
//                         ? "bg-gradient-to-r from-red-500 to-red-700 text-white ring-4 ring-red-500/30"
//                         : "bg-white/10 text-gray-500"
//                     }`}
//                   >
//                     {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
//                   </motion.div>
//                   <p className={`text-sm hidden md:block ${currentStep >= step.id ? "text-white" : "text-gray-500"}`}>
//                     {step.name}
//                   </p>
//                 </div>
//               ))}
//               {/* Progress Line */}
//               <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 -z-0">
//                 <motion.div
//                   className="h-full bg-gradient-to-r from-red-500 to-red-700"
//                   initial={{ width: "0%" }}
//                   animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
//                   transition={{ duration: 0.3 }}
//                 />
//               </div>
//             </div>
//           </div>

//           <motion.div
//             key={currentStep}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//             className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-900/30 overflow-hidden"
//           >
//             {/* Header */}
//             <div className="text-center py-8 px-6 border-b border-red-900/30 bg-gradient-to-r from-red-950/20 to-transparent">
//               <Shield className="w-14 h-14 text-red-500 mx-auto mb-3 animate-pulse" />
//               <h1 className="text-3xl font-bold text-white">Report a Crime</h1>
//               <p className="text-gray-400 text-sm mt-2">
//                 You will be submitting the report as:{" "}
//                 <span className="text-red-400 font-medium">
//                   {formData.isAnonymous ? "Anonymous" : session?.user?.name || "User"}
//                 </span>
//               </p>
//               <button
//                 onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
//                 className="mt-2 text-xs text-gray-500 hover:text-red-400 transition flex items-center gap-1 mx-auto"
//               >
//                 {formData.isAnonymous ? <EyeOff size={12} /> : <Eye size={12} />}
//                 {formData.isAnonymous ? "Switch to named reporting" : "Switch to anonymous"}
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-6">
//               {/* Step 1: Incident Details */}
//               {currentStep === 1 && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//                   {/* Crime Title */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Crime Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.title}
//                       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                       className="w-full px-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
//                       placeholder="e.g., Mobile phone theft at metro station"
//                       required
//                     />
//                   </div>

//                   {/* Crime Category with AI Suggestion */}
//                   <div>
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="text-sm font-medium text-gray-300">
//                         Crime Category <span className="text-red-500">*</span>
//                       </label>
//                       <button
//                         type="button"
//                         onClick={detectCategory}
//                         disabled={aiAnalyzing}
//                         className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
//                       >
//                         {aiAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <AlertCircle size={12} />}
//                         AI Suggest Category
//                       </button>
//                     </div>
// <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//   {categories.map((cat) => (
//     <motion.button
//       key={cat.value}
//       type="button"
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={() => {
//         setFormData({ ...formData, category: cat.value });
//         setAiSuggestion(null);
//       }}
//       className={`p-3 rounded-xl text-left transition-all ${
//         formData.category === cat.value
//           ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
//           : "bg-white/5 border border-red-900/30 text-gray-300 hover:bg-white/10"
//       }`}
//     >
//       <div className="flex items-center gap-2 mb-1">
//         <cat.icon className="w-5 h-5" />
//         <span className="text-lg">{cat.label}</span>
//       </div>
//       <div className="text-xs opacity-80 line-clamp-1">{cat.description}</div>
//     </motion.button>
//   ))}
// </div>
//                     {aiSuggestion && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between"
//                       >
//                         <span className="text-sm text-blue-400">
//                           🤖 AI Suggests: <strong>{aiSuggestion.category}</strong> ({Math.round(aiSuggestion.confidence * 100)}% confidence)
//                         </span>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setFormData({ ...formData, category: aiSuggestion.category });
//                             setAiSuggestion(null);
//                           }}
//                           className="px-3 py-1 bg-blue-500 rounded-lg text-white text-xs"
//                         >
//                           Apply
//                         </button>
//                       </motion.div>
//                     )}
//                   </div>

//                   {/* Crime Description */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Crime Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       rows={6}
//                       value={formData.description}
//                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                       className="w-full px-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
//                       placeholder="Describe what happened in detail... (include time, location, suspects, etc.)"
//                       required
//                     />
//                     <p className="text-right text-xs text-gray-500 mt-1">
//                       {formData.description.length} characters (minimum 20)
//                     </p>
//                   </div>

//                   {/* Date & Time */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Date of Occurrence <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <input
//                           type="date"
//                           value={formData.dateOfOccurring}
//                           onChange={(e) => setFormData({ ...formData, dateOfOccurring: e.target.value })}
//                           className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Time of Occurrence
//                       </label>
//                       <div className="relative">
//                         <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <input
//                           type="time"
//                           value={formData.timeOfOccurring}
//                           onChange={(e) => setFormData({ ...formData, timeOfOccurring: e.target.value })}
//                           className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Victims & Contact */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">Name of Victims</label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <input
//                           type="text"
//                           value={formData.victims}
//                           onChange={(e) => setFormData({ ...formData, victims: e.target.value })}
//                           className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
//                           placeholder="Enter names (comma-separated)"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
//                       <div className="relative">
//                         <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <input
//                           type="tel"
//                           value={formData.contactNumber}
//                           onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
//                           className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
//                           placeholder="+91 1234567890"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Step 2: Location & Evidence */}
//               {currentStep === 2 && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//                   {/* Live Map */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Location of Crime Scene <span className="text-red-500">*</span>
//                     </label>
//                     <div className="rounded-xl overflow-hidden border border-red-900/30">
//                       <MapPicker onLocationSelect={handleLocationSelect} />
//                     </div>
//                     {selectedLocation && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2"
//                       >
//                         <CheckCircle size={16} className="text-green-400" />
//                         <span className="text-sm text-green-400">Location selected: {selectedLocation.address}</span>
//                       </motion.div>
//                     )}
//                   </div>

//                   {/* Nearby Police Stations */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Nearby Police Stations
//                     </label>
//                     <div className="space-y-2">
//                       {nearbyStations.map((station) => (
//                         <motion.div
//                           key={station.name}
//                           whileHover={{ scale: 1.01 }}
//                           className={`p-3 rounded-xl border transition-all cursor-pointer ${
//                             formData.nearbyStations === station.name
//                               ? "border-red-500 bg-red-500/10"
//                               : "border-red-900/30 bg-white/5 hover:bg-white/10"
//                           }`}
//                           onClick={() => setFormData({ ...formData, nearbyStations: station.name })}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <div className="font-medium text-white">{station.name}</div>
//                               <div className="text-xs text-gray-400 mt-1">{station.address}</div>
//                               <div className="text-xs text-gray-500 mt-1">📞 {station.phone}</div>
//                             </div>
//                             <div className="text-xs text-blue-400">{station.distance}</div>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Media Upload */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Media Evidence (Images/Videos)
//                     </label>
//                     <div
//                       onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
//                       onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
//                       onDragOver={(e) => e.preventDefault()}
//                       onDrop={handleDrop}
//                       className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
//                         ${dragActive ? "border-red-500 bg-red-500/10" : "border-red-900/30 hover:border-red-500/50"}`}
//                     >
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*,video/*"
//                         onChange={handleFileSelect}
//                         className="hidden"
//                         id="file-upload"
//                       />
//                       <label htmlFor="file-upload" className="cursor-pointer">
//                         <Upload className="w-14 h-14 text-gray-400 mx-auto mb-3" />
//                         <p className="text-gray-400">Click or drag & drop to upload</p>
//                         <p className="text-gray-500 text-sm mt-1">Images, videos (Max 10MB each)</p>
//                       </label>
//                     </div>
                    
//                     {/* Image Previews */}
//                     {imagePreviews.length > 0 && (
//                       <div className="mt-4 grid grid-cols-3 gap-3">
//                         {imagePreviews.map((preview, index) => (
//                           <div key={index} className="relative group">
//                             <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
//                             <button
//                               type="button"
//                               onClick={() => removeFile(index)}
//                               className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//                             >
//                               <X size={12} className="text-white" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               )}

//               {/* Step 3: Review & Submit */}
//               {currentStep === 3 && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//                   <div className="bg-white/5 rounded-xl p-4 space-y-3">
//                     <h3 className="font-semibold text-white">Review Your Report</h3>
//                     <div className="grid grid-cols-2 gap-3 text-sm">
//                       <div>
//                         <p className="text-gray-500">Title</p>
//                         <p className="text-white">{formData.title || "-"}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Category</p>
//                         <p className="text-white">{formData.category || "-"}</p>
//                       </div>
//                       <div className="col-span-2">
//                         <p className="text-gray-500">Description</p>
//                         <p className="text-white text-sm">{formData.description?.substring(0, 200)}...</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Date & Time</p>
//                         <p className="text-white">{formData.dateOfOccurring} {formData.timeOfOccurring}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Location</p>
//                         <p className="text-white truncate">{selectedLocation?.address || "-"}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Reporting As</p>
//                         <p className="text-white">{formData.isAnonymous ? "Anonymous" : session?.user?.name}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Media Files</p>
//                         <p className="text-white">{files.length} file(s)</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
//                     <p className="text-yellow-400 text-sm flex items-start gap-2">
//                       <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
//                       Please review all information carefully. False reporting may lead to legal consequences.
//                     </p>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex gap-4 pt-6">
//                 {currentStep > 1 && (
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="button"
//                     onClick={handlePrev}
//                     className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
//                   >
//                     <ChevronLeft size={18} />
//                     Previous
//                   </motion.button>
//                 )}
                
//                 {currentStep < 3 ? (
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="button"
//                     onClick={handleNext}
//                     className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
//                   >
//                     Next
//                     <ChevronRight size={18} />
//                   </motion.button>
//                 ) : (
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     disabled={loading}
//                     className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 rounded-xl text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
//                     {loading ? "Submitting..." : "Submit Report"}
//                   </motion.button>
//                 )}
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       </div>

//       <HoverFooter />
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Shield, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Upload, 
  X,
  Clock,
  Phone,
  User,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  Send,
  EyeOff,
  Wallet,
  ShieldAlert,
  Lock,
  BadgeAlert,
  Megaphone,
  Pill,
  Car,
  Paintbrush,
} from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import HoverFooter from "../../components/hover-footer";

const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
    </div>
  ),
});

const steps = [
  { id: 1, name: "Incident Details", icon: FileText },
  { id: 2, name: "Location & Evidence", icon: MapPin },
  { id: 3, name: "Review & Submit", icon: Send },
];

const categories = [
  { value: "THEFT", label: "Theft", icon: Wallet, color: "from-yellow-500 to-orange-500", description: "Stolen property, pickpocketing, robbery" },
  { value: "ASSAULT", label: "Assault", icon: ShieldAlert, color: "from-red-500 to-pink-500", description: "Physical attack, battery, fighting" },
  { value: "BURGLARY", label: "Burglary", icon: Lock, color: "from-purple-500 to-indigo-500", description: "Breaking and entering, home invasion" },
  { value: "FRAUD", label: "Fraud", icon: BadgeAlert, color: "from-blue-500 to-cyan-500", description: "Scams, identity theft, phishing" },
  { value: "HARASSMENT", label: "Harassment", icon: Megaphone, color: "from-pink-500 to-rose-500", description: "Stalking, threats, bullying" },
  { value: "DRUGS", label: "Drugs", icon: Pill, color: "from-green-500 to-emerald-500", description: "Drug possession, trafficking" },
  { value: "TRAFFIC", label: "Traffic", icon: Car, color: "from-orange-500 to-red-500", description: "Accidents, violations, DUI" },
  { value: "VANDALISM", label: "Vandalism", icon: Paintbrush, color: "from-gray-500 to-slate-500", description: "Property damage, graffiti" },
  { value: "OTHER", label: "Other", icon: FileText, color: "from-gray-500 to-slate-500", description: "Other criminal activities" },
];

const nearbyStations = [
  { name: "Central Police Station", distance: "0.5 km", address: "123 Main Street", phone: "+1-555-0100" },
  { name: "North District Station", distance: "1.2 km", address: "456 North Avenue", phone: "+1-555-0101" },
  { name: "South District Station", distance: "2.0 km", address: "789 South Road", phone: "+1-555-0102" },
  { name: "East Division", distance: "1.8 km", address: "321 East Blvd", phone: "+1-555-0103" },
  { name: "West Precinct", distance: "2.5 km", address: "654 West Street", phone: "+1-555-0104" },
];

export default function NewReportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ category: string; confidence: number } | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    victims: "",
    contactNumber: "",
    timeOfOccurring: "",
    dateOfOccurring: "",
    nearbyStations: "",
  });

  const detectCategory = async () => {
    if (!formData.title && !formData.description) {
      toast.error("Please enter title or description first");
      return;
    }

    setAiAnalyzing(true);
    try {
      const response = await fetch("/api/ai/detect-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });
      const data = await response.json();
      if (data.category) {
        setAiSuggestion({ category: data.category, confidence: data.confidence });
        toast.success(`AI suggests: ${data.category} (${(data.confidence * 100).toFixed(0)}% confidence)`);
      }
    } catch (error) {
      console.error("AI detection failed:", error);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      newFiles.forEach(file => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreviews(prev => [...prev, e.target?.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
      
      toast.success(`${newFiles.length} file(s) added`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    
    droppedFiles.forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    toast.success(`${droppedFiles.length} file(s) added`);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.title) {
        toast.error("Please enter crime title");
        return false;
      }
      if (!formData.category) {
        toast.error("Please select crime category");
        return false;
      }
      if (!formData.description || formData.description.length < 20) {
        toast.error("Please provide detailed description (min 20 characters)");
        return false;
      }
      if (!formData.dateOfOccurring) {
        toast.error("Please select date of occurrence");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!selectedLocation) {
        toast.error("Please select crime location on map");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    const loadingToast = toast.loading("Submitting report...");

    try {
      const uploadedImages = [];
      for (const file of files) {
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formDataFile });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          uploadedImages.push(url);
        }
      }

      const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: selectedLocation?.lat,
          longitude: selectedLocation?.lng,
          address: selectedLocation?.address,
          images: uploadedImages,
          isAnonymous: true,
          anonymousId: anonymousId,
        }),
      });

      if (response.ok) {
        toast.success("Crime report submitted successfully!", { id: loadingToast });
        router.push("/reports");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit report", { id: loadingToast });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen pt-32 pb-12 px-4 bg-gradient-to-br from-black via-red-950/20 to-black">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: currentStep >= step.id ? 1 : 0.8 }}
                    className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-gradient-to-r from-red-500 to-red-700 text-white ring-4 ring-red-500/30"
                        : "bg-white/10 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
                  </motion.div>
                  <p className={`text-sm hidden md:block ${currentStep >= step.id ? "text-white" : "text-gray-500"}`}>
                    {step.name}
                  </p>
                </div>
              ))}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 -z-0">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-700"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-900/30 overflow-hidden"
          >
            <div className="text-center py-8 px-6 border-b border-red-900/30 bg-gradient-to-r from-red-950/20 to-transparent">
              <Shield className="w-14 h-14 text-red-500 mx-auto mb-3 animate-pulse" />
              <h1 className="text-3xl font-bold text-white">Report a Crime</h1>
              <p className="text-gray-400 text-sm mt-2">
                Your report will be submitted <span className="text-red-400 font-medium">Anonymously</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">No login required • Your identity is protected</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Crime Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      placeholder="e.g., Mobile phone theft at metro station"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">
                        Crime Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={detectCategory}
                        disabled={aiAnalyzing}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        {aiAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <AlertCircle size={12} />}
                        AI Suggest Category
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setFormData({ ...formData, category: cat.value });
                            setAiSuggestion(null);
                          }}
                          className={`p-3 rounded-xl text-left transition-all ${
                            formData.category === cat.value
                              ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                              : "bg-white/5 border border-red-900/30 text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <cat.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{cat.label}</span>
                          </div>
                          <div className="text-xs opacity-80 line-clamp-1">{cat.description}</div>
                        </motion.button>
                      ))}
                    </div>
                    {aiSuggestion && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between"
                      >
                        <span className="text-sm text-blue-400">
                          🤖 AI Suggests: <strong>{aiSuggestion.category}</strong> ({Math.round(aiSuggestion.confidence * 100)}% confidence)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: aiSuggestion.category });
                            setAiSuggestion(null);
                          }}
                          className="px-3 py-1 bg-blue-500 rounded-lg text-white text-xs"
                        >
                          Apply
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Crime Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      placeholder="Describe what happened in detail... (include time, location, suspects, etc.)"
                      required
                    />
                    <p className="text-right text-xs text-gray-500 mt-1">
                      {formData.description.length} characters (minimum 20)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Occurrence <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.dateOfOccurring}
                          onChange={(e) => setFormData({ ...formData, dateOfOccurring: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Time of Occurrence
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          value={formData.timeOfOccurring}
                          onChange={(e) => setFormData({ ...formData, timeOfOccurring: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name of Victims</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.victims}
                          onChange={(e) => setFormData({ ...formData, victims: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter names (comma-separated)"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.contactNumber}
                          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="+91 1234567890"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location of Crime Scene <span className="text-red-500">*</span>
                    </label>
                    <div className="rounded-xl overflow-hidden border border-red-900/30">
                      <MapPicker onLocationSelect={handleLocationSelect} />
                    </div>
                    {selectedLocation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2"
                      >
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-sm text-green-400">Location selected: {selectedLocation.address}</span>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nearby Police Stations
                    </label>
                    <div className="space-y-2">
                      {nearbyStations.map((station) => (
                        <motion.div
                          key={station.name}
                          whileHover={{ scale: 1.01 }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            formData.nearbyStations === station.name
                              ? "border-red-500 bg-red-500/10"
                              : "border-red-900/30 bg-white/5 hover:bg-white/10"
                          }`}
                          onClick={() => setFormData({ ...formData, nearbyStations: station.name })}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-white">{station.name}</div>
                              <div className="text-xs text-gray-400 mt-1">{station.address}</div>
                              <div className="text-xs text-gray-500 mt-1">📞 {station.phone}</div>
                            </div>
                            <div className="text-xs text-blue-400">{station.distance}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Media Evidence (Images/Videos)
                    </label>
                    <div
                      onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                        ${dragActive ? "border-red-500 bg-red-500/10" : "border-red-900/30 hover:border-red-500/50"}`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-14 h-14 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-400">Click or drag & drop to upload</p>
                        <p className="text-gray-500 text-sm mt-1">Images, videos (Max 10MB each)</p>
                      </label>
                    </div>
                    
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-white">Review Your Report</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Title</p>
                        <p className="text-white">{formData.title || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="text-white">{formData.category || "-"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Description</p>
                        <p className="text-white text-sm">{formData.description?.substring(0, 200)}...</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="text-white">{formData.dateOfOccurring} {formData.timeOfOccurring}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="text-white truncate">{selectedLocation?.address || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Reporting As</p>
                        <p className="text-green-400">Anonymous</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Media Files</p>
                        <p className="text-white">{files.length} file(s)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm flex items-start gap-2">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      Your report will be submitted anonymously. Your identity is protected.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </motion.button>
                )}
                
                {currentStep < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
                  >
                    Next
                    <ChevronRight size={18} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 rounded-xl text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {loading ? "Submitting..." : "Submit Report Anonymously"}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <HoverFooter />
    </>
  );
}