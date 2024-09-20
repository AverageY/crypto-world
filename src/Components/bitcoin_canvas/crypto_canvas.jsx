import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import CanvasLoader from "./Loader";

const Rotate = ({ children }) => {
  const ref = useRef();
  const rotationSpeed = 0.01; // Adjust the speed as needed
  const startRotation = Math.PI; // 180 degrees in radians
  const targetRotation = 2 * Math.PI; // 360 degrees in radians
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useFrame(() => {
    if (ref.current) {
      // Rotate forward until the target rotation, then backward
      ref.current.rotation.y += rotationSpeed * direction;

      // When reaching the target rotation, reverse the direction
      if (ref.current.rotation.y >= targetRotation) {
        setDirection(-1); // Start rotating backward
      } else if (ref.current.rotation.y <= startRotation) {
        setDirection(1); // Start rotating forward
      }
    }
  });

  // Set the initial rotation to 180 degrees
  return <group ref={ref} rotation={[0, startRotation, 0]}>{children}</group>;
};


const Crypto = () => {
  // Use the path relative to the public folder
  const { scene } = useGLTF('/ethereum/scene.gltf'); 

  return (
    <Rotate>
      <hemisphereLight intensity={3} groundColor="black" />
      <ambientLight intensity={1}/>
      {/* Add your lights here */}
      <spotLight
        position={[-3.5, 0, 0]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[-7, 1.2, 0]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
       <spotLight
        position={[-7.3, 1.2, 0]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[-5, 0.7, -0.2]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[3.5, 1.5, 0]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[4.5, 2.5, 0]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
       <spotLight
        position={[5, 3, 0]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[6, 4, 0]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[7.6, 4.5, 1]}
        angle={1}
        penumbra={2}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={10} />
      <primitive
        object={scene}
        scale={0.8}
        position={[0, 1, 14]}
        rotation={[0, 0, 0]} // Initial rotation
      />
    </Rotate>
  );
};

const CryptoCanvas = () => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/knowmore');
  };

  return (
    <div className="relative w-full h-full">
      {/* Centered div with heading, byline, and button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-4 -mt-4">
        <h1 className="text-white text-4xl mb-2">Welcome to Crypto World</h1>
        <p className="text-white text-xl mb-4">Experience the Future of Digital Assets</p>
        <button 
        onClick={handleNavigate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
          Know More
        </button>
      </div>
      <Canvas
        frameloop="always"
        shadows
        dpr={[1, 2]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Crypto />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default CryptoCanvas;
