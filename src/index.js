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



const ModelViewer = ({ model, position, rotation, clickHandler }) => {    
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model

    return <primitive onClick={ clickHandler } object={gltf.scene} position={position} rotation={rotation} />
 }

const Logo = () => {
    let fontLoader = new FontLoader();
    let taglineFont = fontLoader.parse(myFont);

    extend({TextGeometry});
    return (<>
         <ModelViewer
            model="./assets/models/hotwheels.gltf"
            position={[0, 0, -3]}
            rotation={[-Math.PI/10,0,0]}
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

const Car = ({ position, rotation, body, setBody }) => {

    return (
        <group rotation={ rotation } position={ position }>
            <Wheels />
            <Body body={ body} setBody={ setBody} />
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

let body;

const changeBody = (currBody) => {
    let bodies = ['jordan','heart'];
    if (currBody) {
        // remove current body from array
        bodies = bodies.filter((b) => b !== currBody);
    }

    let body = bodies[Math.floor(Math.random() * bodies.length)];
    return body;
}

// on click change body


const Body = ({position, body, setBody}) => {    


    return (<>
        <ModelViewer
            clickHandler = { () => setBody(changeBody(body)) }
            model={ `/assets/models/body/${ body }.gltf` }
            position={position}
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

const Scene = () => {

    
    const [body, setBody] = useState(changeBody());
    // set background color of scene    
  
    useFrame(() => {
      // Perform any animation or updates here
    });
  
    
  
    return (
      <>
        <pointLight position={[0, 10, 10]} intensity={1} />
        <pointLight position={[10, -10, 10]} intensity={1} />
        <OrbitControls />        
        {/* <axesHelper /> */}
        {/* <gridHelper /> */}
        <ambientLight intensity={0.3} />        
        <Logo/>

        <Car setBody={ setBody } body={ body } position={[0,-3,-8]} rotation={[0,-Math.PI/9,0]}/>
        <Ground/>

      </>
    );
  };
  
  

createRoot(document.getElementById('root')).render(
  <Canvas  camera={{ position: [0, 0, 1], fov: 75 }}
    onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x0000cc));
    }}>
     <Scene />
  </Canvas>,
)
