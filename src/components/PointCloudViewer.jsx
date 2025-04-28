import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function PointCloudViewer({ frame, points, detections }) {
  const positions = useMemo(() => {
    if (!points || points.length === 0) {
      return null; // Nessun punto => non disegnare nulla
    } else {
      return new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
    }
  }, [points, frame]);

  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <OrbitControls />
      <primitive object={new THREE.AxesHelper(5)} />

      {/* Disegna le detection ricevute */}
      {detections && detections.map((detection, idx) => {
        const { position, velocity } = detection;

        const distance = Math.sqrt(
          position.x * position.x +
          position.y * position.y +
          position.z * position.z
        );

        // Danger massimo a 3 metri, zero sopra 10 metri
        let danger;
        if (distance <= 3) {
          danger = 1;
        } else if (distance >= 10) {
          danger = 0;
        } else {
          danger = 1 - (distance - 3) / (10 - 3); // Scala lineare da 1 (3m) a 0 (10m)
        }

        const height = 1; // altezza base cilindro
        const filledHeight = danger * height;

        // Colore da rosso (danger=1) a verde (danger=0)
        const color = new THREE.Color();
        color.setHSL((1 - danger) * 0.33, 1, 0.5); 

        const directionVector = new THREE.Vector3(velocity.vx, velocity.vy, velocity.vz);
        const normalizedDirection = directionVector.length() > 0 
          ? directionVector.clone().normalize() 
          : new THREE.Vector3(1, 0, 0);

        return (
          <group key={idx} position={[position.x, position.y, position.z]}>
            {/* Bounding box */}
            <Box position={[0, 0, 0]} args={[1, 1, 1]}>
              <meshBasicMaterial color={'white'} wireframe />
            </Box>

            {/* Arrow helper */}
            <primitive
              object={new THREE.ArrowHelper(
                normalizedDirection,
                new THREE.Vector3(0, 0, 0),
                directionVector.length(),
                0xff0000,
                0.2,
                0.1
              )}
            />

            {/* Danger Indicator */}
            <group>
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
      {/* Disegna la point cloud se esistono punti */}
      {positions && (
        <Points positions={positions} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#00ffff"
            size={0.1}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      )}
    </Canvas>
  );
}
