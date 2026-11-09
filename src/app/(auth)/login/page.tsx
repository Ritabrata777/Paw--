'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Invalid credentials');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-32 pb-24 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-border shadow-md space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block font-display text-2xl text-forest">
              PAW<span className="text-orange">TRACE</span>
            </Link>
            <h1 className="font-display text-3xl text-text-primary">Welcome Back</h1>
            <p className="text-xs text-text-secondary">
              Sign in to manage your registered animals and community reports
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Credentials */}
          <div className="p-3 bg-cream/70 rounded-xl border border-border-light text-[11px] text-text-secondary space-y-1">
            <p className="font-semibold text-forest">Demonstration Accounts (Password: any):</p>
            <p>Admin: arjun@pawtrace.org</p>
            <p>Caregiver: rahul@example.com</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border text-xs focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border text-xs focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={loading} size="lg">
              Sign In to Pawthik (Paw-থিক)
            </Button>
          </form>

          <div className="text-center text-xs text-text-secondary pt-2">
            Don't have an account yet?{' '}
            <Link href="/signup" className="text-forest font-semibold hover:underline">
              Join the Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

