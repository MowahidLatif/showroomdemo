import React, { useState, useRef, useCallback } from 'react';
import { TextureLoader, DoubleSide } from 'three';

const CarViewer = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(null);
  const accumulatedDeltaX = useRef(0); // To accumulate deltaX values

  const meshRef = useRef();

  // Load all the images
  const images = Array.from({ length: 36 }, (_, i) => `/4ad8e2c2/${i + 1}.jpg`);
  const texture = new TextureLoader().load(images[currentImageIndex]);

  const handleStart = useCallback((event) => {
    setIsDragging(true);
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    setLastX(x);
  }, []);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setLastX(null);
    accumulatedDeltaX.current = 0;
  }, []);

  // const handleMove = useCallback((event) => {
  //   if (!isDragging) return;

  //   const currentX = event.clientX || (event.touches && event.touches[0].clientX);
  //   const deltaX = currentX - lastX;

  //   accumulatedDeltaX.current += deltaX;

  //   if (Math.abs(accumulatedDeltaX.current) > 30) { // Adjust the threshold as needed
  //     if (accumulatedDeltaX.current > 0) {
  //       setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  //     } else {
  //       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  //     }
  //     accumulatedDeltaX.current = 0; // Reset accumulated delta after updating the image
  //   }

  //   setLastX(currentX);
  // }, [isDragging, lastX, images.length]);

  const handleMove = useCallback((event) => {
    if (!isDragging) return;

    const currentX = event.clientX || (event.touches && event.touches[0].clientX);
    const deltaX = currentX - lastX;

    const sensitivity = window.innerWidth <= 768 ? 3 : 5; // Adjust sensitivity for mobile

    if (deltaX > sensitivity) {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    } else if (deltaX < -sensitivity) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }

    setLastX(currentX);
}, [isDragging, lastX, images.length]);


  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerMove={handleMove}
      onPointerOut={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchMove={handleMove}
    >
      <planeGeometry args={[8, 5]} />
      <meshBasicMaterial map={texture} side={DoubleSide} />
    </mesh>
  );
}

export default CarViewer;
