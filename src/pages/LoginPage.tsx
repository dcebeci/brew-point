import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    // TODO: backend hazır olunca gerçek /auth/login çağrısına bağla
    // const res = await api.post('/auth/login', data)
    login('mock-jwt-token', { email: data.email, role: 'ADMIN' })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-lg p-8">
        <h1 className="text-xl font-semibold mb-1">☕ Brew Point</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Yönetim paneline giriş yap
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">E-posta</label>
            <input
              type="email"
              {...register('email')}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="ornek@brewpoint.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Şifre</label>
            <input
              type="password"
              {...register('password')}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neutral-900 text-white text-sm font-medium py-2 rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            Giriş yap
          </button>
        </form>
      </div>
    </div>
  )
}
