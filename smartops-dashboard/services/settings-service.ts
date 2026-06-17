import api from "@/service/api"

class SettingsService {
  async getSettings() {
    const response = await api.get('api/auth/settings')
    return response.data
  }

  async updateSettings(settings: any) {
    const response = await api.put(
      'api/auth/settings',
      settings
    )

    return response.data
  }
}

export const settingsService = new SettingsService()