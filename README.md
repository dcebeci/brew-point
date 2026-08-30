# ☕ Brew Point

Kurgusal bir kafe için sipariş, menü ve satış analizi yönetim paneli.
React 19 + TypeScript ile yazılmış, Spring Boot backend'ine bağlanmaya hazır
bir portfolyo projesi.

Şu an tüm veri `src/lib/mock-db.ts` içindeki bellek içi sahte veritabanından
geliyor; servis katmanının imzaları backend sözleşmesiyle birebir aynı olduğu
için geçiş her endpoint'te tek satırlık bir değişiklik olacak.

## Özellikler

- **Dashboard** — 4 KPI kartı (düne göre yüzde değişimle), satış trendi (30 gün),
  en çok satan ürünler, saatlik yoğunluk ve kategori bazlı ciro grafikleri
- **Siparişler** — sunucu şeklinde sayfalama, durum/tarih filtresi, arama,
  sipariş detay modalı ve durum güncelleme
- **Menü** — ürün CRUD, kategori filtresi, düşük stok rozeti, form validasyonu
- **Ayarlar** — kafe bilgileri, tema ve dil tercihi, hesap özeti
- **i18n** — TR/EN, tercih `localStorage`'da saklanır; para/tarih formatları
  `Intl` ile dile göre değişir
- **Tema** — açık/koyu mod, semantik CSS token'ları üzerinden
- **Responsive** — mobilde sidebar drawer, yatay kaydırılabilir tablolar
- Route bazlı code splitting, loading skeleton'ları, toast bildirimleri

## Tech Stack

| Alan | Kütüphane |
| --- | --- |
| UI | React 19, TypeScript, Vite |
| Stil | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Server state | TanStack Query |
| Client state | Zustand (persist) |
| Routing | React Router v7 |
| Form | React Hook Form + Zod |
| Grafik | Recharts |
| HTTP | Axios (interceptor'lı instance) |
| i18n | i18next + react-i18next |
| İkon | lucide-react |
| Lint | oxlint |

## Kurulum

```bash
npm install
npm run dev
```

`http://localhost:5173` adresinde açılır.

Demo giriş: **admin@brewpoint.com / brewpoint**
(`admin` ile başlayan e-postalar ADMIN, diğerleri STAFF rolüyle giriş yapar.)

### Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın:

```
VITE_API_URL=http://localhost:8080/api
```

### Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Tip kontrolü + production build |
| `npm run preview` | Build çıktısını önizle |
| `npm run lint` | oxlint |

## Klasör Yapısı

```
src/
├─ components/
│  ├─ ui/          # Button, Card, Field, Modal, Toaster... (tasarım primitifleri)
│  ├─ layout/      # AppLayout, Sidebar, Navbar
│  ├─ dashboard/   # KPI kartı ve Recharts grafikleri
│  ├─ orders/      # Sipariş detay modalı
│  └─ products/    # Ürün formu, silme onayı
├─ pages/          # Login, Dashboard, Orders, Products, Settings
├─ hooks/          # TanStack Query hook'ları, formatlayıcılar, tema, debounce
├─ lib/
│  ├─ api/         # Servis katmanı (şu an mock, backend'e hazır)
│  ├─ mock-db.ts   # Bellek içi sahte veritabanı
│  ├─ axios.ts     # JWT interceptor'lı axios instance
│  └─ format.ts    # Intl tabanlı para/tarih/sayı formatları
├─ store/          # Zustand: auth, ui (tema/drawer), toast
├─ types/          # Domain tipleri (Order, Product, Page<T>...)
└─ i18n/           # i18next config + tr/en çevirileri
```

## Backend'e Geçiş

`src/lib/api/*.ts` içindeki her fonksiyonun başında hedef endpoint çağrısı
yorum olarak duruyor. Backend hazır olduğunda mock gövdeyi silip yorumdaki
satırı açmak yeterli — tipler ve `Page<T>` şekli zaten Spring Boot yanıtıyla
uyumlu.

İlerleme durumu ve yol haritası için [PROGRESS.md](PROGRESS.md).
