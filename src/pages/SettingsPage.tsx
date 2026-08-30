import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Moon, Sun } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuthStore } from '@/store/auth-store'
import { useUiStore } from '@/store/ui-store'
import { toast } from '@/store/toast-store'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)

  const [cafeName, setCafeName] = useState('Brew Point')
  const [address, setAddress] = useState('Bağdat Cad. No:42, Kadıköy / İstanbul')
  const [phone, setPhone] = useState('+90 216 000 00 00')

  const handleSave = () => {
    // TODO: backend hazır olunca PUT /settings çağrısına bağlanacak.
    toast.success(t('settings.toast.saved'))
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <Card className="mb-4">
        <CardHeader
          title={t('settings.cafe.title')}
          description={t('settings.cafe.description')}
        />
        <div className="px-5 pb-5 space-y-4">
          <Field label={t('settings.cafe.name')}>
            <Input
              value={cafeName}
              onChange={(event) => setCafeName(event.target.value)}
            />
          </Field>
          <Field label={t('settings.cafe.address')}>
            <Input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </Field>
          <Field label={t('settings.cafe.phone')}>
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Field>
          <Button onClick={handleSave}>{t('common.save')}</Button>
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader
          title={t('settings.appearance.title')}
          description={t('settings.appearance.description')}
        />
        <div className="px-5 pb-5 space-y-4">
          <Field label={t('settings.appearance.theme')}>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun size={14} />
                {t('settings.appearance.light')}
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon size={14} />
                {t('settings.appearance.dark')}
              </Button>
            </div>
          </Field>
          <Field label={t('settings.appearance.language')}>
            <Select
              value={i18n.language.split('-')[0]}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              className="max-w-xs"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title={t('settings.account.title')} />
        <dl className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-muted mb-1">
              {t('settings.account.email')}
            </dt>
            <dd className="font-medium break-all">{user?.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted mb-1">
              {t('settings.account.role')}
            </dt>
            <dd className="font-medium">
              {user ? t('settings.account.roles.' + user.role) : '—'}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
