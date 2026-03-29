'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@store1.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px' }} className="animate-in">
        <div style={{ marginBottom: '32px' }}>
          <h1 className="font-display" style={{ fontSize: '32px', color: '#FFFFFF', marginBottom: '8px' }}>
            Sign In
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px' }}>
            Access your analytics dashboard.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#111111',
              borderLeft: '4px solid #FFFFFF',
              color: '#FFFFFF',
              fontSize: '13px',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#A3A3A3',
                marginBottom: '8px',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#A3A3A3',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '12px' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '32px',
            padding: '16px',
            border: '1px solid #333333',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#A3A3A3',
            textAlign: 'center',
          }}
        >
          <strong style={{ color: '#FFFFFF' }}>Demo Access:</strong>
          <br />
          Store 1: demo@store1.com / password123
          <br />
          Store 2: demo@store2.com / password123
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '14px',
            color: '#A3A3A3',
          }}
        >
          No account?{' '}
          <Link
            href="/register"
            style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid #FFFFFF' }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
