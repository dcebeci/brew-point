export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Günlük satış özeti ve grafikler burada olacak.
      </p>
      <div className="grid grid-cols-4 gap-4">
        {['Bugünkü Satış', 'Sipariş Sayısı', 'Ort. Sepet', 'Aktif Ürün'].map(
          (label) => (
            <div
              key={label}
              className="bg-white border border-neutral-200 rounded-lg p-4"
            >
              <p className="text-xs text-neutral-500 mb-1">{label}</p>
              <p className="text-xl font-semibold">—</p>
            </div>
          ),
        )}
      </div>
      <div className="mt-6 bg-white border border-neutral-200 rounded-lg p-4 h-64 flex items-center justify-center text-neutral-400 text-sm">
        Satış trendi grafiği (yakında)
      </div>
    </div>
  )
}
