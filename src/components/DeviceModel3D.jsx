import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Device() {
  const groupRef = useRef();
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector('[data-hero]');
      if (!hero) return;
      const h = hero.getBoundingClientRect().height;
      scrollRef.current = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / h));
    };
    const onMouse = (e) => {
      targetMouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scroll = scrollRef.current;

    // Smooth mouse lerp
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, targetMouseRef.current.x, 0.04);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, targetMouseRef.current.y, 0.04);

    const baseRotY = t * 0.28;
    const scrollRotY = scroll * (Math.PI * 0.75);
    const mouseRotY = mouseRef.current.x * 0.22;
    const mouseRotX = mouseRef.current.y * 0.1;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      0.4 + baseRotY + scrollRotY + mouseRotY,
      0.055
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0.1 + mouseRotX,
      0.055
    );

    // Float fades out as user scrolls past hero
    const floatScale = Math.max(0, 1 - scroll * 2.5);
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.04 * floatScale;
  });

  return (
    <group ref={groupRef} rotation={[0.1, 0.4, 0]}>
      {/* Ana gövde - beyaz yuvarlak kutu */}
      <RoundedBox args={[1.1, 1.6, 0.55]} radius={0.12} smoothness={6} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f0f4f8" roughness={0.25} metalness={0.08} />
      </RoundedBox>

      {/* Üst kısım — hafif koyu gradient şerit */}
      <RoundedBox args={[1.12, 0.32, 0.56]} radius={0.08} smoothness={4} position={[0, 0.64, 0]}>
        <meshStandardMaterial color="#dce6ef" roughness={0.3} metalness={0.05} />
      </RoundedBox>

      {/* Gümüş metalik bant — orta */}
      <RoundedBox args={[1.14, 0.22, 0.58]} radius={0.04} smoothness={4} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#9dafc0" roughness={0.15} metalness={0.75} />
      </RoundedBox>

      {/* Hoparlör ızgarası — yan yüzey, siyah dikdörtgen */}
      {[0.18, 0.08, -0.02, -0.12, -0.22].map((y, i) => (
        <mesh key={i} position={[0.3, y + 0.55, 0.04]}>
          <boxGeometry args={[0.22, 0.045, 0.52]} />
          <meshStandardMaterial color="#1a2535" roughness={0.6} />
        </mesh>
      ))}

      {/* USB-C konnektör bölgesi — mavi */}
      <RoundedBox args={[0.32, 0.28, 0.14]} radius={0.04} smoothness={4} position={[0.08, -0.6, 0.24]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.1} />
      </RoundedBox>
      {/* USB port deliği */}
      <mesh position={[0.08, -0.64, 0.32]}>
        <boxGeometry args={[0.18, 0.08, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Klips / tutma kolu — gri */}
      <RoundedBox args={[0.14, 1.1, 0.1]} radius={0.05} smoothness={4} position={[0.68, 0.05, 0]}>
        <meshStandardMaterial color="#8fa8be" roughness={0.2} metalness={0.6} />
      </RoundedBox>
      {/* Klips alt kıvrımı */}
      <mesh position={[0.56, -0.48, 0]}>
        <torusGeometry args={[0.14, 0.055, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8fa8be" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* LED göstergeler — alt panel */}
      {[
        { pos: [-0.22, -0.72, 0.28], color: '#3b82f6' },
        { pos: [0,    -0.72, 0.28], color: '#eab308' },
        { pos: [0.22, -0.72, 0.28], color: '#ef4444' },
      ].map(({ pos, color }, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.1} metalness={0.2} emissive={color} emissiveIntensity={0.9} />
        </mesh>
      ))}

      {/* Üstteki yuvarlak bağlantı noktası */}
      <mesh position={[0, 0.82, 0.1]}>
        <cylinderGeometry args={[0.09, 0.09, 0.06, 24]} />
        <meshStandardMaterial color="#1a2535" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.82, 0.14]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.8} emissive="#92400e" emissiveIntensity={0.3} />
      </mesh>

      {/* Yüzey çizgileri / panel bölümleri */}
      <mesh position={[0, -0.18, 0.278]}>
        <boxGeometry args={[0.9, 0.005, 0.01]} />
        <meshStandardMaterial color="#c5d2df" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.19, 0.278]}>
        <boxGeometry args={[0.9, 0.005, 0.01]} />
        <meshStandardMaterial color="#c5d2df" roughness={0.3} />
      </mesh>

      {/* PelviCare yazısı için ince mavi çizgi detayı */}
      <mesh position={[0, -0.38, 0.278]}>
        <boxGeometry args={[0.55, 0.018, 0.01]} />
        <meshStandardMaterial color="#0d9488" roughness={0.2} emissive="#0d9488" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export default function DeviceModel3D({ height = '420px', className = '' }) {
  return (
    <div style={{ height, width: '100%' }} className={className}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#93c5fd" />
        <pointLight position={[0, -2, 2]} intensity={0.5} color="#5eead4" />

        <Device />

        <ContactShadows position={[0, -1.2, 0]} opacity={0.35} scale={4} blur={2} far={2} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
