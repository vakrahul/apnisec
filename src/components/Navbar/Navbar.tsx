'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if token exists to see if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 1. Hide Navbar on Dashboard (Dashboard has its own internal header)
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  // Prevent hydration mismatch by not rendering until client loads
  if (!mounted) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* LOGO */}
        <Link href="/" className={styles.logo}>
          APNI<span>SEC</span>
        </Link>

        {/* CENTER LINKS */}
        <div className={styles.navLinks}>
          <Link href="/">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className={styles.actions}>
          {isLoggedIn ? (
            // If User IS Logged In -> Show "Go to Dashboard"
            <Link href="/dashboard" className={styles.primaryBtn}>
              Go to Dashboard
            </Link>
          ) : (
            // If User is NOT Logged In -> Show "Login" & "Register"
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