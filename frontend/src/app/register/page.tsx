'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    store_id: '',
    store_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', formData);

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px' }} className="animate-in">
        <div style={{ marginBottom: '32px' }}>
          <h1 className="font-display" style={{ fontSize: '32px', color: '#FFFFFF', marginBottom: '8px' }}>
            Register
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px' }}>
            Create a new analytics dashboard account.
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                Store ID
              </label>
              <input
                type="text"
                name="store_id"
                className="auth-input"
                value={formData.store_id}
                onChange={handleChange}
                placeholder="store_001"
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
                Store Name
              </label>
              <input
                type="text"
                name="store_name"
                className="auth-input"
                value={formData.store_name}
                onChange={handleChange}
                placeholder="My Store"
                required
              />
            </div>
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
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '12px' }}>
            {loading ? 'Registering...' : 'Complete Sign Up'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '14px',
            color: '#A3A3A3',
          }}
        >
          Already registered?{' '}
          <Link
            href="/login"
            style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid #FFFFFF' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
