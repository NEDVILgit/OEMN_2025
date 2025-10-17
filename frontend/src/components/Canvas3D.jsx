import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Texturas Predefinidas (sin cambios) ---
const textureUrls = {
  canvas: 'https://placehold.co/512x512/d1bfa7/8c6d53.png?text=Lona',
  leather: 'https://placehold.co/512x512/8B4513/FFFFFF.png?text=Cuero',
  geometric: 'https://placehold.co/512x512/333333/FFFFFF.png?text=Geo',
};

const Backpack = ({ colors, texture, customText, drawingTexture }) => {
  const { nodes, materials } = useGLTF('/mochila_dior.glb');
  
  // (Lógica de texturas y materiales sin cambios)
  const predefinedTextures = useTexture(textureUrls);
  const userDrawingTexture = useMemo(() => {
    if (!drawingTexture) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(drawingTexture, (tex) => { tex.flipY = false; tex.needsUpdate = true; });
  }, [drawingTexture]);
  const appliedTexture = useMemo(() => {
    if (texture === 'custom' && userDrawingTexture) return userDrawingTexture;
    if (texture !== 'none' && predefinedTextures[texture]) return predefinedTextures[texture];
    return null;
  }, [texture, userDrawingTexture, predefinedTextures]);
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1 }), []);
  const adjustmentStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1 }), []);
  const loadStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1 }), []);
  const sidePocketsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1 }), []);
  useMemo(() => { bodyMaterial.color.set(appliedTexture ? '#ffffff' : colors.body); bodyMaterial.map = appliedTexture; bodyMaterial.needsUpdate = true; }, [colors.body, appliedTexture, bodyMaterial]);
  useMemo(() => { adjustmentStrapsMaterial.color.set(colors.adjustmentStraps); adjustmentStrapsMaterial.needsUpdate = true; }, [colors.adjustmentStraps, adjustmentStrapsMaterial]);
  useMemo(() => { loadStrapsMaterial.color.set(colors.loadStraps); loadStrapsMaterial.needsUpdate = true; }, [colors.loadStraps, loadStrapsMaterial]);
  useMemo(() => { sidePocketsMaterial.color.set(colors.sidePockets); sidePocketsMaterial.needsUpdate = true; }, [colors.sidePockets, sidePocketsMaterial]);

  return (
    <group scale={4} position-y={-1.8}>
      {Object.values(nodes).map((node) => {
        if (!node.isMesh) return null;
        let material;
        switch (node.name) {
          case 'Pattern': material = bodyMaterial; break;
          case 'Fabic1': material = adjustmentStrapsMaterial; break;
          case 'Fabic2': material = loadStrapsMaterial; break;
          case 'Net_Side': material = sidePocketsMaterial; break;
          default: material = materials[node.material.name]; break;
        }
        return <mesh key={node.uuid} geometry={node.geometry} material={material} castShadow receiveShadow />;
      })}

      {/* --- Componente de Texto con Posición Corregida y Fuente por Defecto --- */}
      <Text
        // Se elimina la carga de fuentes externas para garantizar la visibilidad
        position={[customText.positionX, customText.positionY, 0.52]} // <-- Ligeramente más atrás
        rotation={[-0.2, 0, 0]}
        fontSize={customText.size * 0.08}
        color={customText.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        textAlign="center"
      >
        {customText.content}
      </Text>
    </group>
  );
};

// Componentes Bag y MateBag sin cambios
const Bag = (props) => (
  <group position-y={-0.75}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2.5, 1.5, 0.7]} />
      <meshStandardMaterial color={props.colors.body || '#ffffff'} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
      <torusGeometry args={[0.8, 0.05, 16, 100, Math.PI]} />
      <meshStandardMaterial color={props.colors.loadStraps || '#000000'} />
    </mesh>
  </group>
);
const MateBag = (props) => (
   <group position-y={-1}>
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
      <meshStandardMaterial color={props.colors.body || '#ffffff'} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 1, 0]}>
       <torusGeometry args={[1.2, 0.04, 16, 100]} />
       <meshStandardMaterial color={props.colors.loadStraps || '#000000'} />
    </mesh>
  </group>
);


export default function Canvas3D({ productType, colors, texture, customText, drawingTexture }) {
  const renderProduct = () => {
    const props = { colors, texture, customText, drawingTexture };
    switch(productType) {
      case 'backpack': return <Backpack {...props} />;
      case 'bag': return <Bag {...props} />;
      case 'mateBag': return <MateBag {...props} />;
      default: return <Backpack {...props} />;
    }
  }
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6} adjustCamera preset="rembrandt">
          {renderProduct()}
        </Stage>
      </Suspense>
      <OrbitControls makeDefault autoRotate={false} minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  );
}
useGLTF.preload('/mochila_dior.glb');

