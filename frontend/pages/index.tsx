import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ImageGallery from "../components/ImageGallery";
import SearchBar from "../components/SearchBar";
import Settings from "../components/Settings";
import ThreeDGallery from "../components/ThreeDGallery";
import { FiSettings, FiCamera, FiImage, FiUpload } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useImageStore from "../store/useImageStore";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const { fetchAllImages, fetchImagePoints, setSelectedFiles, handleUpload } = useImageStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAllImages();
    fetchImagePoints();
  }, [fetchAllImages, fetchImagePoints]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
      await handleUpload();
      fetchAllImages();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900 font-sans">
      <Head>
        <title>Imace - AI Image Search</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Imace - Find your photos easily with AI-powered semantic search" />
      </Head>

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between mb-8 p-4 md:p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-500 p-2.5 rounded-xl shadow-md">
              <FiCamera className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Imace
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">AI-Powered Image Search</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              className="hidden md:flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleUploadClick}
            >
              <FiUpload className="text-indigo-600" />
              <span>Upload</span>
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <motion.button
              className="flex items-center space-x-2 bg-white hover:bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all shadow-sm"
              onClick={() => setShowSettings(!showSettings)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiSettings className={`${showSettings ? "rotate-90" : ""} transition-transform duration-300`} />
              <span className="hidden md:inline">{showSettings ? "Hide Settings" : "Settings"}</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Settings Section */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-6">
            {/* Search Bar */}
            <SearchBar />

            {/* Image Gallery */}
            <ImageGallery />
          </div>

          {/* 3D Gallery */}
          <motion.section 
            className="mb-6 order-1 lg:order-2 lg:col-span-4 rounded-xl border border-white/70 h-[40vh] lg:sticky lg:top-4 lg:h-[calc(100vh-(1rem+3rem+42px+2rem))] bg-white/50 backdrop-blur-md shadow-lg overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiImage className="text-white" />
                <span>3D Visualization</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <ThreeDGallery />
          </motion.section>
        </section>
      </main>
    </div>
  );
}
