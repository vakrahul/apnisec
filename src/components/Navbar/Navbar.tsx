'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './navbar.module.scss'; // <--- The Final Correct Import

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  if (!mounted) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          APNI<span>SEC</span>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className={styles.actions}>
          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.primaryBtn}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.ghostBtn}>
                Login
              </Link>
              <Link href="/register" className={styles.primaryBtn}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}