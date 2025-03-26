import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import useImageStore from "../store/useImageStore";

const EXAMPLE_SEARCHES = [
  "mountains with snow",
  "sunset over the ocean",
  "people smiling",
  "dogs playing",
  "city skyline"
];

export default function SearchBar() {
  const { searchQuery, setSearchQuery, isSearching } = useImageStore();
  const [focused, setFocused] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const applyExampleSearch = (example) => {
    setSearchQuery(example);
  };

  return (
    <div className="mb-12">
      <motion.div 
        className={`relative flex items-center rounded-xl bg-white border ${focused ? 'border-indigo-300 shadow-lg' : 'border-gray-200 shadow-sm'} transition-all duration-300`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          id="search-query"
          type="text"
          className="w-full px-6 py-4 pl-14 pr-8 rounded-xl focus:outline-none text-gray-700"
          placeholder="Search images by describing what you're looking for..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <motion.div
          className="absolute left-6"
          animate={{ 
            scale: isSearching ? 0.8 : 1,
            opacity: isSearching ? 0.5 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <FaSearch className="text-indigo-400" />
        </motion.div>
        
        {isSearching && (
          <svg
            className="animate-spin h-5 w-5 text-indigo-600 absolute right-6"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </motion.div>

      {/* Example searches */}
      <div className="flex flex-wrap mt-2 gap-2">
        <span className="text-xs text-gray-500">Try:</span>
        {EXAMPLE_SEARCHES.map((example, index) => (
          <motion.button
            key={index}
            className="text-xs px-3 py-1 bg-white/70 hover:bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => applyExampleSearch(example)}
          >
            {example}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
