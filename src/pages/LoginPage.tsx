import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Coffee } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { login as loginRequest } from '@/lib/api/auth'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'

const DEMO_EMAIL = 'admin@brewpoint.com'
const DEMO_PASSWORD = 'brewpoint'

export function LoginPage() {
  const { t, i18n } = useTranslation()
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('login.emailInvalid')),
        password: z.string().min(6, t('login.passwordTooShort')),
      }),
    [t],
  )

  type LoginForm = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setFormError(null)
    try {
      const response = await loginRequest(data.email, data.password)
      login(response.token, response.user)
      navigate('/dashboard', { replace: true })
    } catch {
      setFormError(t('login.failed'))
    }
  }

  const fillDemo = () => {
    setValue('email', DEMO_EMAIL)
    setValue('password', DEMO_PASSWORD)
  }

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language.startsWith('tr') ? 'en' : 'tr')

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Coffee size={20} className="text-brand" />
            Brew Point
          </span>
          <button
            onClick={toggleLanguage}
            className="text-xs font-medium text-muted hover:text-fg transition-colors uppercase"
          >
            {i18n.language.startsWith('tr') ? 'EN' : 'TR'}
          </button>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h1 className="text-base font-semibold">{t('login.heading')}</h1>
          <p className="text-sm text-muted mt-0.5 mb-5">{t('login.title')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label={t('login.email')} error={errors.email?.message}>
              <Input
                type="email"
                autoComplete="email"
                placeholder={t('login.emailPlaceholder')}
                {...register('email')}
              />
            </Field>

            <Field label={t('login.password')} error={errors.password?.message}>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
              />
            </Field>

            {formError && (
              <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted">
              {t('login.demoHint', {
                email: DEMO_EMAIL,
                password: DEMO_PASSWORD,
              })}
            </p>
            <button
              onClick={fillDemo}
              className="text-xs font-medium text-brand hover:underline mt-1.5"
            >
              {t('login.fillDemo')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
