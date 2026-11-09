'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-offwhite pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-border shadow-sm space-y-6">
          <h1 className="font-display text-3xl text-text-primary">Account & Privacy Settings</h1>

          {saved && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl">
              Settings updated successfully.
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-text-primary">Display Name</label>
              <input
                type="text"
                defaultValue="Arjun Mehta"
                className="w-full px-3 py-2 border border-border rounded-xl focus:border-forest"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-primary">Primary Neighbourhood</label>
              <input
                type="text"
                defaultValue="Park Street, Kolkata"
                className="w-full px-3 py-2 border border-border rounded-xl focus:border-forest"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-forest" />
                <span>Receive email notifications for sightings of saved animals</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-forest" />
                <span>Fuzz my approximate coordinates on public sighting reports</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={() => setSaved(true)} variant="primary" size="sm">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

