import { createRoot } from 'react-dom/client'
import React, { useRef, useState, useEffect } from 'react'
//import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { VRButton, ARButton, XR, Controllers, Hands, Interactive } from '@react-three/xr'
//import { Canvas } from '@react-three/fiber'



import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { CylinderGeometry } from 'three/src/geometries/CylinderGeometry.js';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//import font from 'three/examples/fonts/helvetiker_regular.typeface.json'

import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls, SoftShadows, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three';
import myFont from './flash_rogers.typeface.json';

let bodies = [
    {
        id: 'jordan',
        name: 'Michael Jordan',
        speed: 9,
        agility: 8,
        features: [
            '6 NBA Championships',
            '5 MVP Awards',
        ]
    }, 
    {
        id: 'heart',
        name: 'Heart',
        speed: 9,
        agility: 8,
        features: [
            '6 NBA Championships',
            '5 MVP Awards',
        ]
    }, 
    {
        id: 'kitten',
        name: 'Kitten',
        speed: 9,
        agility: 8,
        features: [
            '6 NBA Championships',
            '5 MVP Awards',
        ]
    },
    {
        id: 'nugget',
        name: 'Chicken Nugget',
        speed: 9,
        agility: 8,
        features: [
            '6 NBA Championships',
            '5 MVP Awards',
        ]
    }, 
    {
        id: 'torso',
        name: 'Torso',
        speed: 9,
        agility: 8,
        features: [
            '6 NBA Championships',
            '5 MVP Awards',
        ]
    }
];

const ModelViewer = ({ model, position, rotation, scale, clickHandler }) => {
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model
    const animations = useAnimations(gltf.animations);
    return <primitive castShadow onClick={clickHandler} object={gltf.scene} position={position} rotation={rotation} scale={scale} />
}

const Logo = () => {
    let fontLoader = new FontLoader();
    let taglineFont = fontLoader.parse(myFont);
    const taglineArgs = [`"We'll make a car\n out of anything!!"`, { font: taglineFont, size: 0.7, height: .01 }];
    extend({ TextGeometry });
    return (<group position={[0, -1, -14]}>
        <ModelViewer
            model="./assets/models/hotwheels.gltf"

            rotation={[Math.PI / 20, 0, 0]}
        />
        {/* Add text  */}
        
        {taglineFont &&
            <group position={[-1, 4.5, 0]}>
                <mesh >
                    <textGeometry attach="geometry" args={taglineArgs} />
                    <meshStandardMaterial attach="material" color="white" />
                </mesh>
                <mesh position={[0.1,-0.1,-0.1]}>
                    <textGeometry attach="geometry" args={taglineArgs} />
                    <meshStandardMaterial attach="material" color="navy" />
                </mesh>
            </group>
        }



    </group>)
};


const Ground = () => {
    extend({ PlaneGeometry })
    return (<>
        <mesh position={[0, 0, -16]}>

            <planeGeometry attach="geometry" args={[100, 100]} />
            <meshPhongMaterial attach="material" color="#000066" />
        </mesh>
    </>)
}

const Base = () => {
    extend({ CylinderGeometry })
    return (<>
        <mesh receiveShadow position={[0.5, -6.5, -13]} rotation={[0, 0, 0]}  >

            <shadowMaterial opacity={1} />
            <cylinderGeometry attach="geometry" args={[4, 4.25, 0.4, 50, 2]} />
            <meshPhysicalMaterial clearcoatRoughness={0} clearcoat={1} color="#555" roughness={0} />
        </mesh>
    </>)
};

const Configurator = () => {

    const currBody = bodies[0];
    const [body, setBody] = useState(currBody);


    const Car = ({ position, rotation, body, setBody }) => {
        const Axel = ({ position, rotation = [Math.PI / 2, 0, 0], size = 4 }) => {
            extend({ CylinderGeometry })
            return (<>
                <group position={position}>
                    <mesh position={[0, 1, -1]} rotation={rotation}>

                        <cylinderGeometry attach="geometry" args={[0.05, 0.05, size]} />
                        <meshLambertMaterial attach="material" color="#ccc" roughness={0} metalness={0.1} />
                    </mesh>
                </group>
            </>)
        }


        const Wheels = () => {
            return (<>
                <ModelViewer
                    model="./assets/models/wheels.gltf"
                />
                <ModelViewer
                    position={[0, 0, 1]} scale={[0.8, 0.8, 0.8]}
                    model="./assets/models/wheels-front.gltf"
                />
            </>)
        };


        const Spoiler = () => {
            return (
                <>
                    <Axel position={[0, 1.5, 0]} rotation={[-Math.PI / 8, 0, 0]} size={1} />
                    <Axel position={[1, 1.5, 0]} rotation={[-Math.PI / 8, 0, 0]} size={1} />
                    <group position={[-0.5, 3.2, -3]} >
                        <mesh rotation={[Math.PI / 10, 0, 0]}>
                            <boxGeometry args={[6, .1, 1.5]} />
                            <meshStandardMaterial color={'white'} />
                        </mesh>
                    </group>
                </>
            )
        }
        const Frame = () => {
            return (
                <group>
                    <Axel position={[0, 0, 3]} rotation={[0, 0, Math.PI / 2]} size={2} />
                    <Axel position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} />
                    <Axel position={[-0.25, 0, 0]} size={6} />
                    <Axel position={[0.5, 0, 0]} size={6} />
                </group>
            )
        }
        return (
            <group rotation={rotation} position={position}>
                <Spoiler />
                <Wheels />
                <Frame />
                <Interactive                    
                    onSelect={(event) => setBody(changeBody(body))}
                    >
                    <Body body={body} setBody={setBody} />
                </Interactive>
            </group>
        )
    };

    const changeBody = (currBody) => {
        let index = bodies.findIndex(body => body.id === currBody.id);
        index++;
        if (index > bodies.length - 1) index = 0;
        return bodies[index];
    }

    // on click change body


    const Body = ({ position, body, setBody, rotation, scale }) => {




        return (<>
            <ModelViewer
                clickHandler={() => setBody(changeBody(body))}
                model={`./assets/models/body/${body.id}.gltf`}
                position={position}
                rotation={rotation}
                scale={scale}
            />
        </>)
    };

    return (
        <>
            <Car setBody={setBody} body={body} position={[0, -6, -13]} rotation={[0, -Math.PI / 9, 0]} />
        </>
    )
}

const ModelPreload = () => {
    return bodies.forEach((body) => {
        return (
            <ModelViewer
                model={`./assets/models/body/${body.id}.gltf`}
            />
        )
    });
}

const Track = () => {
    return (
        <ModelViewer
            position={[-9, -4, 0]}
            scale={[52,52,52]}
            model="./assets/models/track.gltf"
            />
    )
}

const AnimationTest = () => {
    
    const group = useRef();    

    const { scene, animations } = useGLTF("./assets/models/track.gltf", true);
    const { actions, mixer } = useAnimations(animations, group);


    
    useEffect(() => {            
        //console.log(actions);
        actions['Chomper_Tooth (6).003_RotatingObstacletest_0Action'].play();
        actions['Sketchfab_model.001Action'].play();
    }, [mixer]);
  
    return <primitive ref={group} object={scene} dispose={null} />;
  }
  

const Scene = () => {

    // set background color of scene    

    useFrame(() => {
        // Perform any animation or updates here
    });



    return (
        <>
            <OrbitControls />

            <pointLight position={[-10, 10, -10]} radius={10} color="#ffff00" intensity={0.5} castShadow />
            <pointLight position={[10, -10, 10]} intensity={1} castShadow />
            <ambientLight intensity={0.3} castShadow />

            <Logo />
            
            <group position={[-12, -7, -7]}
            rotation={[0,Math.PI/3,0]}
            scale={[52,52,52]} >
                <AnimationTest/>
            </group>
            
            <ModelPreload />
            {/* <Track/> */}
            <Base />
            {/* <Ground /> */}

            <Configurator />            
        </>
    );
};




createRoot(document.getElementById('root')).render(
    <>
          <VRButton />
          <Canvas
            camera={{ position: [0, 0,0], fov: 80 }}
            onCreated={({ gl }) => {
                gl.setClearColor(new THREE.Color(0x0000cc));
            }}>
            <XR>
                <Hands/>
                <Controllers/>
                <Scene />

                {/* <EffectComposer>
    
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer> */}

                <SoftShadows size={{ value: 25, min: 0, max: 100 }}
                    focus={{ value: 0, min: 0, max: 2 }}
                    samples={{ value: 10, min: 1, max: 20, step: 1 }} />
            </XR>
        </Canvas>
    </>
,
)
