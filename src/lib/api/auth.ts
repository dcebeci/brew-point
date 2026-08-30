import type { AuthUser } from '@/store/auth-store'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export interface LoginResponse {
  token: string
  user: AuthUser
}

/**
 * Demo giriş: geçerli bir e-posta + en az 6 karakter şifre kabul edilir.
 * `admin@...` ADMIN, diğerleri STAFF rolüyle giriş yapar.
 */
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  // TODO: backend hazır olunca →
  // return api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data)
  await delay()

  if (password.length < 6) {
    throw new Error('INVALID_CREDENTIALS')
  }

  return {
    token: 'mock-jwt-token',
    user: {
      email,
      role: email.toLowerCase().startsWith('admin') ? 'ADMIN' : 'STAFF',
    },
  }
}
