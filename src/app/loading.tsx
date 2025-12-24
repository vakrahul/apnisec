export default function Loading() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030014',
      color: '#00f3ff',
      gap: '1rem'
    }}>
      {/* CSS Spinner */}
      <div className="loader"></div>
      <h2 style={{ fontFamily: 'monospace', animation: 'pulse 1.5s infinite' }}>
        ENCRYPTING CONNECTION...
      </h2>

      {/* Add this simple spinner CSS to your globals.css if you haven't yet */}
      <style>{`
        .loader {
          border: 4px solid rgba(0, 243, 255, 0.1);
          border-left: 4px solid #00f3ff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}