'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
// FIX: Import the API client we created
import { api } from '@/lib/api'; 
import styles from './login.module.scss';

// --- 3D Model Component Wrapper ---
const CyberModel = ({ focusedField }: { focusedField: string }) => {
  const { scene } = useGLTF('/assets/cyber.glb'); 
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelRef.current) {
      let targetRotation = 0; 
      if (focusedField === 'email') targetRotation = -0.5; 
      if (focusedField === 'password') targetRotation = 0.5; 

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // New Error State
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Call Real API
      const data = await api.login({ email, password });

      // 2. Save Token (CRITICAL FIX)
      if (data?.token) {
        localStorage.setItem('token', data.token);
        
        // 3. Redirect
        router.push('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error("Login failed", err);
      // Show error message to user
      setError(err.response?.data?.message || 'Invalid email or password');
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
        
        {/* 3. Left Side: The 3D Cyber Lock */}
        <div className={styles.visualColumn}>
            <div className={styles.canvasWrapper}>
                {mounted && (
                  <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} color="#bc13fe" intensity={3} />
                    <pointLight position={[-10, -10, -10]} color="#00f3ff" intensity={3} />
                    <spotLight position={[0, 10, 0]} intensity={1} />
                    
                    <Suspense fallback={null}>
                      <CyberModel focusedField={focusedField} />
                    </Suspense>
                    
                    <Environment preset="city" />
                    <OrbitControls enableZoom={false} enableRotate={false} />
                  </Canvas>
                )}
                
                <div className={styles.techRingOuter}></div>
                <div className={styles.techRingInner}></div>
                <div className={styles.connectionLines}></div>
            </div>
        </div>

        {/* 4. Right Side: Glass Login HUD */}
        <div className={styles.formColumn}>
          <div className={styles.glassCard}>
            
            <div className={styles.hudCornerTopLeft}></div>
            <div className={styles.hudCornerTopRight}></div>
            <div className={styles.hudCornerBottomLeft}></div>
            <div className={styles.hudCornerBottomRight}></div>
            
            <div className={styles.cardHeader}>
              <h2>Login</h2>
              <div className={styles.headerLine}></div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className={`${styles.inputGroup} ${focusedField === 'email' ? styles.active : ''}`}>
                <label>Email</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('none')}
                    placeholder="Type your secure ID"
                    required 
                  />
                  <span className={styles.icon}>✉️</span>
                </div>
              </div>

              <div className={`${styles.inputGroup} ${focusedField === 'password' ? styles.active : ''}`}>
                <label>Password</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('none')}
                    placeholder="Enter passphrase"
                    required 
                  />
                   <span className={styles.icon}>🔒</span>
                </div>
              </div>

              <div className={styles.actions}>
                <a href="#" className={styles.forgotPass}>Recover Password?</a>
              </div>

              <button type="submit" className={styles.cypherButton} disabled={loading}>
                <span className={styles.btnText}>{loading ? 'Authenticating...' : 'LOGIN'}</span>
                <div className={styles.btnGlitch}></div>
              </button>

              <div className={styles.registerRow}>
                 <span>New functionality?</span> 
                 <a href="/register">Initialize Protocol (Register)</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}