'use client';

import React from 'react';
import Link from 'next/link';
import { User, Mail, Shield, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-border shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-forest text-cream font-display text-2xl flex items-center justify-center">
              AM
            </div>
            <div>
              <h1 className="font-display text-2xl text-text-primary">Arjun Mehta</h1>
              <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sage" /> Park Street, Kolkata
              </p>
            </div>
          </div>

          <div className="divide-y divide-border-light text-xs pt-4">
            <div className="py-3 flex justify-between">
              <span className="text-text-secondary">Email</span>
              <span className="font-medium text-text-primary">arjun@pawtrace.org</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-text-secondary">Community Role</span>
              <span className="font-semibold text-forest">Verified Caregiver / Admin</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-text-secondary">Registered Animals</span>
              <span className="font-medium text-text-primary">4 Animals</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-text-secondary">Member Since</span>
              <span className="font-medium text-text-primary">June 2026</span>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button href="/dashboard" variant="primary" size="sm">
              Go to Dashboard
            </Button>
            <Button href="/settings" variant="secondary" size="sm">
              Account Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

