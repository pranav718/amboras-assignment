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
        padding: '24px 48px',
        borderBottom: '1px solid #333333',
        flexWrap: 'wrap',
        gap: '24px',
        background: '#000000',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 
          style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, letterSpacing: '-0.5px' }}
        >
          Analytics
        </h1>
        <div style={{ width: '1px', height: '16px', background: '#333333' }} />
        <p style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 500 }}>{storeName}</p>
      </div>

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFFFF' }} />
          <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>
            Syncing
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 24px',
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            color: '#000000',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-inter), sans-serif',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Depart
        </button>
      </div>
    </header>
  );
}
