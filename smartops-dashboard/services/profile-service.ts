import api from '@/service/api';

export interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  async getProfile(): Promise<Profile> {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<Profile> {
    const response = await api.put(
      '/api/auth/profile',
      data
    );

    return response.data;
  },

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<string> {
    const response = await api.put(
      '/api/auth/profile/change-password',
      data
    );

    return response.data;
  },
};