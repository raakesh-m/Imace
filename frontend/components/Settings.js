import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiTrash2, FiX, FiInfo, FiAlertCircle, FiImage, FiSettings, FiCheckCircle, FiHardDrive } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useImageStore from "../store/useImageStore";
import axios from "axios";

export default function Settings() {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [storageUsed, setStorageUsed] = useState({ loading: true, size: 0 });
  
  const {
    selectedFiles,
    setSelectedFiles,
    isUploading,
    handleUpload,
    isDeleting,
    handleDelete,
    handleCancelUpload,
    allImages,
    fetchAllImages
  } = useImageStore();

  // Calculate storage used
  useEffect(() => {
    const calculateStorageSize = async () => {
      if (allImages && allImages.length > 0) {
        try {
          setStorageUsed({ loading: true, size: 0 });
          const response = await axios.get("http://127.0.0.1:8000/storage_size");
          setStorageUsed({ 
            loading: false, 
            size: response.data.size_bytes
          });
        } catch (error) {
          console.error("Error fetching storage size:", error);
          setStorageUsed({ loading: false, size: -1 });
        }
      } else {
        setStorageUsed({ loading: false, size: 0 });
      }
    };

    calculateStorageSize();
  }, [allImages]);

  // Format bytes to human-readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    if (bytes < 0) return 'Unknown';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (!isUploading && selectedFiles.length === 0 && uploadComplete) {
      const timer = setTimeout(() => setUploadComplete(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isUploading, selectedFiles.length, uploadComplete]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Only accept image files
      const imageFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      setSelectedFiles(imageFiles);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUploadComplete = async () => {
    await handleUpload();
    setUploadComplete(true);
    fetchAllImages();
  };

  return (
    <motion.section 
      className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 via-indigo-50 to-purple-50 py-5 px-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FiSettings className="mr-2 text-indigo-500" />
          Settings & Management
        </h2>
        <p className="text-sm text-gray-600 mt-1">Configure your image library and application settings</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Images with Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FiUploadCloud className="mr-2 text-indigo-500" />
              Upload Images
            </h3>
            
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center ${
                dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
              } transition-colors cursor-pointer bg-white/50`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
              >
                <div className={`mb-3 p-3 rounded-full ${dragActive ? 'bg-indigo-100' : 'bg-indigo-50'}`}>
                  <FiUploadCloud className="text-4xl text-indigo-500" />
                </div>
                <span className="text-gray-700 font-medium">
                  {dragActive ? "Drop images here" : "Drop images here or click to browse"}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Supported: JPG, PNG, WEBP, GIF
                </span>
              </label>
            </div>

            {/* Image Preview */}
            <AnimatePresence>
              {selectedFiles.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">Selected Images ({selectedFiles.length})</h4>
                      <button
                        className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedFiles([])}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                      {selectedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          className="relative rounded-lg overflow-hidden group shadow-sm"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors"
                              onClick={() => handleCancelUpload(index)}
                              aria-label="Remove image"
                            >
                              <FiX className="text-sm" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-xs p-1 truncate">
                            {file.name}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    className={`w-full flex items-center justify-center ${
                      selectedFiles.length === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isUploading 
                          ? "bg-indigo-400 text-white cursor-wait"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    } font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                    onClick={handleUploadComplete}
                    disabled={isUploading || selectedFiles.length === 0}
                    whileHover={{ scale: selectedFiles.length === 0 ? 1 : 1.02 }}
                    whileTap={{ scale: selectedFiles.length === 0 ? 1 : 0.98 }}
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUploadCloud className="mr-2" />
                        Upload {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''}
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : uploadComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg text-green-700 flex items-center"
                >
                  <FiCheckCircle className="mr-2 text-green-500" />
                  <span>Images successfully uploaded!</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Library Stats & Danger Zone */}
          <div className="space-y-6">
            {/* Library Stats */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FiImage className="mr-2 text-indigo-500" />
                Library Status
              </h3>
              
              <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    {allImages.length}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center">
                    <FiHardDrive className="mr-1.5 text-gray-500" />
                    Storage Used
                  </span>
                  <span className="font-medium text-gray-800">
                    {storageUsed.loading ? (
                      <div className="flex items-center">
                        <div className="w-3 h-3 border-t-2 border-indigo-500 rounded-full animate-spin mr-2"></div>
                        Calculating...
                      </div>
                    ) : (
                      <span className={storageUsed.size > 100 * 1024 * 1024 ? "text-orange-600" : "text-indigo-600"}>
                        {formatBytes(storageUsed.size)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Backend Status</span>
                  <span className="font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    Connected
                  </span>
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FiTrash2 className="mr-2 text-red-500" />
                Danger Zone
              </h3>
              
              <div className="border border-red-100 rounded-lg p-5 bg-red-50">
                <div className="flex items-start">
                  <FiAlertCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-700 mb-1">Delete All Data</h4>
                    <p className="text-sm text-red-600 mb-4">
                      This will permanently delete all your images and associated data. 
                      This action cannot be undone.
                    </p>
                    
                    {!showConfirmDelete ? (
                      <motion.button
                        className="bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors w-full flex items-center justify-center"
                        onClick={() => setShowConfirmDelete(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiTrash2 className="mr-2" />
                        Delete All Data
                      </motion.button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-red-700 font-medium py-1 px-2 bg-red-100 rounded">Are you sure? This cannot be undone.</p>
                        <div className="flex gap-2">
                          <motion.button
                            className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors ${
                              isDeleting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={handleDelete}
                            disabled={isDeleting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isDeleting ? (
                              <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Deleting...
                              </>
                            ) : (
                              <>Yes, Delete All</>
                            )}
                          </motion.button>
                          <motion.button
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                            onClick={() => setShowConfirmDelete(false)}
                            disabled={isDeleting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
