'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MapPin, Calendar, AlertTriangle, Send, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import MapPicker from './MapPicker';

interface ReportData {
  title: string;
  description: string;
  category: string;
  date: string;
  anonymous: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

const categories = [
  { value: 'THEFT', label: 'Theft', icon: '💰', color: 'from-yellow-500 to-orange-500' },
  { value: 'ASSAULT', label: 'Assault', icon: '👊', color: 'from-red-500 to-pink-500' },
  { value: 'BURGLARY', label: 'Burglary', icon: '🔒', color: 'from-purple-500 to-indigo-500' },
  { value: 'FRAUD', label: 'Fraud', icon: '🎭', color: 'from-blue-500 to-cyan-500' },
  { value: 'HARASSMENT', label: 'Harassment', icon: '📢', color: 'from-pink-500 to-rose-500' },
  { value: 'DRUGS', label: 'Drugs', icon: '💊', color: 'from-green-500 to-emerald-500' },
  { value: 'TRAFFIC', label: 'Traffic', icon: '🚗', color: 'from-orange-500 to-red-500' },
  { value: 'OTHER', label: 'Other', icon: '📝', color: 'from-gray-500 to-slate-500' },
];

export default function ReportForm() {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReportData>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReportData) => {
    setIsSubmitting(true);
    
    const loadingToast = toast.loading('AI is analyzing your report...');
    
    try {
      // Simulate AI verification (will connect to backend later)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAIAnalysis = {
        isValid: true,
        confidence: 0.94,
        analysis: "Report appears legitimate. High severity detected. Immediate attention recommended.",
        severity: "HIGH"
      };
      
      setAiAnalysis(mockAIAnalysis);
      toast.success('Report analyzed successfully!', { id: loadingToast });
      
      // Here we'll integrate with backend API
      console.log('Report data:', { ...data, images, aiAnalysis: mockAIAnalysis });
      
      // Show success and redirect
      toast.success('Report submitted successfully! Authorities have been notified.');
      
    } catch (error) {
      toast.error('Failed to submit report. Please try again.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ['Incident Details', 'Location', 'Evidence', 'Review'];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 text-center">
                <motion.div 
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    index <= currentStep ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                  animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>
                <div className={`text-sm ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>{step}</div>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 left-0 h-1 bg-gray-700 rounded-full w-full"></div>
            <motion.div 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
              animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <motion.div 
          className="glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Incident Details */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Tell us what happened</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Brief title of the incident"
                    />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-lg text-center transition-all ${
                            watch('category') === cat.value 
                              ? `bg-gradient-to-r ${cat.color} text-white`
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                          onClick={() => setValue('category', cat.value)}
                        >
                          <div className="text-2xl mb-1">{cat.icon}</div>
                          <div className="text-sm">{cat.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Minimum 20 characters' } })}
                      rows={6}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Detailed description of the incident..."
                    />
                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      {...register('date', { required: 'Date is required' })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Where did it happen?</h2>
                  
                  <div className="h-96 rounded-lg overflow-hidden">
                    <MapPicker onLocationSelect={(lat, lng, address) => {
                      setValue('location', { lat, lng, address });
                    }} />
                  </div>
                  
                  {watch('location')?.address && (
                    <motion.div 
                      className="mt-4 p-4 bg-white/10 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <MapPin className="inline-block w-4 h-4 mr-2 text-red-400" />
                      <span className="text-gray-300">{watch('location').address}</span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Evidence */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Upload Evidence</h2>
                  
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">Click or drag images here</p>
                      <p className="text-gray-500 text-sm">Upload photos, screenshots, or documents</p>
                    </label>
                  </div>
                  
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <img src={preview} alt={`Evidence ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('anonymous')}
                      className="mr-2 w-4 h-4"
                    />
                    <label className="text-gray-300">Report anonymously</label>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & AI Analysis */}
              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Review Your Report</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/10 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Incident Details</h3>
                      <p><strong>Title:</strong> {watch('title')}</p>
                      <p><strong>Category:</strong> {watch('category')}</p>
                      <p><strong>Description:</strong> {watch('description')}</p>
                      <p><strong>Date:</strong> {watch('date')}</p>
                    </div>
                    
                    {watch('location') && (
                      <div className="p-4 bg-white/10 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">Location</h3>
                        <p>{watch('location').address}</p>
                      </div>
                    )}
                    
                    {aiAnalysis && (
                      <motion.div 
                        className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg border border-red-500/50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <h3 className="font-semibold text-white mb-2 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                          AI Analysis Result
                        </h3>
                        <p className="text-gray-300">{aiAnalysis.analysis}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Confidence Score</span>
                            <span>{(aiAnalysis.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <motion.div 
                              className="h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${aiAnalysis.confidence * 100}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                className={`px-6 py-2 rounded-lg glass ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-5 h-5"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Report
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}