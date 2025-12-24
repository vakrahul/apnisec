'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api'; 
import { FaUserCircle, FaPlus, FaSignOutAlt, FaExclamationTriangle, FaExternalLinkAlt } from 'react-icons/fa'; 
import { FiClock, FiCheckCircle, FiActivity } from 'react-icons/fi';
import styles from './dashboard.module.scss'; 

// --- Interfaces ---
interface Issue {
  id: string;
  title: string;
  type: string;
  status: 'Open' | 'Resolved' | 'Pending' | 'In Progress' | 'Closed';
  priority: string;
}

interface User {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newIssue, setNewIssue] = useState({ 
    title: '', 
    type: 'Cloud Security', 
    description: '', 
    priority: 'Medium', 
    status: 'Open' 
  });

  // --- Init ---
  useEffect(() => {
    let isMounted = true;

    const initDashboard = async () => {
      await new Promise(r => setTimeout(r, 100)); // Prevent race conditions
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.replace('/login'); 
        return;
      }

      try {
        const [userRes, issuesRes] = await Promise.allSettled([
          api.getMe(),
          api.getIssues()
        ]);

        if (!isMounted) return;

        // User Check
        if (userRes.status === 'fulfilled') {
          setUser(userRes.value);
        } else {
          const reason = userRes.reason as any;
          if (reason?.response?.status === 401) {
             localStorage.removeItem('token');
             router.replace('/login');
             return;
          }
          setError("Failed to load user.");
        }

        // Issues Check
        if (issuesRes.status === 'fulfilled') {
          setIssues(issuesRes.value || []);
        } else {
          setIssues([]);
        }

      } catch (err) {
        setError("Connection failed.");
      } finally {
        if(isMounted) setLoading(false);
      }
    };

    initDashboard();
    return () => { isMounted = false; };
  }, [router]);

  // --- Actions ---

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createIssue(newIssue);
      const updatedIssues = await api.getIssues();
      setIssues(updatedIssues);
      setShowModal(false);
      setNewIssue({ title: '', type: 'Cloud Security', description: '', priority: 'Medium', status: 'Open' });
      alert('Issue Created Successfully!');
    } catch (err) {
      alert('Failed to create issue.');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateIssueStatus(id, newStatus);
      const updatedList = await api.getIssues(); // Refresh to update counters
      setIssues(updatedList);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch(e) {}
    localStorage.removeItem('token');
    router.push('/login'); 
  };

  if (loading) return <div className={styles.loadingScreen}><div className={styles.loader}></div></div>;

  if (error && !user) {
    return (
       <div className={styles.errorScreen}>
         <FaExclamationTriangle size={50} color="#ff4d4d" />
         <h2>Access Error</h2>
         <p>{error}</p>
         <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
       </div>
    );
  }

  // Counts
  const openCount = issues.filter(i => i.status === 'Open').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
  const pendingCount = issues.filter(i => i.status === 'Pending' || i.status === 'In Progress').length;

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.cyberUniverse}>
        <div className={styles.stars}></div>
        <div className={styles.gridFloor}></div>
      </div>

      {/* Header */}
      <header className={styles.headerContainer}>
        <div className={styles.logo}>Apni<span>Sec</span></div>
        <div className={styles.userControls}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <FaUserCircle className={styles.avatar} />
          </div>
          <button 
            onClick={handleLogout} 
            className={styles.logoutBtn} 
            title="Logout" 
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Welcome & Actions */}
      <section className={styles.welcomeSection}>
        <div>
          <h1>Welcome back, <span>{user?.name ? user.name.split(' ')[0] : 'User'}!</span></h1>
          <p>Security Overview & Issue Tracking</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Button 1: Quick Modal (Fast) */}
          <button className={styles.createBtn} onClick={() => setShowModal(true)}>
            <FaPlus /> Quick Report
          </button>

          {/* Button 2: Go to the New Page - FIXED CONTRAST */}
          <button 
            className={styles.createBtn} 
            onClick={() => router.push('/create-issue')}
            style={{ 
              background: 'rgba(0, 0, 0, 0.6)', // Dark background for contrast
              border: '1px solid #00f3ff', 
              color: '#00f3ff',
              fontWeight: 600
            }}
          >
            <FaExternalLinkAlt /> Advanced Form
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h3>Open Issues</h3>
            <div className={`${styles.number} ${styles.blue}`}>{openCount}</div>
          </div>
          <div className={styles.visualContainer}><FiActivity className={styles.iconPulse} /></div>
        </div>

        <div className={styles.card}>
           <div className={styles.cardContent}>
            <h3>Resolved Issues</h3>
            <div className={`${styles.number} ${styles.cyan}`}>{resolvedCount}</div>
          </div>
          <div className={styles.visualContainer}><FiCheckCircle className={styles.iconChecklist} /></div>
        </div>

        <div className={styles.card}>
           <div className={styles.cardContent}>
            <h3>Pending Tasks</h3>
            <div className={`${styles.number} ${styles.yellow}`}>{pendingCount}</div>
          </div>
          <div className={styles.visualContainer}><FiClock className={styles.iconClock} /></div>
        </div>
      </section>

      {/* Issues Table */}
      <section className={styles.issuesListSection}>
        <h2>Recent Reports</h2>
        
        {issues.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No issues reported yet. System secure.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.issuesTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status (Click to Update)</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.title}</td>
                    <td>{issue.type}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[issue.priority.toLowerCase()]}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td>
                      <div className={styles.statusSelectWrapper}>
                        <span className={`${styles.statusDot} ${styles[issue.status.toLowerCase().replace(' ', '')]}`}></span>
                        {/* ACCESSIBILITY FIX: Added aria-label */}
                        <select 
                          value={issue.status} 
                          onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                          className={styles.statusSelect}
                          aria-label={`Change status for issue ${issue.title}`}
                        >
                          <option value="Open" style={{color:'black'}}>Open</option>
                          <option value="Pending" style={{color:'black'}}>Pending</option>
                          <option value="In Progress" style={{color:'black'}}>In Progress</option>
                          <option value="Resolved" style={{color:'black'}}>Resolved</option>
                          <option value="Closed" style={{color:'black'}}>Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick Modal Form */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalGlass}>
            <h2>Report Security Issue</h2>
            <form onSubmit={handleCreateIssue}>
              
              {/* ACCESSIBILITY FIX: Added ID and htmlFor */}
              <div className={styles.group}>
                <label htmlFor="issueTitle">Title</label>
                <input 
                  id="issueTitle"
                  required 
                  value={newIssue.title} 
                  onChange={e => setNewIssue({...newIssue, title: e.target.value})} 
                  placeholder="e.g. Broken Access Control" 
                />
              </div>

              <div className={styles.group}>
                <label htmlFor="issueType">Type</label>
                <select 
                  id="issueType"
                  value={newIssue.type} 
                  onChange={e => setNewIssue({...newIssue, type: e.target.value})}
                >
                  <option value="Cloud Security">Cloud Security</option>
                  <option value="Red Team Assessment">Red Team Assessment</option>
                  <option value="VAPT">VAPT</option>
                </select>
              </div>

              <div className={styles.group}>
                <label htmlFor="issuePriority">Priority</label>
                <select 
                  id="issuePriority"
                  value={newIssue.priority} 
                  onChange={e => setNewIssue({...newIssue, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className={styles.group}>
                <label htmlFor="issueDesc">Description</label>
                <textarea 
                  id="issueDesc"
                  required 
                  value={newIssue.description} 
                  onChange={e => setNewIssue({...newIssue, description: e.target.value})} 
                  placeholder="Describe the vulnerability..." 
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={creating} className={styles.submitBtn}>
                  {creating ? 'Sending...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}