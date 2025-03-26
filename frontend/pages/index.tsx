import React, { useState } from "react";
import Head from "next/head";
import ImageGallery from "../components/ImageGallery";
import SearchBar from "../components/SearchBar";
import Settings from "../components/Settings";
import ThreeDGallery from "../components/ThreeDGallery";
import { FiSettings, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900 font-sans">
      <Head>
        <title>Imace - Smart Image Search</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Imace - Find your photos easily with AI-powered search" />
      </Head>

      <main className="container mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <FiCamera className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Imace
            </h1>
          </div>
          <motion.button
            className="flex items-center space-x-2 bg-white hover:bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all shadow-sm"
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSettings className={`${showSettings ? "rotate-90" : ""} transition-transform duration-300`} />
            <span>{showSettings ? "Hide Settings" : "Settings"}</span>
          </motion.button>
        </motion.header>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: showSettings ? 1 : 0,
            height: showSettings ? "auto" : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {showSettings && <Settings />}
        </motion.div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 order-2 lg:order-1">
            {/* Search Bar */}
            <SearchBar />

            {/* Image Gallery */}
            <ImageGallery />
          </div>

          {/* 3D Gallery */}
          <motion.section 
            className="mb-12 order-1 lg:order-2 lg:col-span-4 rounded-xl border border-gray-200 h-[60vh] lg:sticky lg:top-4 lg:h-[calc(100vh-(1rem+3rem+42px+2rem))] bg-white/90 backdrop-blur-sm shadow-md overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium">
              3D Visualization
            </div>
            <ThreeDGallery />
          </motion.section>
        </section>
      </main>
    </div>
  );
}
