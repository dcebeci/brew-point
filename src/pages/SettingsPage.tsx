import { useTranslation } from 'react-i18next'

export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">{t('settings.title')}</h1>
      <p className="text-neutral-500 text-sm mb-6">
        {t('settings.subtitle')}
      </p>
      <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center text-neutral-400 text-sm">
        {t('common.noContent')}
      </div>
    </div>
  )
}
