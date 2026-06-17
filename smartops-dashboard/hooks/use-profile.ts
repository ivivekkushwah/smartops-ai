'use client';

import { useEffect, useState } from 'react';
import {
  profileService,
  Profile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/services/profile-service';

export function useProfile() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const loadProfile = async () => {
    try {
      const data =
        await profileService.getProfile();

      setProfile(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async (
    data: UpdateProfileRequest
  ) => {
    setSaving(true);

    try {
      const updated =
        await profileService.updateProfile(
          data
        );

      setProfile(updated);

      return updated;
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (
    data: ChangePasswordRequest
  ) => {
    return profileService.changePassword(
      data
    );
  };

  return {
    profile,
    loading,
    saving,
    updateProfile,
    changePassword,
  };
}