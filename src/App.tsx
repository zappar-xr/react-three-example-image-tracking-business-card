import { render } from 'react-dom';
import React, { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import {
 ZapparCamera, ImageTracker, ZapparCanvas, BrowserCompatibility,
} from '@zappar/zappar-react-three-fiber';

import targetFile from './assets/BusinessCard.zpt';

import Zapbolt from './assets/ZapparLog.glb';
import zapLaserMp3 from './assets/zapsplat_laser.mp3';

import cardBgTextureImg from './assets/BusinessCardPlain.png';
import webIconTextureImg from './assets/WebLaunch.png';
import facebookIconTextureImg from './assets/Facebook.png';
import phoneIconTextureImg from './assets/Phone.png';

// Background
function Background() {
  const mesh:React.MutableRefObject<any> = useRef();
  const cardBgTexture = useLoader(THREE.TextureLoader, cardBgTextureImg) as THREE.Texture;

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeBufferGeometry args={[3, 2]} />
      <meshStandardMaterial attach="material" map={cardBgTexture} />
    </mesh>
  );
}
// Icons
function Icons() {
  const webIconTexture = useLoader(THREE.TextureLoader, webIconTextureImg) as THREE.Texture;
  const facebookIconTexture = useLoader(THREE.TextureLoader, facebookIconTextureImg) as THREE.Texture;
  const phoneIconTexture = useLoader(THREE.TextureLoader, phoneIconTextureImg) as THREE.Texture;

  return (
    <group>
      <mesh position={[-1.2, 0.65, 0.3]} onClick={() => window.open('https://zap.works')}>
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial attach="material" map={webIconTexture} color="white" transparent />
      </mesh>
      <mesh position={[-0.75, 0.65, 0.3]} onClick={() => window.open('https://zap.works')}>
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial attach="material" map={facebookIconTexture} color="white" transparent />
      </mesh>
      <mesh position={[-0.3, 0.65, 0.3]} onClick={() => window.open('tel:123-456-7890123')}>
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial attach="material" map={phoneIconTexture} color="white" transparent />
      </mesh>
    </group>
  );
}
// Name and Title
function Nametitle() {
  return (
    <group>
      <mesh>
        <Text color="white" position={[-0.958, 0.1, 0.1]} fontSize={0.13}>
          Francesca Ellis
        </Text>
        <Text color="white" position={[-0.85, -0.033, 0.1]} fontSize={0.1}>
          Junior Support Engineer
        </Text>
      </mesh>
    </group>
  );
}
// Call To Action
function Cta() {
  return (
    <mesh>
      <Text color="white" position={[-0.86, -0.65, 0.1]} fontSize={0.1} maxWidth={0.8} textAlign="center">
        Tap on an icon to find out more!
      </Text>
    </mesh>
  );
}
// Sound
function Sound() {
  const listener = new THREE.AudioListener();
  const ZapLaser = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(zapLaserMp3, (buffer) => {
    ZapLaser.setBuffer(buffer);
    ZapLaser.setLoop(false);
    ZapLaser.play();
  });
}
// 3D Model; Adjusted - https://codesandbox.io/s/r3f-ibl-envmap-simple-k7q9h?file=/src/App.js
function Model() {
  // Create a scene with our model
  const { scene } = useLoader(GLTFLoader, Zapbolt) as any;
  // Return our model as a primitive
  return (
    <mesh>
      <primitive
        object={scene}
        dispose={null}
        position={[0.57, -0.05, 0]}
        scale={[2, 2, 2]}
        rotation={[0, 0, 0.01]}
        onClick={() => Sound()}
      />
    </mesh>
    );
}

function App() {
    // Set up states
    const [visibleState, setVisibleState] = useState(false);

    return (
      <>
        <BrowserCompatibility />
        {/* Setup Zappar Canvas */}
        <ZapparCanvas gl={{ antialias: true }}>
          {/* Setup Zappar Camera */}
          <ZapparCamera />
          {/* Setup Zappar Image Tracker, passing our target file */}
          <Suspense fallback={null}>
            <ImageTracker
              onNotVisible={() => { setVisibleState(false); }}
              onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
              onVisible={() => { setVisibleState(true); }}
              targetImage={targetFile}
              visible={visibleState}
            >

              {/* Setup Content */}
              <Background />
              <Icons />
              <Nametitle />
              <Cta />
              <Model />

            </ImageTracker>
          </Suspense>
          {/* Normal directional light */}
          <directionalLight position={[2.5, 8, 5]} intensity={1.5} castShadow />
        </ZapparCanvas>
      </>
    );
}

render(<App />, document.getElementById('root'));


export default App;


