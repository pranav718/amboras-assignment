'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


interface HeaderProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

export default function Header({ period, onPeriodChange }: HeaderProps) {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setStoreName(parsed.store_name || parsed.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid var(--glass-border)',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'var(--gradient-primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Analytics</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{storeName}</p>
        </div>
      </div>

      {}
      <div className="period-selector">
        {[
          { key: 'today', label: 'Today' },
          { key: 'week', label: 'This Week' },
          { key: 'month', label: 'This Month' },
        ].map((p) => (
          <button
            key={p.key}
            className={`period-btn ${period === p.key ? 'active' : ''}`}
            onClick={() => onPeriodChange(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 500 }}>
            Live
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-red)';
            e.currentTarget.style.color = 'var(--accent-red)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
