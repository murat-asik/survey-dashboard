# Bölgesel Anket Veri Analiz Platformu

> Modern, interaktif ve kullanıcı dostu web tabanlı veri görselleştirme platformu

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-purple.svg)](https://vitejs.dev/)

## 📖 Proje Hakkında

Bölgesel Anket Veri Analiz Platformu, 26 bölge ofisine ait anket veri kalitesi metriklerini interaktif harita üzerinde görselleştiren modern bir web uygulamasıdır. Sistem, 2021-2025 yılları arasındaki verileri analiz ederek Yanıt Oranı, Analiz ve Tamamlılık oranlarını renk kodlu harita ile sunar.

### ✨ Temel Özellikler

- 🗺️ **İnteraktif Türkiye Haritası** - Zoom, pan ve hover özellikleri
- 📅 **Yıl Bazlı Filtreleme** - 2021-2025 arası veri görüntüleme
- 📊 **Üç Farklı Metrik** - Yanıt Oranı, Analiz, Tamamlılık
- 🎯 **Çoklu Ay Seçimi** - Dönemsel analiz imkanı
- 🎨 **Renk Kodlu Görselleştirme** - %0 (kırmızı) → %100 (yeşil)
- 💡 **Detaylı Tooltip** - Bölge bazında istatistikler
- 📱 **Responsive Tasarım** - Tüm cihazlarda uyumlu
- ⚡ **Yüksek Performans** - Vite ile hızlı yükleme

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 16.0 veya üzeri
- npm 7.0 veya üzeri

### Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Tarayıcıda açın: http://localhost:5173
```

### Production Build

```bash
# Production build oluştur
npm run build

# Build'i önizle
npm run preview
```

## 📊 Veri Formatı

Uygulama, `public/data/test.xlsx` dosyasından veri okur. Excel dosyası şu sütunları içermelidir:

| Sütun Adı | Tip | Açıklama |
|-----------|-----|----------|
| `ORG_CODE` | Number | Benzersiz organizasyon kodu |
| `YIL_REF` | Number | Veri yılı (2021-2025) |
| `AY_REF` | Number | Ay numarası (1-12) |
| `REGION_ID` | Number | Bölge kimliği (örn: 0600 3402) |
| `YANIT_DURUMU` | Number | Yanıt durumu (0 veya 1) |
| `ANALIZ_KAYNAK` | Number | Analiz kaynağı (0 veya 1) |
| `KAYIT_STATU` | Number | Kayıt statüsü (0 veya 1) |

## 🎯 Kullanım Kılavuzu

### 1. Yıl Seçimi
Header'daki **"Yıl"** dropdown menüsünden istediğiniz yılı seçin (2021-2025).

### 2. Veri Türü Seçimi
**"Veri Türü"** menüsünden analiz etmek istediğiniz metriği seçin:
- **Cevaplılık**: Kurumların veri sağlama oranı
- **Analiz**: Analiz edilen veri oranı
- **Tamamlılık**: Tam ve eksiksiz veri oranı

### 3. Ay Seçimi
**"Aylar"** listesinden Ctrl/Cmd tuşu ile birden fazla ay seçebilirsiniz.

### 4. Harita Kontrolü
- **Zoom**: Ctrl + Mouse Wheel ile yakınlaştırma/uzaklaştırma
- **Pan**: Fare ile sürükleyerek haritayı kaydırma
- **Bilgi**: Bölge üzerine gelerek detaylı istatistikleri görüntüleme
- **Sıfırla**: Sağ üstteki ↺ butonu ile başlangıç konumuna dönme

## 🏗️ Proje Yapısı

```
dashboard_core/
├── public/
│   └── data/
│       └── test.xlsx            # Veri dosyası
├── src/
│   ├── components/
│   │   ├── TurkeyMap.tsx        # Harita bileşeni
│   │   ├── Selector.tsx         # Tekli seçim bileşeni
│   │   └── MultiSelector.tsx    # Çoklu seçim bileşeni
│   ├── styles/
│   │   ├── index.css            # Global stiller
│   │   ├── App.css              # Ana uygulama stilleri
│   │   ├── Selector.css         # Seçici stilleri
│   │   └── TurkeyMap.css        # Harita stilleri
│   ├── App.tsx                  # Ana uygulama
│   ├── dataUtils.ts             # Veri işleme fonksiyonları
│   ├── constants.ts             # Sabitler (bölgeler, aylar)
│   ├── types.ts                 # TypeScript tip tanımları
│   └── main.tsx                 # Uygulama giriş noktası
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Teknoloji Stack

### Frontend
- **React 18.2.0** - Kullanıcı arayüzü
- **TypeScript 5.2.2** - Tip güvenliği
- **Vite 5.0.8** - Build tool ve dev server

### Kütüphaneler
- **react-simple-maps 3.0.0** - SVG tabanlı harita render
- **xlsx 0.18.5** - Excel dosya okuma
- **d3-scale 4.0.2** - Veri ölçeklendirme
- **d3-interpolate 3.0.1** - Renk interpolasyonu

### Styling
- Vanilla CSS3 - Custom animasyonlar ve efektler
- CSS Variables - Tema yönetimi
- Google Fonts (Inter) - Modern tipografi

## 🎨 Bölge Kodları

| Kod | Bölge Ofisi |
|-----|-------------|
| 0600 | Ankara |
| 0100 | Adana |
| 0700 | Antalya |
| 1000 | Balıkesir |
| 1600 | Bursa |
| 2000 | Denizli |
| 2100 | Diyarbakır |
| 2200 | Edirne |
| 2500 | Erzurum |
| 2700 | Gaziantep |
| 3100 | Hatay |
| 3402 | İstanbul Avrupa |
| 3401 | İstanbul Anadolu |
| 3500 | İzmir |
| 3600 | Kars |
| 3700 | Kastamonu |
| 3800 | Kayseri |
| 4100 | Kocaeli |
| 4200 | Konya |
| 4400 | Malatya |
| 4500 | Manisa |
| 5000 | Nevşehir |
| 5500 | Samsun |
| 5600 | Siirt |
| 6100 | Trabzon |
| 6500 | Van |
| 6700 | Zonguldak |

## 📈 Performans Optimizasyonları

- ✅ React.memo ile gereksiz render'ların önlenmesi
- ✅ useMemo ile hesaplama cache'leme
- ✅ Lazy loading ile kod bölme
- ✅ CSS animasyonları ile GPU hızlandırma
- ✅ Debouncing ile event throttling

## 🔒 Güvenlik

- TypeScript ile compile-time hata yakalama
- Input validation ile veri doğrulama
- XSS koruması ile güvenli render
- Cache control ile güncel veri garantisi

## 👨‍💻 Geliştirici

**Murat Aşık**  
Geliştirme Tarihi: Kasım 2025 - Aralık 2025  
Versiyon: 3.0

## 📄 Lisans

Bu proje özel sektör anket şirketi için geliştirilmiştir.

---

**Not:** Detaylı teknik dokümantasyon için `PROJE_RAPORU.pdf` dosyasına bakınız.
