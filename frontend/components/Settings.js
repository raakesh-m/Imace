import React, { useState } from "react";
import { FaUpload, FaTrash, FaX, FaInfo } from "react-icons/fa";
import { FiUploadCloud, FiTrash2, FiX, FiInfo, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useImageStore from "../store/useImageStore";

export default function Settings() {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const {
    selectedFiles,
    setSelectedFiles,
    isUploading,
    handleUpload,
    isDeleting,
    handleDelete,
    handleCancelUpload,
  } = useImageStore();

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
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  return (
    <motion.section 
      className="mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 py-4 px-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FiInfo className="mr-2 text-indigo-500" />
          Image Management
        </h2>
        <p className="text-sm text-gray-600 mt-1">Upload images or delete all your data</p>
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
                dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'
              } transition-colors cursor-pointer`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
              >
                <FiUploadCloud className="text-4xl text-indigo-400 mb-2" />
                <span className="text-gray-700 font-medium">Drop images here or click to browse</span>
                <span className="text-sm text-gray-500 mt-1">
                  Upload multiple images to search and organize
                </span>
              </label>
            </div>

            {/* Image Preview */}
            <AnimatePresence>
              {selectedFiles.length > 0 && (
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
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedFiles([])}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-100 rounded-lg bg-gray-50">
                      {selectedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          className="relative rounded-md overflow-hidden group shadow-sm"
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
                              className="p-1 bg-red-500 rounded-full text-white"
                              onClick={() => handleCancelUpload(index)}
                            >
                              <FiX className="text-sm" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                            {file.name}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    className={`w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors ${
                      isUploading || selectedFiles.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleUpload}
                    disabled={isUploading || selectedFiles.length === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
              )}
            </AnimatePresence>
          </div>

          {/* Delete All Data */}
          <div className="relative">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FiTrash2 className="mr-2 text-red-500" />
              Danger Zone
            </h3>
            
            <div className="border border-red-100 rounded-lg p-4 bg-red-50">
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
                      className="bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors w-full flex items-center justify-center"
                      onClick={() => setShowConfirmDelete(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiTrash2 className="mr-2" />
                      Delete All Data
                    </motion.button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-red-700 font-medium">Are you sure? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <motion.button
                          className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors ${
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
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
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
    </motion.section>
  );
}
