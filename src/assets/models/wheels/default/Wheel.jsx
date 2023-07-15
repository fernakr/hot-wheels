/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.7 wheel.gltf
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/assets/models/wheels/default/wheel.gltf')
  //const { actions } = useAnimations(animations, group)

  const { color = 0x222222 } = props;
  const material = new THREE.MeshPhysicalMaterial({ color: color, roughness: 0.5 });
  
  return (
    <group ref={group} {...props} dispose={null} >
      <mesh name="Object_2" geometry={nodes.Object_2.geometry} material={material} position={[1.865, 1.351, -1.439]} rotation={[-Math.PI / 2, 0, 0]} scale={2.321} />
    </group>
  )
}

useGLTF.preload('/assets/models/wheels/default/wheel.gltf')
