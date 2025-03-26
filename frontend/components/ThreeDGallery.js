import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text, Environment, Stars, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";
import { motion } from "framer-motion";
import { FiInfo, FiLoader, FiAlertCircle } from "react-icons/fi";

const fetcher = (url) => fetch(url).then((res) => res.json());

function ImagePoint({ position, imageData, onClick }) {
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(imageData);
  }, [imageData]);

  const meshRef = useRef();

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const scale = hovered ? 1.2 : 1;

  return (
    <Float
      position={position}
      speed={5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        scale={[scale, scale, scale]}
      >
        <planeGeometry args={[1.5, 1]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
        <Html
          position={[0, -0.7, 0]}
          center
          distanceFactor={10}
          visible={hovered}
        >
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            Click to view
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-indigo-500 font-medium">{progress.toFixed(0)}%</span>
      </div>
    </Html>
  );
}

function EmptyState() {
  return (
    <>
      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />
      <Text 
        position={[0, 0, 0]} 
        fontSize={1.5} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
      >
        No images yet!
      </Text>
      <Text 
        position={[0, -1.5, 0]} 
        fontSize={0.8} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
      >
        Upload some to see them here
      </Text>
    </>
  );
}

export default function ThreeDGallery() {
  const [selectedImageData, setSelectedImageData] = useState(null);
  const { data: imagePoints, error: imagePointsError } = useSWR(
    "http://127.0.0.1:8000/image_points",
    fetcher
  );

  const handleImageClick = (imageData) => {
    setSelectedImageData(imageData);
  };

  const closeImagePreview = () => {
    setSelectedImageData(null);
  };

  if (imagePointsError) return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-red-50/50">
      <FiAlertCircle className="text-red-500 text-4xl mb-2" />
      <h3 className="text-lg font-medium text-red-800 mb-1">Connection Error</h3>
      <p className="text-sm text-center text-red-600">Failed to load image points. Please check the backend server.</p>
    </div>
  );
  
  if (!imagePoints) return (
    <div className="h-full flex flex-col items-center justify-center bg-indigo-50/50">
      <FiLoader className="text-indigo-500 text-4xl mb-2 animate-spin" />
      <h3 className="text-lg font-medium text-indigo-800">Loading 3D view</h3>
    </div>
  );
  
  return (
    <div className="h-full relative">
      {selectedImageData && (
        <motion.div 
          className="absolute inset-0 z-10 bg-black/80 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="relative max-w-full max-h-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white p-1 rounded-full"
              onClick={closeImagePreview}
            >
              &times;
            </button>
            <img 
              src={selectedImageData} 
              alt="Selected" 
              className="max-h-[80vh] max-w-full rounded-lg shadow-2xl" 
            />
          </motion.div>
        </motion.div>
      )}
      
      <div className="absolute bottom-2 left-2 z-10 text-xs bg-white/70 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full">
        <FiInfo className="inline mr-1" /> 
        <span>Drag to rotate, scroll to zoom</span>
      </div>
      
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <color attach="background" args={["#050816"]} />
        <fog attach="fog" args={["#050816", 15, 30]} />
        <Suspense fallback={<LoadingScreen />}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          
          {imagePoints.length === 0 ? (
            <EmptyState />
          ) : (
            imagePoints.map((point) => (
              <ImagePoint
                key={point.id}
                position={point.position}
                imageData={point.imageData}
                onClick={() => handleImageClick(point.imageData)}
              />
            ))
          )}
          
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
            autoRotate={imagePoints.length > 0}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
