'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="auth-container">
      <div style={{ color: 'var(--text-secondary)' }}>Redirecting...</div>
    </div>
  );
}
