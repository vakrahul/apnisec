'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
// 1. Add 'Html' and 'useProgress' to imports
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import styles from './register.module.scss';

// --- Loading Component (Shows Percentage) ---
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ 
        color: '#00f3ff', 
        fontFamily: "'Inter', sans-serif",
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textShadow: '0 0 10px #00f3ff',
        letterSpacing: '2px',
        whiteSpace: 'nowrap'
      }}>
        LOADING SYSTEM... {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// --- 3D Model Wrapper ---
const CyberModel = ({ focusedField }: { focusedField: string }) => {
  const { scene } = useGLTF('/assets/cyber.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Rotation Logic
      let targetRotation = 0; 
      if (focusedField === 'name') targetRotation = -0.6;
      else if (focusedField === 'email') targetRotation = 0; 
      else if (focusedField === 'password') targetRotation = 0.6; 
      
      const step = 0.1;

      if (focusedField === 'none') {
         modelRef.current.rotation.y += 0.005; 
      } else {
         modelRef.current.rotation.y = THREE.MathUtils.lerp(
            modelRef.current.rotation.y, 
            targetRotation, 
            step
         );
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={1.8} 
        position={[0, -1, 0]} 
      />
    </Float>
  );
};

useGLTF.preload('/assets/cyber.glb');

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'name' | 'email' | 'password'>('none');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.register(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.cyberUniverse}>
        <div className={styles.stars}></div>
        <div className={styles.gridFloor}></div>
        <div className={styles.horizonGlow}></div>
      </div>

      <div className={styles.contentContainer}>
        
        {/* Left Side: 3D Visuals */}
        <div className={styles.visualColumn}>
            <div className={styles.canvasWrapper}>
                {mounted && (
                  <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} color="#bc13fe" intensity={3} />
                    <pointLight position={[-10, -10, -10]} color="#00f3ff" intensity={3} />
                    
                    {/* 2. Use CanvasLoader as fallback */}
                    <Suspense fallback={<CanvasLoader />}>
                      <CyberModel focusedField={focusedField} />
                    </Suspense>
                    
                    <Environment preset="city" />
                    <OrbitControls enableZoom={false} enableRotate={false} />
                  </Canvas>
                )}
                <div className={styles.techRingOuter}></div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className={styles.formColumn}>
          <div className={styles.glassCard}>
            <div className={styles.hudCornerTopLeft}></div>
            <div className={styles.hudCornerTopRight}></div>
            <div className={styles.hudCornerBottomLeft}></div>
            <div className={styles.hudCornerBottomRight}></div>

            <h1>Create Account</h1>
            <div className={styles.headerLine}></div>
            
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleRegister}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('none')}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('none')}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('none')}
                />
              </div>

              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className={styles.loginLink}>
                Already have an account? 
                <a href="/login">Login here</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}