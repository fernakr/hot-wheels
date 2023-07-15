import { createRoot } from 'react-dom/client'
import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react'
//import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useSpring, a, animated, config } from '@react-spring/three'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import './index.scss';
import HotWheels from './assets/models/Hotwheels';

import useSound from 'use-sound';
import hydraulicSfx from './hydraulic.mp3';
import hatchSfx from './hatch.m4a';
import spraySfx from './spray.m4a';

import {
    EmailShareButton,
    FacebookShareButton,
    // HatenaShareButton,
    // InstapaperShareButton,
    // LineShareButton,
    // LinkedinShareButton,
    // LivejournalShareButton,
    // MailruShareButton,
    // OKShareButton,
    // PinterestShareButton,
    // PocketShareButton,
    // RedditShareButton,
    // TelegramShareButton,
    // TumblrShareButton,
    // TwitterShareButton,
    // ViberShareButton,
    // VKShareButton,
    // WhatsappShareButton,
    // WorkplaceShareButton
  } from "react-share";
  


//import { VRButton, ARButton, XR, Controllers, Hands, Interactive } from '@react-three/xr'
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

const wheels = [
    {
        id: 'default',
        name: 'Just Regular Ol\' Wheels',
        front: true,
        frame: true,
        features: [
            'Classic'
        ]
    },
    {
        id: 'oranges',
        name: 'Oranges',
        front: true,
        frame: true,
        features: [
            'Citrusy'
        ]
    },
    {
        id: 'tentacles',
        name: 'Tentacles',
        front: false,
        frame: false,
        features: [
            'Grabby'
        ]
    }
]

const bodies = [
    {
        id: 'jordan',
        name: 'Michael Jordan Head',
        speed: 9,
        agility: 8,
        specialMove: 'Tongue out, leap over obstacles',     
        features: [                    
            'Can also golf and play baseball'
        ]
    }, 
    {
        id: 'heart',
        name: 'Human Heart',
        speed: 5,
        agility: 3,
        specialMove: 'Pump blood',
        features: [
            'Keeps you alive'            
        ]
    }, 
    {
        id: 'kitten',
        name: 'Kitten',
        speed: 9,
        agility: 8,
        specialMove: 'Cuteness overload',
        features: [
            'Kneads',
        ]
    },
    {
        id: 'nugget',
        name: 'Chicken Nugget',
        speed: 3,
        agility: 3,
        specialMove: 'Barbeque sauce sploosh',
        features: [            
            'Will never decompose',
        ]
    }, 
    {
        id: 'torso',
        name: 'Torso',
        speed: 3,
        agility: 5,    
        specialMove: 'Pectoral flex'
    }
];

const pizzazzes = [
    {
        id: 'none',
        name: 'None',
    }
]

const ModelViewer = ({ model, position, rotation, scale, clickHandler }) => {
    const gltf = useLoader(GLTFLoader, model)
    // apply position to model
    //const animations = useAnimations(gltf.animations);
    return <primitive castShadow onClick={clickHandler} object={gltf.scene} position={position} rotation={rotation} scale={scale} />
}

const Logo = ({ status, logoColor, logoColor2 }) => {
    let fontLoader = new FontLoader();
    let textFont = fontLoader.parse(myFont);

    const textOutput = [
        {
            text: 'The',
            size: 1,
            position: [-7, 6.8, -2]       
        },
        {

            text: `"We'll make a car\n out of anything!!"`, 
            size: 0.7,
            position: [-3.25, 3.5, -2],
            color: '#EDD469'
        },

        {
            text: 'Build-a-Car Portrait Studio',
            size: 0.5,
            position: [-3, 1.5, -2],
            color: '#DC803D'
        }        
        
    ]    
    extend({ TextGeometry });
        
    
    const springText = useSpring({
        position: status === 'inactive' ? [0,0,0] : [0,40,0],
        config: { duration: 250, tension: 30, friction: 20  }
    });

    const springLogo = useSpring({
        position: status === 'staging' ? [-3, -1, -8] : [0, 3, -14],
        rotation: status === 'staging' ? [0, Math.PI / 15, 0] : [Math.PI / 20, 0, 0],
        config: { duration: 1000, tension: 30, friction: 20  }
        
    });


    //console.log(position);
    return (<animated.group position={springLogo.position} rotation={springLogo.rotation}>
        <HotWheels logoColor={ logoColor } logoColor2={ logoColor2 }/>
        
        {textFont &&
            <animated.group position={ springText.position }>
                { textOutput.map((text, i) => (           
                    <group key={ i } position={text.position}>
                        <mesh >
                            <textGeometry attach="geometry" args={                            
                                [text.text,{
                                    font: textFont,
                                    size: text.size,
                                    height: .01
                                }]
                            } />
                            <meshStandardMaterial attach="material" color={ text.color ? text.color : 'white' }  />
                        </mesh>
                        <mesh position={[0.05,-0.05,-0.05]}>
                            <textGeometry attach="geometry"  args={                            
                                [text.text,{
                                    font: textFont,
                                    size: text.size,
                                    height: .01
                                }]} 
                            />
                            <meshStandardMaterial attach="material" color="navy" />
                        </mesh>
                    </group>
                ))}
            </animated.group>
        }
        



    </animated.group>)
};


const Ground = ({ stageColor }) => {
    extend({ PlaneGeometry });
    // darken color value
    const color = new THREE.Color(stageColor);
    color.offsetHSL(0, 0, -0.1);

    return (<>
        <mesh position={[0, -7, -4]} rotation={[-Math.PI/2,0,0]}>

            <planeGeometry attach="geometry" args={[100, 100]} />
            <meshPhongMaterial roughness={0} clearcoat={0} attach="material" color={ color } />
        </mesh>
    </>)
}

const Configurator = ({ status, carPosition, body, bodyColor, wheel, pizzazz, baseColor }) => {



    const Base = () => {
        extend({ CylinderGeometry })
        return (<>
            <mesh receiveShadow position={[0, 0, 0]} rotation={[0, 0, 0]}  >            
                <cylinderGeometry attach="geometry" args={[4, 4.25, 0.4, 50, 2]} />
                <meshPhysicalMaterial clearcoatRoughness={0} clearcoat={1} color={ baseColor } roughness={0} />
            </mesh>
            <mesh receiveShadow position={[0, -2, 0]} rotation={[0, 0, 0]}  >

                <shadowMaterial opacity={1} />
                <cylinderGeometry attach="geometry" args={[4.25, 4.25, 3.6, 50, 4]} />
                <meshPhysicalMaterial clearcoatRoughness={0} clearcoat={1} color={ baseColor }roughness={0} />
            </mesh>
        </>)
    };
    
    const Car = ({ position, rotation, body, bodyColor, carPosition }) => {
        
        
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


        const Wheels = ({ wheel }) => {
            return (<>
                <ModelViewer                    

                    position={[0, 0, 0]}
                    model={`./assets/models/wheels/${wheel.id}/wheels.gltf`}
                />
                { wheel.front && <ModelViewer
                        position={[0, 0, 1]} scale={[0.8, 0.8, 0.8]}
                        model={`./assets/models/wheels/${wheel.id}/wheels-front.gltf`}
                    />
                }
            </>)
        };


        const Spoiler = () => {
            return (
                <>
                    {Array.from({ length: 2 }).map((_, i) =>
                    <Axel key={ i } position={[-0.25 + 0.75 * i, 1, -1.75]} rotation={[-Math.PI / 8, 0, 0]} size={2} />
                    )}
                    <group position={[0, 3.2, -3]} >
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
                    { Array.from({ length: 2 }).map((_, i) =>
                    (
                        <Axel key={ i } position={[-0.25 + 0.75 * i, 0, 0.75]} size={4.5} />
                    ))}
                    
                </group>
            )
        }
        return (
            <animated.group rotation={rotation} position={position} >
                <Spoiler/>
                <Wheels wheel={wheel} />
                { wheel.frame && <Frame />}               
                <Body body={body}  />            
                <Base />
            </animated.group>
        )
    };

    // const changeBody = (defaultBody) => {
    //     let index = bodies.findIndex(body => body.id === defaultBody.id);
    //     index++;
    //     if (index > bodies.length - 1) index = 0;
    //     return bodies[index];
    // }

    // on click change body


    const Body = ({ position = [0,0,0], body, rotation, scale }) => {
        return (
            <ModelViewer                                
                model={`./assets/models/body/${body.id}.gltf`}
                position={position}
                rotation={rotation}
                scale={scale}
            />
        )
    };

    const startCarPosition = [...carPosition ];
    startCarPosition[1] = -4;

    const { position, rotation } = useSpring(
            { 
                    position: status !== 'inactive' ? startCarPosition : carPosition, rotation: status !== 'inactive' ? [0, Math.PI / 20, 0] : [0, - Math.PI / 9, 0], 
                    config: { duration: 4000, tension: 300, friction: 20  }, // Set the duration to 1000 milliseconds (1 second)
    })

    return (        
        <Car status={ status } body={body} bodyColor={ bodyColor} position={position} rotation={ rotation } />
    )
}

const BodyPreload = () => {    
    return bodies.map((body, i) => {   
        
        return (
                    
            <ModelViewer    
                key={ i }        
                position={ [-100, -100, 0] }                
                model={`./assets/models/body/${body.id}.gltf`}
            />        
        )})
        
}

const WheelPreload = () => {    
    return wheels.map((wheel, i) => {      
        let wheelTypes = [''];
        if (wheel.front) {
            wheelTypes = wheelTypes.concat('-front');
        }

        return wheelTypes.map((wheelType, i) => (                    
            <ModelViewer            
                key={ i }
                position={ [-100, -100, 0] }                
                model={`./assets/models/wheels/${wheel.id}/wheels${wheelType}.gltf`}
            />        
        ))})
        
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
  

const Scene = ({ playHydraulic, status, setStatus, carPosition, body, bodyColor, wheel, stageColor, baseColor, logoColor, logoColor2 }) => {

    
    useFrame(() => {
        // Perform any animation or updates here
    });



    return (
        <>            
            <Suspense fallback={<Loader />}>
                <BodyPreload  />
                <WheelPreload />
            </Suspense>
            <pointLight position={[-10, 10, -10]} radius={10} intensity={0.5} castShadow />
            <pointLight position={[15, 0, 10]} intensity={1} castShadow />
            <spotLight position={[10, 0, -15]} intensity={status === 'inactive' ? 0 : 0.5} castShadow />
            <ambientLight intensity={status === 'inactive' ? 0.3 : 0} castShadow />            
            <Logo status={ status } logoColor={ logoColor } logoColor2={ logoColor2 } />            
            <Suspense fallback={<Loader />}>
                <group 
                    position={[-12, -7, -7]}
                    rotation={[0,Math.PI/3,0]}
                    scale={[52,52,52]} >
                    <Track/>
                </group>                                        
                <Ground stageColor={ stageColor } />
                { status === 'inactive' && 
                    <Html>
                        <button className="button" onClick={() =>{ setTimeout(() => playHydraulic(),500); setStatus('active')}}>Build a Car 🔧</button>
                    </Html>
                }                
                <Configurator baseColor={ baseColor} wheel={ wheel } body={ body } bodyColor={ bodyColor } status={ status } carPosition={ carPosition} />            
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
    targetPosition[0] = targetPosition[0] + 3.5;
    targetPosition[1] = targetPosition[1] + 12;
    targetPosition[2] = targetPosition[2] -7;

    
    const buildCameraPos = {
        position: [5, 0, 2],
        target: targetPosition
    };
    
    const inactiveCameraPos = {
        position: [-3, 0, 10],
        target: [0,0,-10]
    };

    const stagingTargetPosition = [...carPosition];
    stagingTargetPosition[1] = stagingTargetPosition[1] + 12;
    //stagingTargetPosition[0] = stagingTargetPosition[0] - 4;

    const stagingCameraPos = {
        position: [4, 0, 2],
        target: stagingTargetPosition
    };
    const [cameraSettings, setCameraSettings] = useState(defaultPosition);
  
    useEffect(() => {
      // switch statement
      if (status === 'staging') {
        setCameraSettings(stagingCameraPos);
      }else if (status !== 'inactive') {
        setCameraSettings(buildCameraPos);
      } else {
        setCameraSettings(inactiveCameraPos);
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

let glInstance;

const App = () => {
    const [ activePanel, setActivePanel ] = useState(0);
    const [ status, setStatus ] = useState('inactive');

    const defaultBody = bodies[0];
    const [body, setBody] = useState(defaultBody);    
    const defaultBodyColor  = '#ffffff';
    const [bodyColor, setBodyColor] = useState(defaultBodyColor);
    
    const defaultWheel = wheels[0];
    const [wheel, setWheel] = useState(defaultWheel);
    
    const defaultPizzazz = pizzazzes[0];
    const [pizzazz, setPizzazz] = useState(defaultPizzazz);
    
    const [playHydraulic] = useSound(hydraulicSfx, { volume: 0.5 })
    const [playHatch] = useSound(hatchSfx, { volume: 0.5 })
    const [playSpray] = useSound(spraySfx, { volume: 0.25 })
    
    const carPosition = [2, -12, -7];
    
    const defaultStageColor = '#0000cc';
    const [stageColor, setStageColor] = useState(defaultStageColor);
    const defaultBaseColor = '#999999';
    const [baseColor, setBaseColor] = useState(defaultBaseColor);

    const defaultLogoColor = '#e02200';
    const [logoColor, setLogoColor] = useState(defaultLogoColor);
    const defaultLogoColor2 = '#ffd500';
    const [logoColor2, setLogoColor2] = useState(defaultLogoColor2);

    const [shareImage, setShareImage] = useState(null);

    const panels = [
        {
            id: 'body',
            name: 'Body'            
        },
        {
            id: 'wheels',
            name: 'Wheels'
        },
        {
            id: 'environment',
            name: 'Environment'
        }
    ];


    // set timer for 5 minutes of inactivity
    // what is 5 mintues in milliseconds?
    const inactiveThreshold = 300000;

    let timer = setTimeout(() => setStatus('inactive'), inactiveThreshold);

    // on mouse move reset timer
    document.addEventListener('mousemove', () => {
        clearTimeout(timer);        
        timer = setTimeout(() => {
            setStatus('inactive');
            reset();

        }, inactiveThreshold);
    });

    const reset = () => {
        setBody(defaultBody);
        setWheel(defaultWheel);
        setPizzazz(defaultPizzazz);
        setBodyColor(defaultBodyColor);
        setStageColor(defaultStageColor);
        setBaseColor(defaultBaseColor);
        setLogoColor(defaultLogoColor);
        setLogoColor2(defaultLogoColor2);
        setShareImage(null);
        
    }

    const randomize = () => {
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
        const randomWheel = wheels[Math.floor(Math.random() * wheels.length)];
        const randomPizzazz = pizzazzes[Math.floor(Math.random() * pizzazzes.length)];
        
        setBody(randomBody);
        setWheel(randomWheel);
        setPizzazz(randomPizzazz);
        setBodyColor('#' + Math.floor(Math.random()*16777215).toString(16));
        setStageColor('#' + Math.floor(Math.random()*16777215).toString(16));
        setBaseColor('#' + Math.floor(Math.random()*16777215).toString(16));
        setLogoColor('#' + Math.floor(Math.random()*16777215).toString(16));
        setLogoColor2('#' + Math.floor(Math.random()*16777215).toString(16));
    }

    const sendPhoto = () => {        
//        const image = shareImage;
        // shareImage to base64 encoding

        //console.log(shareImage);
        // const email = 'verticallychallenged@gmail.com';
        const email = prompt('Please enter your email address to receive your photo');
        if (email) {
            fetch(process.env.REACT_APP_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, image: shareImage })
            }).then((response) => {
                if (response.status === 200) {
                    alert('Your photo has been sent! Check your email.');
                } else {
                    alert('There was an error sending your photo. Please try again.');
                }
            });
        }
    }


    const exitImage = () => {
        setShareImage(null);
    }


    // useEffect (() => {
    //     return new THREE.Color(stageColor);
    // }, [stageColor]);
    // const bodyIndex = bodies.findIndex(b => b.id === body.id);
    // const wheelIndex = wheels.findIndex(w => w.id === wheel.id);
    //const pizzazzIndex = ;
    return (
        <>

            
            { shareImage && 
                <div className="image_wrapper">                    
                    <div className='image'>
                        <img src={ shareImage } />                        
                        <div className="image_options">
                            
                            <button className="button secondary" onClick={() => {
                                const link = document.createElement('a');
                                link.href = shareImage;
                                link.download = 'hotwheels.png';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}>
                                Download image ⬇️
                            </button>
                            <button className="button" onClick={() =>{ 
                                sendPhoto();
                            }}>Send Picture to Email 📧</button>
                        </div>
                    </div>
                </div>
            }
            { status === 'staging' &&
            
                <div className="staging">
                    {/* Take a picture  */}
                    { !shareImage && <button className="button" onClick={() =>{ 
                        // output canvas and set image as open graph image for the page
                        const canvas = glInstance.domElement;
                        const image = canvas.toDataURL('image/png');

                        
                        setShareImage(image);

                    }}>Take a Picture 📷</button>
                    }
                    { shareImage && <button className="button" onClick={() =>{ exitImage(); }}>Retake Picture 👈</button>}
                    { /* Share on social media */}
                
                    {/* Back to build */}
                    <button className="button secondary" onClick={() =>{ setStatus('active'); setShareImage(null)}}>Back to Build 👈</button>
                </div>
            
            }              
            <div className={`details_wrapper ${ status === 'active' && body ? 'is-active' : ''}`}>     
                <button style={{ marginBottom: '20px' }} className="button secondary" onClick={() =>{  randomize(); }}>Randomize 🔀</button>
                <div className="details_nav">
                    { panels.map((panel, index) =>
                        <button key={ index } className={ `panel_nav ${activePanel === index ? 'is-active': ''}`} onClick={ () => setActivePanel(index)}>
                            { panel.name }
                        </button>
                    ) }


                </div> 
                <div className="details_content">
                    { activePanel === 0 &&
                        <div className="panel">
                            <h2>Body Type</h2>                                 
                            <Carousel selectedItem={bodies.findIndex(b => b.id === body.id)} dynamicHeight={ true } showThumbs={ false } showStatus={ false } infiniteLoop={ true } showIndicators={ false } onChange={ (index) => { playHatch(); setBody(bodies[index])} }>
                                { bodies.map((body, index) =>             
                                        (
                                            <div className='details' key={ index }>
                                                <h3>{ body.name }</h3>
                                                
                                                <div key={ index } className='details_body'>                                                    
                                                    <ul>
                                                        { body.speed && <li><span className='label'>Speed:</span> { body.speed }</li> }
                                                        { body.agility && <li><span className='label'>Agility:</span> { body.agility }</li> }                            
                                                        { body.specialMove && <li className='small'><span className='label display-block'>Special Move:</span> { body.specialMove }</li> }
                                                        { body.features && <li className='small'><span className='label display-block'>Features:</span>
                                                            <ul>
                                                                { body.features.map((feature, featureIndex) => <li key={featureIndex}>{ feature }</li>) }                                                                                                        
                                                            </ul>
                                                        </li> }
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                ) }
                            </Carousel>
                            <h2>Body Color</h2>                    
                            <input type="color" value={ bodyColor } onChange={(e) => {playSpray(); setBodyColor(e.target.value)}}/>
                        </div>
                    }
                    { activePanel === 1 &&
                        <div className="panel">
                            <h2>Wheel Type</h2>
                            <Carousel selectedItem={wheels.findIndex(w => w.id === wheel.id)} dynamicHeight={ true } showThumbs={ false } showStatus={ false } infiniteLoop={ true } showIndicators={ false } onChange={ (index) => { playHatch(); setWheel(wheels[index])} }>
                                { wheels.map((wheel, index) =>             
                                        (

                                            <div key={ index } className='details'>
                                                <h3>{ wheel.name }</h3>
                                                <div className="details_body">
                                                    <ul>                                                                  
                                                        { wheel.features.map((feature, index) => <li key={index}>{ feature }</li>) }                                        
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                ) }
                            </Carousel>
                        </div>
                    }
                    { activePanel === 2 &&
                        <div className="panel">
                            <h2>Pizzazz</h2>                            
                            <Carousel selectedItem={ pizzazzes.findIndex(p => p.id === pizzazz.id) } dynamicHeight={ true } showThumbs={ false } showStatus={ false } infiniteLoop={ true } showIndicators={ false } onChange={ (index) => { playHatch(); setPizzazz(pizzazzes[index])} }>
                                { pizzazzes.map((pizzazz, index) =>             
                                        (

                                            <div key={ index } className='details'>
                                                <h3>{ pizzazz.name }</h3>
                                              
                                            </div>
                                        )
                                ) }
                            </Carousel>
                            <h2>Stage Color</h2>                    
                            <input type="color" value={ stageColor } onChange={(e) => {playSpray(); setStageColor(e.target.value)}}/>
                            <h2>Base Color</h2>                    
                            <input type="color" value={ baseColor } onChange={(e) => {playSpray(); setBaseColor(e.target.value)}}/>
                            <h2>Logo Flame Color</h2>                                                
                            <input type="color" value={ logoColor } onChange={(e) => {playSpray(); setLogoColor(e.target.value)}}/>
                            <h2>Logo Text Color</h2>                    
                            <input type="color" value={ logoColor2 } onChange={(e) => {playSpray(); setLogoColor2(e.target.value)}}/>
                        </div>
                    }

                </div>
                                   

                <button style={{ marginTop: '20px' }} className="button" onClick={() =>{  setTimeout(() => playHydraulic(),500); setStatus('staging')}}>Ready for Photos! 🔥</button>
            </div>                
            
        
            
            <Canvas  gl={{ preserveDrawingBuffer: true }} 
                onCreated={({ gl }) => {
                    glInstance = gl;
                }}
            >
                  <color attach="background" args={[stageColor]} />
            <OrbitControls makeDefault                   
                enablePan={false } 
                enableZoom={status === 'staging'}               
                minDistance={ 3 }
                maxDistance={ 20 }
                minPolarAngle={-Math.PI/8}
                maxPolarAngle={Math.PI/2 + Math.PI/20}
                    
            />
            <EyeAnimation status={ status } carPosition={ carPosition }/>

                
            {/* <XR> */}
                {/* <Hands/>
                <Controllers/> */}
                <Scene playHydraulic={ playHydraulic } logoColor={ logoColor } logoColor2={ logoColor2} body={ body } bodyColor={ bodyColor } wheel={ wheel } pizzazz={ pizzazz} status={ status } setStatus={ setStatus }  carPosition={ carPosition } stageColor={stageColor} baseColor={ baseColor }/>

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
