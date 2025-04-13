import React, { useState, useEffect } from "react";
import useImageStore from "../store/useImageStore";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiCamera, FiX, FiMaximize, FiDownload, FiInfo, FiShare2, FiHeart } from "react-icons/fi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ImageGallery() {
  const { searchResults } = useImageStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLayout, setImageLayout] = useState("masonry"); // 'masonry' or 'grid'
  const [selectedImageDetails, setSelectedImageDetails] = useState(null);

  const { data: paginatedData, error: paginatedError } = useSWR(
    searchResults.length === 0
      ? `http://127.0.0.1:8000/paginated_images?page=${page}&page_size=${pageSize}`
      : null,
    fetcher
  );

  const imagesToDisplay =
    searchResults.length > 0 ? searchResults : paginatedData?.images;
  const totalImages =
    searchResults.length > 0 ? searchResults.length : paginatedData?.total;

  useEffect(() => {
    // Reset to page 1 when search results change
    if (searchResults.length > 0) {
      setPage(1);
    }
  }, [searchResults.length]);

  if (paginatedError) return (
    <motion.div 
      className="p-12 text-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FiCamera className="h-16 w-16 mx-auto text-red-300 mb-4" />
      <h3 className="text-xl font-medium text-red-500">Connection Error</h3>
      <p className="text-gray-600 mt-2">Please check that the backend server is running.</p>
      <button 
        className="mt-6 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </motion.div>
  );
  
  if (!imagesToDisplay || imagesToDisplay.length === 0) return (
    <motion.div 
      className="p-12 text-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FiImage className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      {!imagesToDisplay ? (
        <>
          <h3 className="text-xl font-medium text-gray-600">Loading images...</h3>
          <div className="mt-4 flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
              <div className="h-2 w-2 bg-indigo-400 rounded-full animation-delay-200"></div>
              <div className="h-2 w-2 bg-indigo-400 rounded-full animation-delay-400"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-medium text-gray-700">No images found</h3>
          <p className="text-gray-500 mt-2">
            {searchResults.length > 0 ? 
              "No matches found for your search query. Try using different keywords." : 
              "Upload some photos through the settings panel to get started."}
          </p>
        </>
      )}
    </motion.div>
  );

  const totalPages = Math.ceil(totalImages / pageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setPage(1); 
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    
    // Set image details for the modal
    if (searchResults.length > 0) {
      const imageData = searchResults.find(img => img.path === image.path);
      setSelectedImageDetails(imageData);
    } else {
      setSelectedImageDetails({ path: image, similarity: null });
    }
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImageDetails(null);
  };

  // Calculate column classes based on layout
  const getColumnClass = () => {
    if (imageLayout === 'grid') {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4";
    } else {
      // Masonry-like layout
      return "columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-4 space-y-4";
    }
  };

  // Modal component
  const ImageModal = () => {
    if (!selectedImage || !selectedImageDetails) return null;
    
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={closeImageModal}
        />
        
        {/* Modal container - scrollable */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-5xl rounded-xl bg-white shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  className="bg-black/20 hover:bg-black/40 p-2 rounded-full text-white transition-colors backdrop-blur-sm"
                  onClick={closeImageModal}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 bg-gray-900 flex items-center justify-center p-4">
                  <img 
                    src={`http://127.0.0.1:8000/image/${encodeURIComponent(
                      typeof selectedImage === 'string' ? selectedImage : selectedImage.path
                    )}`}
                    alt="Selected image" 
                    className="max-h-[70vh] max-w-full object-contain rounded-lg"
                  />
                </div>
                
                <div className="w-full md:w-80 p-6 bg-white overflow-y-auto flex flex-col">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Image Details</h3>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Filename</h4>
                      <p className="text-gray-900 break-all">
                        {typeof selectedImage === 'string' ? selectedImage : selectedImage.path}
                      </p>
                    </div>
                    
                    {selectedImageDetails.similarity && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Match Score</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${selectedImageDetails.similarity}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-indigo-600 font-medium">
                            {selectedImageDetails.similarity.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-6 border-t pt-4">
                    <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
                      <FiDownload size={16} />
                      <span>Download</span>
                    </button>
                    <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
                      <FiShare2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          {searchResults.length > 0 ? (
            <span className="inline-flex items-center gap-2">
              <FiHeart className="text-rose-500" />
              Search Results
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <FiImage className="text-indigo-500" />
              Gallery
            </span>
          )}
          <span className="ml-3 text-sm font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
            {totalImages} items
          </span>
        </h2>

        <div className="flex gap-2">
          <button 
            className={`p-2 rounded-lg transition-colors ${imageLayout === 'masonry' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            onClick={() => setImageLayout('masonry')}
            title="Masonry Layout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded-lg transition-colors ${imageLayout === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            onClick={() => setImageLayout('grid')}
            title="Grid Layout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>
        </div>
      </motion.div>

      <motion.div 
        className={getColumnClass()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {imagesToDisplay.map((image, index) => {
          const imagePath = searchResults.length > 0 ? image.path : image;
          const similarity = searchResults.length > 0 ? image.similarity : null;
          
          return (
            <motion.div
              key={index}
              className={`${imageLayout === 'masonry' ? 'mb-4 break-inside-avoid' : ''} group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: imageLayout === 'grid' ? 1.02 : 1 }}
              onClick={() => openImageModal(searchResults.length > 0 ? image : image)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={`http://127.0.0.1:8000/image/${encodeURIComponent(imagePath)}`}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors">
                      <FiMaximize size={14} />
                    </button>
                  </div>
                </div>
                
                {similarity && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {similarity.toFixed(0)}% match
                  </div>
                )}
              </div>
              
              <div className="p-3">
                {similarity && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{ width: `${similarity}%` }}
                    ></div>
                  </div>
                )}
                <h3 className="text-sm font-medium text-gray-700 truncate">
                  {imagePath}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {searchResults.length === 0 && totalPages > 1 && (
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Pagination className="justify-start">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                  />
                </PaginationItem>
              )}

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isWithinRange =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= page - 2 && pageNumber <= page + 2);

                if (isWithinRange) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        isActive={page === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNumber === page - 3 && pageNumber > 1) ||
                  (pageNumber === page + 3 && pageNumber < totalPages)
                ) {
                  return <PaginationEllipsis key={index} />;
                }
                return null;
              })}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
          <Select
            onValueChange={handlePageSizeChange}
            value={pageSize.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Images per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="18">18 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="36">36 per page</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Replace the modal section with the new component */}
      <AnimatePresence>
        {selectedImage && <ImageModal />}
      </AnimatePresence>
    </section>
  );
}
