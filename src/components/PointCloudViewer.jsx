import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function PointCloudViewer({ frame, points }) {
  const positions = useMemo(() => {
    if (!points || points.length === 0) {
      // fallback
      const array = [];
      for (let i = 0; i < 1000; i++) {
        array.push([
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ]);
      }
      return new Float32Array(array.flat());
    } else {
      // usa i punti veri dal websocket
      return new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
    }
  }, [points, frame]);

  // Rimane invariato il codice dei box (per ora generato a caso)
  const boxes = useMemo(() => {
    const genBox = () => {
      const position = [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ];
      const size = [
        0.5 + Math.random() * 2,
        0.5 + Math.random() * 2,
        0.5 + Math.random() * 2,
      ];
      const direction = new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5),
        (Math.random() - 0.5)
      ).normalize();
      const velocity = Math.random() * 2;
      return {
        position,
        size,
        direction,
        velocity,
      };
    };
    return Array.from({ length: 3 }, genBox);
  }, [frame]);

  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <OrbitControls />
      <primitive object={new THREE.AxesHelper(5)} />

      {boxes.map((box, idx) => {
        const distance = Math.sqrt(box.position.reduce((sum, x) => sum + x * x, 0));
        const danger = 1 - Math.min(1, distance / 10);
        const height = box.size[1];
        const filledHeight = danger * height;
        const color = new THREE.Color().setHSL((1 - danger) * 0.3, 1, 0.5);

        return (
          <group key={idx}>
            <Box position={box.position} args={box.size}>
              <meshBasicMaterial color={'white'} wireframe />
            </Box>

            <primitive
              object={new THREE.ArrowHelper(
                box.direction,
                new THREE.Vector3(...box.position),
                box.velocity,
                0xffff00,
                0.2,
                0.1
              )}
            />

            <group position={box.position}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, height, 8]} />
                <meshBasicMaterial color={'gray'} transparent opacity={0.2} />
              </mesh>

              <mesh position={[0, -height / 2 + filledHeight / 2, 0]}>
                <cylinderGeometry args={[0.1, 0.1, filledHeight, 8]} />
                <meshBasicMaterial color={color} />
              </mesh>
            </group>
          </group>
        );
      })}

      <Points positions={positions} stride={3} frustumCulled={false}>
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