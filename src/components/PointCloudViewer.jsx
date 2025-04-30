import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial, Box, TrackballControls, Text, Billboard} from '@react-three/drei';
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
      
      <TrackballControls 
        rotateSpeed={5}
        zoomSpeed={1.2}
        panSpeed={0.8}
        dynamicDampingFactor={0.3}
      />
      <primitive object={new THREE.AxesHelper(10)} />
      <primitive object={new THREE.GridHelper(50, 40, 0x888888, 0x444444)} rotation={[Math.PI / 2, 0, 0]} />


      {/* Disegna le detection ricevute */}
      {detections && detections.map((detection, idx) => {
        const { id, position, velocity } = detection;

        const distance = Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2);

        let danger;
        if (distance <= 3) danger = 1;
        else if (distance >= 10) danger = 0;
        else danger = 1 - (distance - 3) / (10 - 3);

        const height = 1;
        const filledHeight = danger * height;

        const color = new THREE.Color();
        color.setHSL((1 - danger) * 0.33, 1, 0.5);

        const directionVector = new THREE.Vector3(velocity.vx, velocity.vy, velocity.vz);
        const speed = directionVector.length();

        const arrowLength = Math.min(Math.max(speed, 0.5), 1.0); // clamp tra 0.5 e 1.0
        const normalizedDirection = speed > 0
          ? directionVector.clone().normalize()
          : new THREE.Vector3(1, 0, 0);

        return (
          <group key={idx} position={[position.x, position.y, position.z]}>
            {/* Bounding box */}
            <Box position={[0, 0, 0]} args={[1, 1, 1]}>
              <meshBasicMaterial color={'white'} wireframe />
            </Box>

            {/* ID label */}
            <Billboard>
              <Text
                position={[0, 0.6, 0]}  // sopra la box
                fontSize={0.4}
                color="#00ff00"
                anchorX="center"
                anchorY="middle"
              >
                {`ID: ${id ?? idx}`}
              </Text>
            </Billboard>

            {/* Arrow helper */}
            <primitive
              object={new THREE.ArrowHelper(
                normalizedDirection,
                new THREE.Vector3(0, 0, 0),
                arrowLength,
                0xff0000,
                0.3,
                0.15
              )}
            />

            {/* Danger Indicator */}
            <group rotation={[Math.PI / 2, 0, 0]}>
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
            size={0.01}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      )}
    </Canvas>
  );
}
