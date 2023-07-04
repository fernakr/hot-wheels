import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import font from 'three/examples/fonts/helvetiker_regular.typeface.json'

import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three';


const ModelViewer = ({ model, position }) => {    
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model

    return <primitive object={gltf.scene} position={ position } />
 }

const Logo = () => {
    extend({TextGeometry});
    return (<>
         <ModelViewer
            model="./assets/models/hotwheels.gltf"
            position={[0, 0, -3]}
        />
        {/* Add text  */}
        <mesh position={[0, 0, -3]}>
            <textGeometry attach="geometry" args={['Hot Wheels', { font: font}]} />
            <meshStandardMaterial attach="material" color="white" />
        </mesh>

    </>) 
};

const Car = ({ position }) => {
    const wheelsPosition = [...position];
    const frontWheelsPosition = [...position];
    // frontWheelsPosition[0] = position[0] + 1;
    // frontWheelsPosition[1] = position[1] + 1;
    frontWheelsPosition[2] = position[2] + 10;
    return (<>
        <Wheels position={wheelsPosition}/>
        <Wheels position={frontWheelsPosition}/>
        <Body  position={position}/>
    </>)
};

const Wheels = ({ position }) => {
    return (<>
        <ModelViewer
            model="./assets/models/wheels.gltf"
            position={ position }
        />
    </>)
};

const Body = ({position}) => {
    return (<>
        <ModelViewer
            model="./assets/models/body.gltf"
            position={position}
        />
    </>)
};

const Scene = () => {
    // set background color of scene    
  
    useFrame(() => {
      // Perform any animation or updates here
    });
  
    
  
    return (
      <>
        <pointLight position={[0, 0, -3]} intensity={1} />
        <pointLight position={[0, -10, -10]} intensity={1} />
        <OrbitControls />        
        {/* <axesHelper /> */}
        {/* <gridHelper /> */}
        <ambientLight intensity={0.3} />        
        <Logo/>

        <Car position={[0,0,-10]}/>

      </>
    );
  };
  
  

createRoot(document.getElementById('root')).render(
  <Canvas  camera={{ position: [0, 0, 5], fov: 75 }}
    onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x0000ff));
    }}>
     <Scene />
  </Canvas>,
)
