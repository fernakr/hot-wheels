import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { CylinderGeometry } from 'three/src/geometries/CylinderGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//import font from 'three/examples/fonts/helvetiker_regular.typeface.json'

import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three';
import myFont from './flash_rogers.typeface.json';



const ModelViewer = ({ model, position, rotation, scale, clickHandler }) => {    
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model

    return <primitive   onClick={ clickHandler } object={gltf.scene} position={position} rotation={rotation} scale={ scale } />
 }

const Logo = () => {
    let fontLoader = new FontLoader();
    let taglineFont = fontLoader.parse(myFont);

    extend({TextGeometry});
    return (<>
         <ModelViewer
            model="./assets/models/hotwheels.gltf"
            position={[0, 0, -7.5]}
            rotation={[0,0,0]}
        />
        {/* Add text  */}
        <mesh position={[0, -2, -3]}>
            { taglineFont && 
                <mesh position={[-1,5.7,-8.5]}>
                    <textGeometry attach="geometry" args={[`"We'll make a car\n out of anything!!"`, { font: taglineFont, size: 0.7, height: .06}]} />
                    <meshStandardMaterial attach="material" color="white" />
                </mesh>
            }
            <meshStandardMaterial attach="material" color="white" />
        </mesh>

    </>) 
};

const Car = ({ position, rotation, body, setBodyIndex }) => {

    return (
        <group rotation={ rotation } position={ position }>
            <Wheels />
            <Body body={ body} setBodyIndex={ setBodyIndex} />
        </group>
    )
};

const Axel = () => {
    extend({CylinderGeometry})
    return (<>
        <mesh position={[0,1,-2]} rotation={ [0,0,Math.PI/2] }>
            
            <cylinderGeometry attach="geometry" args={[0.05,0.05,4]} />
            <meshPhongMaterial attach="material" color="#ffffff" />
        </mesh>
    </>)
}
        

const Wheels = () => {
    return (<>
        <BackWheels />
        <FrontWheels position={[0,0,1] } scale={[0.8,0.8,0.8]}/>
    </>)
};

const BackWheels = ({ position }) => {
    return (<>
        <group position={ position }>
            <Axel />
            <ModelViewer
                model="./assets/models/wheels.gltf"                
            />
        </group>
    </>)
};


const FrontWheels = ({ position, scale }) => {
    return (<>
        <group position={ position } scale={ scale }>
            <Axel/>
            <ModelViewer
                model="./assets/models/wheels-front.gltf"                                
            />
        </group>
    </>)
};

let bodies = ['jordan','heart','kitten','nugget','torso'];    

const changeBody = (currBody) => {
    let bodyIndex = currBody;
    bodyIndex+= 1;
    if (bodyIndex > bodies.length - 1) {
        bodyIndex = 0;
    }
    return bodyIndex; 
}

// on click change body


const Body = ({position, body, setBodyIndex, rotation, scale}) => {    

    const bodyAsset = bodies[body];

    return (<>
        <ModelViewer
            clickHandler = { () => setBodyIndex(changeBody(body)) }
            model={ `/assets/models/body/${ bodyAsset }.gltf` }
            position={position}
            rotation={ rotation }
            scale={ scale }
        />
    </>)
};

const Ground = () => {
    extend({PlaneGeometry})
    return (<>
        <mesh position={[0,0,-12]}>
            
            <planeGeometry attach="geometry" args={[100,100]} />
            <meshPhongMaterial attach="material" color="#000066" />
        </mesh>
    </>)
}

const Base = () => {
    extend({CylinderGeometry})
    return (<>
        <mesh position={[0,-4,-9]} rotation={ [0,0,0] }  >
            
            <cylinderGeometry attach="geometry" args={[5,5,1]} />
            <meshPhysicalMaterial attach="material" color="#333" />
        </mesh>
    </>)
};


const Scene = () => {

    
    const [body, setBodyIndex] = useState(0);
    // set background color of scene    
  
    useFrame(() => {
      // Perform any animation or updates here
    });
  
    
  
    return (
      <>
        <pointLight position={[0, 10, 10]} intensity={1}  />
        <pointLight position={[10, -10, 10]} intensity={1}  />
        <OrbitControls />        
        {/* <axesHelper />
        <gridHelper /> */}
        <ambientLight intensity={0.3}  />        
        <Logo/>

        <Car setBodyIndex={ setBodyIndex } body={ body } position={[0,-3.5,-7]} rotation={[0,-Math.PI/9,0]}/>
        <Base/>
        <Ground/>

      </>
    );
  };

  
  

createRoot(document.getElementById('root')).render(
  <Canvas 
    camera={{ position: [0, 0, 0], fov: 75 }}
    onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x0000cc));
    }}>
     <Scene />
  </Canvas>,
)
