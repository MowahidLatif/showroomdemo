import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TextureLoader, DoubleSide } from 'three';

const CarViewer = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(null);
  const [images, setImages] = useState([]);
  const accumulatedDeltaX = useRef(0); 

  const meshRef = useRef();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://i4tl32mww64ni2vkfjiaxxvzeq0paiqr.lambda-url.us-west-1.on.aws/');
        const data = await response.json();
        setImages(data.imageUrls || []);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchImages();
  }, []);

  const texture = images[currentImageIndex] ? new TextureLoader().load(images[currentImageIndex]) : null;

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

  const handleMove = useCallback((event) => {
    if (!isDragging) return;

    const currentX = event.clientX || (event.touches && event.touches[0].clientX);
    const deltaX = currentX - lastX;

    const sensitivity = window.innerWidth <= 768 ? 3 : 5; 

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


// import React, { useState, useRef, useCallback } from 'react';
// import { TextureLoader, DoubleSide } from 'three';

// const CarViewer = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [lastX, setLastX] = useState(null);
//   const accumulatedDeltaX = useRef(0); // To accumulate deltaX values

//   const meshRef = useRef();

//   // Load all the images
//   const images = Array.from({ length: 36 }, (_, i) => `/4ad8e2c2/${i + 1}.jpg`);
//   const texture = new TextureLoader().load(images[currentImageIndex]);

//   const handleStart = useCallback((event) => {
//     setIsDragging(true);
//     const x = event.clientX || (event.touches && event.touches[0].clientX);
//     setLastX(x);
//   }, []);

//   const handleEnd = useCallback(() => {
//     setIsDragging(false);
//     setLastX(null);
//     accumulatedDeltaX.current = 0;
//   }, []);

//   // const handleMove = useCallback((event) => {
//   //   if (!isDragging) return;

//   //   const currentX = event.clientX || (event.touches && event.touches[0].clientX);
//   //   const deltaX = currentX - lastX;

//   //   accumulatedDeltaX.current += deltaX;

//   //   if (Math.abs(accumulatedDeltaX.current) > 30) { // Adjust the threshold as needed
//   //     if (accumulatedDeltaX.current > 0) {
//   //       setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   //     } else {
//   //       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//   //     }
//   //     accumulatedDeltaX.current = 0; // Reset accumulated delta after updating the image
//   //   }

//   //   setLastX(currentX);
//   // }, [isDragging, lastX, images.length]);

//   const handleMove = useCallback((event) => {
//     if (!isDragging) return;

//     const currentX = event.clientX || (event.touches && event.touches[0].clientX);
//     const deltaX = currentX - lastX;

//     const sensitivity = window.innerWidth <= 768 ? 8 : 5; // Adjust sensitivity for mobile

//     if (deltaX > sensitivity) {
//         setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//     } else if (deltaX < -sensitivity) {
//         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }

//     setLastX(currentX);
// }, [isDragging, lastX, images.length]);


//   return (
//     <mesh
//       ref={meshRef}
//       position={[0, 0, 0]}
//       onPointerDown={handleStart}
//       onPointerUp={handleEnd}
//       onPointerMove={handleMove}
//       onPointerOut={handleEnd}
//       onTouchStart={handleStart}
//       onTouchEnd={handleEnd}
//       onTouchMove={handleMove}
//     >
//       <planeGeometry args={[8, 5]} />
//       <meshBasicMaterial map={texture} side={DoubleSide} />
//     </mesh>
//   );
// }

// export default CarViewer;
