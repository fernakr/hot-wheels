/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF,useAnimations } from '@react-three/drei'

//import { useAnimations } from '@react-three/drei/useAnimations'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('./assets/models/wheels/blob/wheel.gltf')
  
  const { actions, mixer } = useAnimations(animations, group);
    
    useEffect(() => {            
        //console.log(actions);
        actions['Boba Thing Animated'].play();
        actions['Key.002Action'].play();
        
        // actions['Chomper_Tooth (6).003_RotatingObstacletest_0Action'].play();
        // actions['Sketchfab_model.001Action'].play();
    }, [mixer]);

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        name="Boba_Thing_Animated"
        material={materials['Scene_-_Root.002']}
        geometry={nodes.Boba_Thing_Animated.geometry}
        morphTargetDictionary={nodes.Boba_Thing_Animated.morphTargetDictionary}
        morphTargetInfluences={nodes.Boba_Thing_Animated.morphTargetInfluences}
        position={[1.44, 1.64, -1.02]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.4, 0.4, 0.4]}
      />
    </group>
  )
}

useGLTF.preload('./assets/models/wheels/blob/wheel.gltf')
