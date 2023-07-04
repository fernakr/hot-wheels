import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//import font from 'three/examples/fonts/helvetiker_regular.typeface.json'

import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three';
import myFont from './helvetiker_regular.typeface.json';

const ModelViewer = ({ model, position }) => {    
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model

    return <primitive object={gltf.scene} position={position} />
 }

const Logo = () => {
    let fontLoader = new FontLoader();
    let taglineFont = fontLoader.parse(myFont);

    extend({TextGeometry});
    return (<>
         <ModelViewer
            model="./assets/models/hotwheels.gltf"
            position={[0, -1.5, -3]}
        />
        {/* Add text  */}
        <mesh position={[0, -2, -3]}>
            { taglineFont && 
                <mesh position={[-1,6,-8]}>
                    <textGeometry attach="geometry" args={[`"We'll make a car\n out of anything!!"`, { font: taglineFont, size: 0.4, height: .01}]} />
                    <meshStandardMaterial attach="material" color="white" />
                </mesh>
            }
            <meshStandardMaterial attach="material" color="white" />
        </mesh>

    </>) 
};

const Car = ({ position, rotation }) => {

    return (
        <group rotation={ rotation } position={ position }>
            <Wheels />
            <Body  />
        </group>
    )
};

const Wheels = () => {
    return (<>
        <BackWheels />
        <FrontWheels position={[0,0,3] }/>
    </>)
};

const BackWheels = ({ position }) => {
    return (<>
        <ModelViewer
            model="./assets/models/wheels.gltf"
            position={ position }
        />
    </>)
};


const FrontWheels = ({ position }) => {
    return (<>
        <ModelViewer
            model="./assets/models/wheels-front.gltf"
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

const Ground = () => {
    extend({PlaneGeometry})
    return (<>
        <mesh rotation={[0,Math.PI/2,0]} position={[0,0,0]}>
            
            <planeGeometry attach="geometry" args={[100,100]} />
            <meshStandardMaterial attach="material" color="white" />
        </mesh>
    </>)
}

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

        <Car position={[0,-3,-8]} rotation={[0,-Math.PI/9,0]}/>
        <Ground/>

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
