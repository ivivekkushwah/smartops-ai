'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { useProfile } from '@/hooks/use-profile';

export default function ProfilePage() {
  const {
    profile,
    loading,
    saving,
    updateProfile,
    changePassword,
  } = useProfile();

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="p-4">
        Loading profile...
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    await updateProfile({
      name,
      email,
    });

    alert('Profile updated');
  };

  const handlePasswordChange = async () => {
    await changePassword({
      currentPassword,
      newPassword,
    });

    setCurrentPassword('');
    setNewPassword('');

    alert('Password changed');
  };

  return (
    <div className="p-4 space-y-6">

      <SectionHeader
        title="Profile Settings"
        badge={profile?.role}
        badgeColor="blue"
        icon={<User className="w-4 h-4" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  {/* Profile Summary */}
  <div className="surface-card p-6">
    <div className="flex flex-col items-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
        style={{
          background:
            'linear-gradient(135deg,#06b6d4,#8b5cf6)',
          color: 'white',
        }}
      >
        {profile?.name?.charAt(0).toUpperCase()}
      </div>

      <h2 className="mt-4 text-xl font-semibold text-text1">
        {profile?.name}
      </h2>

      <span className="mt-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
        {profile?.role}
      </span>

      <p className="mt-4 text-text3 text-sm">
        SmartOps AI User
      </p>
    </div>
  </div>

  {/* Profile Form */}
  <div className="lg:col-span-2 surface-card p-6">
    <h3 className="text-lg font-semibold mb-6">
      Account Information
    </h3>

    <div className="space-y-5">

      <div>
        <label className="text-sm text-text3">
          Full Name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full mt-2 px-4 py-3 rounded-lg border bg-bg2"
        />
      </div>

      <div>
        <label className="text-sm text-text3">
          Email Address
        </label>

        <input
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full mt-2 px-4 py-3 rounded-lg border bg-bg2"
        />
      </div>

      <div>
        <label className="text-sm text-text3">
          Role
        </label>

        <input
          value={profile?.role}
          disabled
          className="w-full mt-2 px-4 py-3 rounded-lg border bg-bg2 opacity-70"
        />
      </div>

      <button
        onClick={handleProfileUpdate}
        disabled={saving}
        className="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
      >
        Save Changes
      </button>
    </div>
  </div>

</div>

      <div className="surface-card p-6">

  <h3 className="text-lg font-semibold mb-6">
    Security Settings
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input
      type="password"
      placeholder="Current Password"
      value={currentPassword}
      onChange={(e) =>
        setCurrentPassword(e.target.value)
      }
      className="px-4 py-3 rounded-lg border bg-bg2"
    />

    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) =>
        setNewPassword(e.target.value)
      }
      className="px-4 py-3 rounded-lg border bg-bg2"
    />

  </div>

  <button
    onClick={handlePasswordChange}
    className="mt-5 px-5 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white"
  >
    Update Password
  </button>

</div>
    </div>
  );
}