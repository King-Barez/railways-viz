import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';

export default function PointCloudViewer() {
  const points = useMemo(() => {
    const array = [];
    for (let i = 0; i < 1000; i++) {
      array.push([(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]);
    }
    return new Float32Array(array.flat());
  }, []);

  return (
    <Canvas style={{ width: '100%', height: 300 }}>
      <OrbitControls />
      <Points positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00ffff"
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </Canvas>
  );
}
