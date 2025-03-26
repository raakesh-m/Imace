import React, { useState } from "react";
import useImageStore from "../store/useImageStore";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiCamera, FiX, FiMaximize, FiMinimize, FiStar } from "react-icons/fi";
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
  const [pageSize, setPageSize] = useState(12);
  const [selectedImage, setSelectedImage] = useState(null);

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

  if (paginatedError) return (
    <motion.div 
      className="p-12 text-center bg-white rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FiCamera className="h-16 w-16 mx-auto text-red-300 mb-4" />
      <h3 className="text-xl font-medium text-red-500">Failed to load images</h3>
      <p className="text-gray-600 mt-2">Please check that the backend server is running.</p>
    </motion.div>
  );
  
  if (!imagesToDisplay || imagesToDisplay.length === 0) return (
    <motion.div 
      className="p-12 text-center bg-white rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FiImage className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      {!imagesToDisplay ? (
        <h3 className="text-xl font-medium text-gray-600">Loading images...</h3>
      ) : (
        <>
          <h3 className="text-xl font-medium text-gray-700">No images found</h3>
          <p className="text-gray-500 mt-2">
            Upload some photos through the settings panel to get started.
          </p>
        </>
      )}
    </motion.div>
  );

  const totalPages = Math.ceil(totalImages / pageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setPage(1); // Reset to first page when changing page size
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  return (
    <section>
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">
          {searchResults.length > 0 ? (
            <>
              <span className="inline-flex items-center">
                <FiStar className="mr-2 text-yellow-500" />
                Search Results
              </span>
            </>
          ) : (
            "Gallery"
          )}
          {!searchResults.length > 0 && (
            <span className="text-indigo-600 ml-2 mb-1 text-sm font-medium bg-indigo-50 px-2 py-1 rounded-full">
              {totalImages} items
            </span>
          )}
        </h2>
        {searchResults.length > 0 && (
          <span className="text-sm text-gray-500">
            Found {searchResults.length} results
          </span>
        )}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {imagesToDisplay.map((image, index) => (
          <motion.div
            key={index}
            className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openImageModal(searchResults.length > 0 ? image.path : image)}
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={`http://127.0.0.1:8000/image/${encodeURIComponent(
                  searchResults.length > 0 ? image.path : image
                )}`}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <FiMaximize className="text-white h-8 w-8" />
              </div>
            </div>
            <div className="p-4">
              {searchResults.length > 0 && (
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${image.similarity}%` }}
                  ></div>
                </div>
              )}
              {searchResults.length > 0 && (
                <p className="text-indigo-600 font-medium text-sm mb-1">
                  {image.similarity.toFixed(2)}% match
                </p>
              )}
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {searchResults.length > 0 ? image.path : image}
              </h3>
            </div>
          </motion.div>
        ))}
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
                    onClick={() => handlePageChange(page - 1)}
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
                        onClick={() => handlePageChange(pageNumber)}
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
                    onClick={() => handlePageChange(page + 1)}
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
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="36">36 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <button 
                  className="bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white transition-colors"
                  onClick={closeImageModal}
                >
                  <FiX />
                </button>
              </div>
              <img 
                src={`http://127.0.0.1:8000/image/${encodeURIComponent(selectedImage)}`}
                alt="Selected image" 
                className="max-h-[80vh] max-w-full object-contain"
              />
              <div className="p-4 bg-white">
                <h3 className="text-lg font-medium text-gray-900">{selectedImage}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
