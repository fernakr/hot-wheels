import { createRoot } from 'react-dom/client'
import React, { useRef, useState, Suspense } from 'react'
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { CylinderGeometry } from 'three/src/geometries/CylinderGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//import font from 'three/examples/fonts/helvetiker_regular.typeface.json'

import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls, SoftShadows } from '@react-three/drei'
import * as THREE from 'three';
import myFont from './flash_rogers.typeface.json';

let bodies = ['jordan','heart','kitten','nugget','torso'];

const ModelViewer = ({ model, position, rotation, scale, clickHandler }) => {    
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model

    return <primitive  castShadow onClick={ clickHandler } object={gltf.scene} position={position} rotation={rotation} scale={ scale } />
 }

const Logo = () => {
    let fontLoader = new FontLoader();
    let taglineFont = fontLoader.parse(myFont);

    extend({TextGeometry});
    return (<>
         <ModelViewer
            model="./assets/models/hotwheels.gltf"
            position={[0, 0, -8]}
            rotation={[Math.PI/20,0,0]}
        />
        {/* Add text  */}
        
            { taglineFont && 
                <mesh position={[-1,3,-7]}>
                    <textGeometry attach="geometry" args={[`"We'll make a car\n out of anything!!"`, { font: taglineFont, size: 0.7, height: .01}]} />
                    <meshStandardMaterial attach="material" color="white" />
                </mesh>
            }
            

    </>) 
};


const Ground = () => {
    extend({PlaneGeometry})
    return (<>
        <mesh position={[0,0,-16]}>
            
            <planeGeometry attach="geometry" args={[100,100]} />
            <meshPhongMaterial attach="material" color="#000066" />
        </mesh>
    </>)
}

const Base = () => {
    extend({CylinderGeometry})
    return (<>
        <mesh receiveShadow position={[0,-5,-11.85]} rotation={ [0,0,0] }  >
            
            <shadowMaterial opacity={1} />
            <cylinderGeometry attach="geometry" args={[6,6.25,0.4,50,2]} />
            <meshPhysicalMaterial clearcoatRoughness={0} clearcoat={1} color="#555" roughness={0}/>
        </mesh>
    </>)
};

const Configurator = () => {
    
    const [body, setBody] = useState('jordan');
        
    const Car = ({ position, rotation, body, setBody }) => {

        return (
            <group rotation={ rotation } position={ position }>
                <Wheels />
                <Body body={ body} setBody={ setBody} />
            </group>
        )
    };

    const Axel = ({ position }) => {
        extend({CylinderGeometry})
        return (<>
            <group position={ position }>
                <mesh position={[0,1,-2]}  rotation={ [0,0,Math.PI/2] }>
                    
                    <cylinderGeometry attach="geometry" args={[0.05,0.05,4]} />
                    <meshLambertMaterial attach="material" color="white" roughness={0} metalness={0.1} />
                </mesh>
            </group>
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
                <Axel position={ position }/>
                <ModelViewer
                    model="./assets/models/wheels.gltf"                
                />
            </group>
        </>)
    };


    const FrontWheels = ({ position, scale }) => {
        return (<>
            <group position={ position } >
                <Axel/>
                <ModelViewer
                    scale={ scale }
                    model="./assets/models/wheels-front.gltf"                                
                />
            </group>
        </>)
    };

    

    const changeBody = (currBody) => {    
        let index  = bodies.indexOf(currBody);
        index++;
        if (index > bodies.length - 1) index = 0;    
        return bodies[index];
    }

    // on click change body


    const Body = ({position, body, setBody, rotation, scale}) => {    




        return (<>
            <ModelViewer
                clickHandler = { () => setBody(changeBody(body)) }
                model={ `/assets/models/body/${ body }.gltf` }
                position={ position }
                rotation={ rotation }
                scale={ scale }
            />
        </>)
    };
    return (
        <>
            <Car setBody={ setBody } body={ body } position={[0,-3.5,-7]} rotation={[0,-Math.PI/9,0]}/>        
        </>
    )
}

const ModelPreload = () => {
    return bodies.forEach((body) => {
        return (
            <ModelViewer
                model={ `/assets/models/body/${ body }.gltf` }
            />
        )
    });
}


const Scene = () => {
        
    // set background color of scene    
  
    useFrame(() => {
      // Perform any animation or updates here
    });
  
    
  
    return (
      <>
        <OrbitControls />        

        <pointLight position={[-10, 10, -10]} radius={10} color="#3333300" intensity={1.5} castShadow />
        <pointLight position={[10, -10, 10]} intensity={1} castShadow />        
        <ambientLight intensity={0.3} castShadow />        
        
        <Logo/>

        <Base/>
        <Ground/>

        <Configurator/>
        <ModelPreload/>
      </>
    );
  };

  
  

createRoot(document.getElementById('root')).render(
  <Canvas      
    camera={{ position: [0, 0, 0], fov: 80 }}
    onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x0000cc));
    }}>        
     <Scene />
     
     <EffectComposer>
        {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.3} height={1000} />         */}
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

     <SoftShadows size= {{ value: 25, min: 0, max: 100 }}
        focus= {{ value: 0, min: 0, max: 2 }}
        samples= {{ value: 10, min: 1, max: 20, step: 1 }} />
  </Canvas>,
)
