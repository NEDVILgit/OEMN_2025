import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Texturas Predefinidas ---
const textureUrls = {
  canvas: 'https://placehold.co/512x512/d1bfa7/8c6d53.png?text=Lona',
  leather: 'https://placehold.co/512x512/8B4513/FFFFFF.png?text=Cuero',
  geometric: 'https://placehold.co/512x512/333333/FFFFFF.png?text=Geo',
};

// --- Modelo de Mochila Profesional ---
const Backpack = ({ colors, texture, customText, drawingTexture }) => {
  // Carga el modelo GLB desde la carpeta /public
  const { nodes } = useGLTF('/mochila.glb');
  
  // Carga las texturas predefinidas
  const predefinedTextures = useTexture(textureUrls);

  // Memoiza la textura del dibujo del usuario
  const userDrawingTexture = useMemo(() => {
    if (!drawingTexture) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(drawingTexture, (tex) => {
      tex.flipY = false;
      tex.needsUpdate = true;
    });
  }, [drawingTexture]);

  // Determina qué textura aplicar
  const appliedTexture = useMemo(() => {
    if (texture === 'custom' && userDrawingTexture) return userDrawingTexture;
    if (texture !== 'none' && predefinedTextures[texture]) return predefinedTextures[texture];
    return null;
  }, [texture, userDrawingTexture, predefinedTextures]);

  // Crea un solo material que se actualizará con los colores y texturas
  const sharedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    roughness: 0.4,
    metalness: 0.1,
  }), []);

  // Aplica las propiedades al material
  useMemo(() => {
    sharedMaterial.color.set(appliedTexture ? '#ffffff' : colors.body);
    sharedMaterial.map = appliedTexture;
    sharedMaterial.needsUpdate = true;
  }, [colors.body, appliedTexture, sharedMaterial]);

  // ¡IMPORTANTE! Aquí usamos el nombre que encontramos en la consola.
  // Es muy probable que sea 'geometry_0'. Si es otro, cámbialo aquí.
  const mainMesh = nodes.geometry_0;

  return (
    <group scale={3.5} position-y={-1.5}>
      {mainMesh && (
        <mesh 
          geometry={mainMesh.geometry}
          material={sharedMaterial} // Asignamos nuestro material reactivo
          castShadow 
          receiveShadow 
        />
      )}
      
      {/* El texto se mantiene separado */}
      <Text
        position={[0, -0.2, 0.6]}
        rotation={[-0.1, 0, 0]}
        fontSize={customText.size * 0.5}
        color={customText.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.0}
        textAlign="center"
      >
        {customText.content}
      </Text>
    </group>
  );
};


// --- Otros modelos sin cambios ---
const Bag = (props) => (
  <group position-y={-0.75}>
    <mesh castShadow>
      <boxGeometry args={[2.5, 1.5, 0.7]} />
      <meshStandardMaterial color={props.colors.body} />
    </mesh>
    <mesh castShadow position={[0, 0.8, 0]}>
      <torusGeometry args={[0.8, 0.05, 16, 100, Math.PI]} />
      <meshStandardMaterial color={props.colors.straps} />
    </mesh>
  </group>
);
const MateBag = (props) => (
   <group position-y={-1}>
    <mesh castShadow>
      <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
      <meshStandardMaterial color={props.colors.body} />
    </mesh>
    <mesh castShadow position={[0, 1, 0]}>
       <torusGeometry args={[1.2, 0.04, 16, 100]} />
       <meshStandardMaterial color={props.colors.straps} />
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

useGLTF.preload('/mochila.glb');

