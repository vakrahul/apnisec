'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030014',
      color: '#ff4d4d',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠ SYSTEM FAILURE</h1>
      <p style={{ color: '#fff', marginBottom: '2rem' }}>
        Something went wrong while executing security protocols.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '1rem 2rem',
          background: '#ff4d4d',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        RETRY CONNECTION
      </button>
    </div>
  );
}