import apiClient from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  expiration: string | Date
  user: {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

