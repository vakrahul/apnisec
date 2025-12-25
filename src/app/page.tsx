import Link from 'next/link';
// ✅ Import the new SCSS Module
import styles from './home.module.scss';

export default function HomePage() {
  return (
    <div className={styles.mainWrapper}>
      
      {/* --- BACKGROUND FX --- */}
      <div className={styles.scanLine}></div>
      <div className={styles.cyberGrid}></div>
      <div className={styles.ambientGlow}></div>
      <div className={styles.techRing}></div>

      {/* --- HERO SECTION --- */}
      <header className={styles.heroSection}>
        <div className={styles.systemBadge}>
          <span className={styles.dot}></span>
          SYSTEM STATUS: ONLINE
        </div>

        <h1 className={styles.heroTitle}>
          SECURE YOUR <br />
          <span className={styles.highlight} data-text="DIGITAL FRONTIER">
            DIGITAL FRONTIER
          </span>
        </h1>

        <p className={styles.heroSubtitle}>
          Advanced AI sentinels for next-generation threat detection. 
          Neutralize cyber threats in real-time with military-grade encryption.
        </p>

        <div className={styles.ctaGroup}>
          <Link href="/register" className={styles.primaryBtn}>
            Initialize Defense
          </Link>
          <Link href="/login" className={styles.secondaryBtn}>
            Access Terminal
          </Link>
        </div>
      </header>

      {/* --- LIVE STATS HUD --- */}
      <section className={styles.statsBar}>
        <div className={styles.statItem}>
          <h3>99.9%</h3>
          <p>Uptime Guaranteed</p>
        </div>
        <div className={styles.statItem}>
          <h3>1M+</h3>
          <p>Threats Blocked</p>
        </div>
        <div className={styles.statItem}>
          <h3>0ms</h3>
          <p>Latency Added</p>
        </div>
        <div className={styles.statItem}>
          <h3>24/7</h3>
          <p>Active Monitoring</p>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>CORE PROTOCOLS</h2>
          <div className={styles.line}></div>
        </div>

        <div className={styles.grid}>
          {/* Card 1 */}
          <div className={styles.featureCard}>
            <div className={styles.icon}>🛡️</div>
            <h3>Penetration Testing</h3>
            <p>
              Simulate real-world attacks to identify vulnerabilities before 
              malicious actors can exploit them.
            </p>
          </div>

          {/* Card 2 */}
          <div className={styles.featureCard}>
            <div className={styles.icon}>👁️</div>
            <h3>Real-Time Vision</h3>
            <p>
              Autonomous surveillance of your entire network traffic with 
              AI-driven anomaly detection.
            </p>
          </div>

          {/* Card 3 */}
          <div className={styles.featureCard}>
            <div className={styles.icon}>🔐</div>
            <h3>Zero Trust Arch</h3>
            <p>
              Never trust, always verify. Strict identity verification for 
              every person and device accessing resources.
            </p>
          </div>

           {/* Card 4 */}
           <div className={styles.featureCard}>
            <div className={styles.icon}>⚡</div>
            <h3>Instant Response</h3>
            <p>
              Automated countermeasures deploy within milliseconds of detecting
              unauthorized access attempts.
            </p>
          </div>
          
           {/* Card 5 */}
           <div className={styles.featureCard}>
            <div className={styles.icon}>☁️</div>
            <h3>Cloud Fortress</h3>
            <p>
              Securing AWS, Azure, and Google Cloud environments with 
              unified policy enforcement.
            </p>
          </div>

           {/* Card 6 */}
           <div className={styles.featureCard}>
            <div className={styles.icon}>🤖</div>
            <h3>AI Sentinels</h3>
            <p>
              Machine learning models that adapt to new threat patterns 
              faster than human analysts.
            </p>
          </div>
        </div>
      </section>

      <footer style={{textAlign: 'center', padding: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#666'}}>
        <p>© 2025 APNISEC. All systems operational.</p>
      </footer>
    </div>
  );
}