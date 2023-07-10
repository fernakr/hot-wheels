import { createRoot } from 'react-dom/client'
import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react'
//import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useSpring, a, animated, config } from '@react-spring/three'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';



import { VRButton, ARButton, XR, Controllers, Hands, Interactive } from '@react-three/xr'
//import { Canvas } from '@react-three/fiber'



import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { CylinderGeometry } from 'three/src/geometries/CylinderGeometry.js';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//import font from 'three/examples/fonts/helvetiker_regular.typeface.json'

import { Canvas, useFrame, useLoader, extend, useThree } from '@react-three/fiber'
import { OrbitControls, Html, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three';
import myFont from './flash_rogers.typeface.json';

let bodies = [
    {
        id: 'jordan',
        name: 'Michael Jordan Head',
        speed: 9,
        agility: 8,
        features: [
            '6 NBA Championships',
            '5 MVP Awards',
        ]
    }, 
    {
        id: 'heart',
        name: 'Human Heart',
        speed: 9,
        agility: 8,
        features: [
            'Keeps you alive',
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

const ModelViewer = ({ model, position, rotation, scale, clickHandler, visible = true }) => {
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model
    //const animations = useAnimations(gltf.animations);
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
        <mesh position={[0, -7, -4]} rotation={[-Math.PI/2,0,0]}>

            <planeGeometry attach="geometry" args={[100, 100]} />
            <meshPhongMaterial roughness={0} clearcoat={0} attach="material" color="#333399" />
        </mesh>
    </>)
}

const Configurator = ({ status, carPosition, body, bodyColor }) => {



    const Base = () => {
        extend({ CylinderGeometry })
        return (<>
            <mesh receiveShadow position={[0, 0, 0]} rotation={[0, 0, 0]}  >            
                <cylinderGeometry attach="geometry" args={[4, 4.25, 0.4, 50, 2]} />
                <meshPhysicalMaterial clearcoatRoughness={0} clearcoat={1} color="#999" roughness={0} />
            </mesh>
            <mesh receiveShadow position={[0, -2, 0]} rotation={[0, 0, 0]}  >

                <shadowMaterial opacity={1} />
                <cylinderGeometry attach="geometry" args={[4.25, 4.25, 3.6, 50, 4]} />
                <meshPhysicalMaterial clearcoatRoughness={0} clearcoat={1} color="#999" roughness={0} />
            </mesh>
        </>)
    };
    
    const Car = ({ position, rotation, body, bodyColor, carPosition }) => {
        // console.log(bodyColor);
        // let material = new THREE.MeshLambertMaterial({color: bodyColor})
        // useEffect(() => {
        //     material = );            
        //     console.log(material);
        //   }, [bodyColor])
        
        const Axel = ({ position, rotation = [Math.PI / 2, 0, 0], size = 4 }) => {
            extend({ CylinderGeometry })
            return (<>
                <group position={position}>
                    <mesh position={[0, 1, -1]} rotation={rotation} material={ new THREE.MeshLambertMaterial({color: bodyColor}) }>
                        <cylinderGeometry attach="geometry" args={[0.05, 0.05, size]} />                        
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
                        <mesh rotation={[Math.PI / 10, 0, 0]}  material={ new THREE.MeshLambertMaterial({color: bodyColor}) }>
                            <boxGeometry args={[6, .1, 1.5]} />                            
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
            <animated.group rotation={rotation} position={position}>
                <Spoiler/>
                <Wheels />
                <Frame />
                {/* <Interactive                    
                    onSelect={(event) => setBody(changeBody(body))}
                    > */}
                    <Body body={body}  />
                {/* </Interactive> */}
                <Base />
            </animated.group>
        )
    };

    // const changeBody = (currBody) => {
    //     let index = bodies.findIndex(body => body.id === currBody.id);
    //     index++;
    //     if (index > bodies.length - 1) index = 0;
    //     return bodies[index];
    // }

    // on click change body


    const Body = ({ position, body, rotation, scale }) => {




        return (<>
            <ModelViewer
                visible={ true }
                //clickHandler={() => setBody(changeBody(body))}
                model={`./assets/models/body/${body.id}.gltf`}
                position={position}
                rotation={rotation}
                scale={scale}
            />
        </>)
    };

    const startCarPosition = [...carPosition ];
    startCarPosition[1] = -4;

    const { position, rotation } = useSpring({ position: status === 'active' ? startCarPosition : carPosition, rotation: status === 'active' ? [0, 0, 0] : [0, Math.PI / 9, 0], config: { duration: 1000, tension: 300, friction: 20  }, // Set the duration to 1000 milliseconds (1 second)
    })

    return (
        <>
            <Car status={ status } body={body} bodyColor={ bodyColor} position={position} rotation={ rotation } />           
            {/* <ModelPreload changeBody={ changeBody } body={ body } position={position} rotation={[0, -Math.PI / 9, 0]} /> */}
        </>
    )
}

const ModelPreload = ({ body, changeBody, position, rotation }) => {
    // preload next body
    
    let nextBody = changeBody(body);
    //console.log(nextBody   )
    return (<>
        <ModelViewer
            rotation={rotation}            
            position={position} 
            model={`./assets/models/body/${nextBody.id}.gltf`}
        />
    </>)
}

const Track = () => {
    
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
  

const Scene = ({ status, setStatus, carPosition, body, bodyColor }) => {

    
    useFrame(() => {
        // Perform any animation or updates here
    });



    return (
        <>
            {/* <animated.group position={position}>
                <Controls/>
            </animated.group> */}

            <pointLight position={[-10, 10, -10]} radius={10} color="#ffff00" intensity={0.5} castShadow />
            <pointLight position={[10, -10, 10]} intensity={1} castShadow />
            <spotLight position={[10, 0, -15]} intensity={status === 'inactive' ? 0 : 0.5} castShadow />
            <ambientLight intensity={status === 'inactive' ? 0.3 : 0} castShadow />            
            <Logo />
            
             <Suspense fallback={<Loader />}>
                <group 
                    position={[-12, -7, -7]}
                    rotation={[0,Math.PI/3,0]}
                    scale={[52,52,52]} >
                    <Track/>
                </group>
                                
                
                <Ground />
                { status != 'active' && 
                    <Html>
                        <button className="start-button" onClick={() => setStatus('active')}>Build a Car</button>
                    </Html>
                }

                <Configurator body={ body } bodyColor={ bodyColor } status={ status } carPosition={ carPosition} />            
            </Suspense>
        </>
    );
};

const Loader = () => {    
    return (
        <Html>
            <div className="loader">                
                <span className='loader_text'>Loading...</span>
            </div>
            
        </Html>
    )
}



// const Controls = () => {
//     const { gl, camera } = useThree()
//     return (
//         /**
//          * The args value with camera and gl are required to be passed to the OrbitControls
//          * in order to allow the illusion of camera re-focus to work when click a pitstop.
//          */
//         <OrbitControls
//         makeDefault
//         target={[0, 0, 0]}
//         args={[camera, gl.domElement]}
//         maxDistance={10}
//         minDistance={3}
//         // vertical angle of the orbit
//         // minPolarAngle={angleToRadians(45)}
//         // maxPolarAngle={angleToRadians(80)}
//         // // horizontal angle of the orbit
//         // minAzimuthAngle={angleToRadians(-180)}
//         // maxAzimuthAngle={angleToRadians(180)}
//         />
//     )
// }

const t = new THREE.Vector3();
const defaultPosition = {
    position: [0, 0, 0],
    target: [0,0,-10]
};

  
  const CameraWrapper = ({ cameraPosition, target }) => {
    const { camera } = useThree();
    camera.position.set(...cameraPosition);
    camera.lookAt(t.set(...target));
    return null;
  };
  
  const ControlsWrapper = ({ target }) => {
    const { controls } = useThree();
    if (controls) {
      controls.target.set(...target);
    }
    return null;
  };
  
  function AnimateEyeToTarget({ position, target }) {
    const { camera, controls } = useThree();
    
    const s = useSpring({
      from: defaultPosition,
      // Fun jelly-like animation
      config: config.wobbly,
      onStart: () => {
        if (!controls) return;
        controls.enabled = false;
      },
      onRest: () => {
        if (!controls) return;
        controls.enabled = true;
      }
    });
  
    s.position.start({ from: camera.position.toArray(), to: position });
    s.target.start({
      from: controls ? controls.target.toArray() : [0, 0, 0],
      to: target
    });
  
    const AnimateControls = useMemo(() => a(ControlsWrapper), []);
    const AnimatedNavigation = useMemo(() => a(CameraWrapper), []);
  
    return (
      <>
        <AnimatedNavigation cameraPosition={s.position} target={s.target} />
        <AnimateControls target={s.target} />
      </>
    );
  }
  
  function EyeAnimation({ status, carPosition }) {


    let targetPosition = [...carPosition]
    targetPosition[0] = targetPosition[0] + 4.5;
    targetPosition[1] = targetPosition[1] + 12;
    targetPosition[2] = targetPosition[2] -7;

    
    const closeBy = {
        position: [5, 0, 0],
        target: targetPosition
    };
    
    const farAway = {
        position: [-3, 0, 10],
        target: [0,0,-10]
    };
    const [cameraSettings, setCameraSettings] = useState(defaultPosition);
  
    useEffect(() => {
      if (status === 'active') {
        setCameraSettings(closeBy);
      } else {
        setCameraSettings(farAway);
      }
    }, [status]);
  
    return (
      <>
        <AnimateEyeToTarget
            
          position={cameraSettings.position}
          target={cameraSettings.target}
        />
      </>
    );
  }


const App = () => {
    const [ status, setStatus ] = useState('inactive');
    const currBody = bodies[0];
    const [body, setBody] = useState(currBody);
    const [bodyColor, setBodyColor] = useState('#ffffff');

    const carPosition = [0, -12, -11];
    console.log(bodyColor);
    return (
        <>
         { status === 'active' && body &&                  
                <div className="details_wrapper">     
                    <h2>Body Type</h2>         
                    <Carousel showThumbs={ false } showStatus={ false } infiniteLoop={ true } showIndicators={ false } onChange={ (index) => setBody(bodies[index]) }>
                        { bodies.map((body, index) =>             
                                (
                                    <div key={ index } className='details'>
                                        <h3>{ body.name }</h3>
                                        <ul>
                                            { body.speed && <li>Speed: { body.speed }</li> }
                                            { body.agility && <li>Agility: { body.agility }</li> }                            
                                            { body.features.map((feature, index) => <li key={index}>{ feature }</li>) }                                        
                                        </ul>
                                    </div>
                                )
                        ) }
                    </Carousel>
                    <h2>Body Color</h2>                    
                    <input type="color" defaultValue={ bodyColor } onChange={(e) => {console.log(e.target.value); setBodyColor(e.target.value)}}/>
                </div>                
            }
             <Canvas        
            onCreated={({ gl }) => {
                gl.setClearColor(new THREE.Color(0x0000cc));
            }}>
            <OrbitControls makeDefault                   
                enablePan={false }
                enableZoom={false }
                minPolarAngle={-Math.PI/8}
                maxPolarAngle={Math.PI/2 + Math.PI/20}
                    
            />
            <EyeAnimation status={ status } carPosition={ carPosition }/>

                
            {/* <XR> */}
                {/* <Hands/>
                <Controllers/> */}
                <Scene body={ body } bodyColor={ bodyColor }status={ status } setStatus={ setStatus }  carPosition={ carPosition }/>

                {/* <EffectComposer>

                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer> */}

                {/* <SoftShadows size={{ value: 25, min: 0, max: 100 }}
                    focus={{ value: 0, min: 0, max: 2 }}
                    samples={{ value: 10, min: 1, max: 20, step: 1 }} /> */}
            {/* </XR> */}
        </Canvas>    
        </>
    )
       
}


createRoot(document.getElementById('root')).render(
    <>
         <App/>
    </>
,
)
