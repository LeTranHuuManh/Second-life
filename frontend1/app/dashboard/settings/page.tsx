'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { Bell, Lock, Eye, Globe, Trash2 } from 'lucide-react'

interface Settings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  twoFactorAuth: boolean
  profilePrivate: boolean
  allowMessages: boolean
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    profilePrivate: false,
    allowMessages: true,
  })

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
  })

  const toggleSetting = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex pt-16">
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and security
              </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="(555) 000-0000"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                  />
                </div>
                <Button className="w-full">Save Changes</Button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications' },
                  { key: 'pushNotifications', label: 'Push Notifications' },
                  { key: 'smsNotifications', label: 'SMS Notifications' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-foreground font-medium">{label}</label>
                    <button
                      onClick={() => toggleSetting(key as keyof Settings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[key as keyof Settings] ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[key as keyof Settings] ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy & Safety
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-foreground font-medium block">Private Profile</label>
                    <p className="text-sm text-muted-foreground">
                      Hide your profile from other users
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting('profilePrivate')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.profilePrivate ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.profilePrivate ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-foreground font-medium block">Allow Messages</label>
                    <p className="text-sm text-muted-foreground">
                      Let sellers contact you
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting('allowMessages')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.allowMessages ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.allowMessages ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <label className="text-foreground font-medium block">
                      Two-Factor Authentication
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting('twoFactorAuth')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactorAuth ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactorAuth ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-red-700 mb-4">Danger Zone</h2>
              <Button
                variant="outline"
                className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
