import React, { useState, useRef } from "react";
import { FiSearch, FiX, FiClock, FiTrendingUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useImageStore from "../store/useImageStore";

const EXAMPLE_SEARCHES = [
  "mountains with snow",
  "sunset over the ocean",
  "people smiling",
  "dogs playing",
  "city skyline",
  "forest landscape",
  "beach vacation"
];

const TRENDING_SEARCHES = [
  "minimalist design",
  "architectural photography",
  "nature closeups"
];

export default function SearchBar() {
  const { searchQuery, setSearchQuery, isSearching, searchResults } = useImageStore();
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const applySearch = (query) => {
    setSearchQuery(query);
    // Save to recent searches if not already there
    if (!recentSearches.includes(query) && query.trim() !== "") {
      const updated = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
    if (inputRef.current) inputRef.current.focus();
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="mb-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`relative flex items-center rounded-2xl bg-white/80 backdrop-blur-sm border ${focused ? 'border-indigo-300 shadow-lg ring-2 ring-indigo-100' : 'border-white shadow-md'} transition-all duration-300`}>
          <div className="flex-shrink-0 pl-4">
            <motion.div
              animate={{ 
                scale: isSearching ? [1, 1.2, 1] : 1,
                rotate: isSearching ? [0, 180, 360] : 0,
              }}
              transition={{ 
                duration: isSearching ? 1.5 : 0.2,
                repeat: isSearching ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <FiSearch className={`text-lg ${isSearching ? 'text-indigo-600' : 'text-indigo-400'}`} />
            </motion.div>
          </div>
          
          <input
            ref={inputRef}
            id="search-query"
            type="text"
            className="w-full px-4 py-4 rounded-2xl bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
            placeholder="Search images with natural language..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
          />
          
          {searchQuery && (
            <button
              className="mr-3 p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={clearSearch}
            >
              <FiX className="text-gray-500" />
            </button>
          )}
        </div>

        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full max-w-3xl mt-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-4 space-y-4"
          >
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiClock className="mr-2" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={`recent-${index}`}
                      className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-full border border-gray-200 transition-all"
                      onClick={() => applySearch(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FiTrendingUp className="mr-2" />
                <span>Trending</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((example, index) => (
                  <motion.button
                    key={`trend-${index}`}
                    className="text-sm px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full border border-indigo-100 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applySearch(example)}
                  >
                    {example}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>Suggestions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_SEARCHES.map((example, index) => (
                  <motion.button
                    key={`example-${index}`}
                    className="text-sm px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-gray-200 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applySearch(example)}
                  >
                    {example}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Status and metrics */}
        {searchResults.length > 0 && (
          <motion.div 
            className="flex items-center justify-between text-sm text-gray-500 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center">
              <span className="text-indigo-600 font-medium">{searchResults.length} results</span>
              <span className="mx-2">•</span>
              <span>sorted by relevance</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
