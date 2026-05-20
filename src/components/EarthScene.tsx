import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { TextureLoader, BackSide, AdditiveBlending, Color } from "three";
import type { Mesh, Group, ShaderMaterial as ShaderMaterialType } from "three";
import earthTexture from "@/assets/earth-texture.jpg";

/**
 * Atmosphere shader — produces a soft ocean-cyan rim glow that
 * gently pulses like a tide.
 */
function AtmosphereMaterial() {
  const matRef = useRef<ShaderMaterialType>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color("#5fb4a2") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime as { value: number }).value =
        clock.getElapsedTime();
    }
  });

  return (
    <shaderMaterial
      ref={matRef}
      args={[
        {
          uniforms,
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
              float pulse = 0.85 + 0.15 * sin(uTime * 0.8);
              gl_FragColor = vec4(uColor, 1.0) * intensity * pulse;
            }
          `,
          transparent: true,
          blending: AdditiveBlending,
          side: BackSide,
          depthWrite: false,
        },
      ]}
    />
  );
}

interface EarthProps {
  /** Slight auto-spin on the globe's own Y-axis. Disabled while the user is dragging. */
  autoSpin: boolean;
}

function Earth({ autoSpin }: EarthProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const oceanRef = useRef<ShaderMaterialType>(null);
  const texture = useLoader(TextureLoader, earthTexture);

  const oceanUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color("#7fd3c0") },
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      // Accumulated rotation so that a drag doesn't snap back to t*0.06 —
      // the globe just keeps spinning from wherever the user left it.
      if (autoSpin) {
        meshRef.current.rotation.y += delta * 0.06;
      }
      meshRef.current.rotation.x = 0.16;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
    if (oceanRef.current) {
      (oceanRef.current.uniforms.uTime as { value: number }).value = t;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Earth surface */}
      <Sphere ref={meshRef} args={[1, 128, 128]} scale={1.85}>
        <meshPhongMaterial map={texture} shininess={14} specular={"#13302a"} />
      </Sphere>

      {/* Animated ocean wave shimmer (thin shell over the surface) */}
      <Sphere args={[1, 96, 96]} scale={1.86}>
        <shaderMaterial
          ref={oceanRef}
          args={[
            {
              uniforms: oceanUniforms,
              vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPos;
                void main() {
                  vNormal = normalize(normalMatrix * normal);
                  vPos = position;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `,
              fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor;
                varying vec3 vNormal;
                varying vec3 vPos;
                void main() {
                  float wave = sin(vPos.y * 18.0 + uTime * 1.4) * 0.5 + 0.5;
                  wave *= sin(vPos.x * 12.0 - uTime * 0.9) * 0.5 + 0.5;
                  float fres = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
                  float alpha = wave * fres * 0.35;
                  gl_FragColor = vec4(uColor, alpha);
                }
              `,
              transparent: true,
              depthWrite: false,
              blending: AdditiveBlending,
            },
          ]}
        />
      </Sphere>

      {/* Soft atmosphere halo */}
      <Sphere args={[1, 64, 64]} scale={2.05}>
        <AtmosphereMaterial />
      </Sphere>
    </group>
  );
}

export default function EarthScene() {
  // Pause the globe's auto-spin while the user is actively dragging, so the
  // two rotations don't fight each other.
  const [dragging, setDragging] = useState(false);

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} color="#cfe8d8" />
        <directionalLight position={[5, 3, 5]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.2} color="#3a6b54" />

        <Earth autoSpin={!dragging} />

        {/*
          Drag-to-rotate. We disable zoom & pan so users can't accidentally
          break the framing — only free rotation via mouse / touch drag.
          Damping makes the motion feel weighty instead of snappy.
        */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.12}
          rotateSpeed={0.55}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={(5 * Math.PI) / 6}
          onStart={() => setDragging(true)}
          onEnd={() => setDragging(false)}
        />
      </Canvas>
    </div>
  );
}
