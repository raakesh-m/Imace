import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Float, 
  Text, 
  Environment, 
  Stars, 
  useProgress, 
  Html, 
  Trail
} from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { FiInfo, FiLoader, FiAlertCircle, FiMaximize2, FiMinimize2, FiX, FiZoomIn } from "react-icons/fi";
import useImageStore from "../store/useImageStore";

const fetcher = (url) => fetch(url).then((res) => res.json());

function ParticleField() {
  const count = 500;
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#8b5cf6"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

function ImagePoint({ position, imageData, imagePath, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(imageData);
  }, [imageData]);

  const meshRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float
      position={position}
      speed={2 + Math.random()}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <Trail
        width={1}
        color={new THREE.Color(0x8b5cf6)}
        length={4}
        decay={1}
        local={false}
        stride={0}
        interval={1}
        attenuation={(width) => width}
        visible={hovered}
      >
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onClick(imagePath, imageData)}
        >
          <planeGeometry args={[1.8, 1.3]} />
          <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
          <Html
            position={[0, -0.9, 0]}
            center
            distanceFactor={10}
            visible={hovered}
            occlude
          >
            <div className="px-2 py-1 rounded text-xs whitespace-nowrap font-medium bg-white/90 backdrop-blur-sm text-indigo-600 shadow-lg border border-indigo-100 flex items-center gap-1">
              <FiZoomIn size={10} />
              <span>View Image</span>
            </div>
          </Html>
        </mesh>
      </Trail>
    </Float>
  );
}

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center backdrop-blur-sm bg-black/30 px-6 py-4 rounded-xl">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-white font-medium">Loading 3D Space ({progress.toFixed(0)}%)</span>
      </div>
    </Html>
  );
}

function EmptyState() {
  return (
    <>
      <Stars radius={50} depth={50} count={1500} factor={4} fade speed={1} />
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
        position={[0, -1.8, 0]} 
        fontSize={0.8} 
        color="#a5b4fc" 
        anchorX="center" 
        anchorY="middle"
      >
        Upload images to see them in 3D space
      </Text>
    </>
  );
}

export default function ThreeDGallery() {
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { allImages } = useImageStore();
  
  const { data: imagePoints, error: imagePointsError } = useSWR(
    "http://127.0.0.1:8000/image_points",
    fetcher
  );

  const canvasRef = useRef();

  const handleImageClick = (imagePath, imageData) => {
    setSelectedImagePath(imagePath);
    setSelectedImageData(imageData);
  };

  const closeImagePreview = () => {
    setSelectedImageData(null);
    setSelectedImagePath(null);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (canvasRef.current?.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      } else if (canvasRef.current?.webkitRequestFullscreen) { // Safari
        canvasRef.current.webkitRequestFullscreen();
      } else if (canvasRef.current?.msRequestFullscreen) { // IE11
        canvasRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!document.fullscreenElement || 
        !!document.webkitFullscreenElement || 
        !!document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (imagePointsError) return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-red-50/30 backdrop-blur-sm">
      <FiAlertCircle className="text-red-500 text-4xl mb-3" />
      <h3 className="text-lg font-medium text-red-800 mb-1">Connection Error</h3>
      <p className="text-sm text-center text-red-600">Failed to load 3D visualization. Please check the backend server.</p>
    </div>
  );
  
  if (!imagePoints) return (
    <div className="h-full flex flex-col items-center justify-center bg-indigo-50/30 backdrop-blur-sm">
      <div className="animate-spin h-10 w-10 mb-4">
        <FiLoader className="text-indigo-500 text-4xl" />
      </div>
      <h3 className="text-lg font-medium text-indigo-800">Loading 3D visualization</h3>
    </div>
  );
  
  return (
    <div className="h-full relative" ref={canvasRef}>
      <AnimatePresence>
        {selectedImageData && (
          <motion.div 
            className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-2 right-2 flex gap-2 z-20">
                <button 
                  className="bg-black/70 hover:bg-white/70 text-white hover:text-black p-2 rounded-full transition-colors"
                  onClick={closeImagePreview}
                  aria-label="Close"
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={selectedImageData} 
                  alt="Selected" 
                  className="max-h-[70vh] max-w-full object-contain bg-black" 
                />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded text-white text-sm">
                {selectedImagePath || "Image"}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-3 left-3 z-10 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center">
        <FiInfo className="inline mr-1.5" /> 
        <span>Drag to rotate | Scroll to zoom</span>
      </div>

      <button 
        className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-1.5 rounded-full transition-colors"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
      </button>
      
      <Canvas camera={{ position: [0, 0, 20], fov: 70 }}>
        <color attach="background" args={["#0a0a29"]} />
        <fog attach="fog" args={["#0a0a29", 15, 35]} />
        <Suspense fallback={<LoadingScreen />}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          
          <ParticleField />
          
          {!imagePoints || imagePoints.length === 0 ? (
            <EmptyState />
          ) : (
            imagePoints.map((point, index) => (
              <ImagePoint
                key={point.id || index}
                position={point.position}
                imageData={point.imageData}
                imagePath={allImages[index] || `Image ${index + 1}`}
                onClick={handleImageClick}
                index={index}
              />
            ))
          )}
          
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.5} />
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
            autoRotate={!selectedImageData && imagePoints?.length > 0}
            autoRotateSpeed={0.5}
            zoomSpeed={0.8}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-3 right-3 z-10 text-white text-xs bg-indigo-600/80 backdrop-blur-md px-2 py-1 rounded">
        {imagePoints?.length || 0} images in 3D space
      </div>
    </div>
  );
}
