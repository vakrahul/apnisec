'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
// FIX: Importing the file that actually exists in this folder
import styles from './create-issue.module.scss'; 

export default function CreateIssuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'Cloud Security',
    description: '',
    priority: 'Medium',
    status: 'Open'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createIssue(form);
      alert('Issue Created Successfully!');
      router.push('/dashboard');
    } catch (error) {
      alert('Failed to create issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.glassCard}>
        <h1>Report New Security Issue</h1>
        
        <div className={styles.contentContainer}>
          {/* Form Section */}
          <form className={styles.formColumn} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Issue Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="Cloud Security">Cloud Security</option>
                  <option value="Reteam Assessment">Red Team Assessment</option>
                  <option value="VAPT">VAPT</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Title</label>
                <input 
                  type="text" 
                  required 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  placeholder="e.g. SQL Injection on Login"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea 
                required 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Describe the vulnerability..."
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Priority</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Status</label>
                <select value={form.status} disabled>
                  <option value="Open">Open</option>
                </select>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Issue'}
            </button>
          </form>

          {/* Image Section - Ensure this image exists in public/assets or remove the img tag */}
          <div className={styles.visualColumn}>
            <img src="/assets/bug-graphic.png" alt="Security Bug" />
          </div>
        </div>
      </div>
    </main>
  );
}