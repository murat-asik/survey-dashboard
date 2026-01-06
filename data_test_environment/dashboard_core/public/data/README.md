## 📁 Excel Veri Dosyası Bilgilendirmesi

Bu klasöre Excel veri dosyanızı yerleştirin.

## Dosya Adı
**Mevcut dosya**: `durum.raporu_2.xls` (Otomatik yüklendi ✅)

Farklı bir dosya adı kullanmak isterseniz, `src/dataUtils.ts` dosyasındaki `EXCEL_FILE_PATH` değişkenini güncelleyin.

## Gerekli Kolonlar

Excel dosyanız şu kolonları içermelidir:

1. **REGION_ID** (number): Bölge kimliği
   - Örnek değerler: 600, 2200, 3402, 4100, vb.

2. **REFERANS_AY** (number): Ay numarası
   - Değerler: 1 (Ocak) - 12 (Aralık)
   
3. **CEVAPLILIK_DURUM** (number): Cevaplılık durumu
   - Değerler: 0 (hayır) veya 1 (evet)
   
4. **C_ANALYZE_APP** (number): Analiz durumu
   - Değerler: 0 (hayır) veya 1 (evet)
   
5. **C_RECORD_STATUS** (number): Kayıt durumu
   - Değerler: 0 (hayır) veya 1 (evet)

## Örnek Veri Satırı

| REGION_ID | REFERANS_AY | CEVAPLILIK_DURUM | C_ANALYZE_APP | C_RECORD_STATUS |
|---------------|-------------|------------------|---------------|-----------------|
| 600           | 1           | 1                | 1             | 0               |
| 2200          | 2           | 1                | 0             | 1               |
| 3401          | 3           | 0                | 1             | 1               |

## Notlar

- Excel dosyası UTF-8 kodlamasında olmalıdır
- Türkçe karakterler (ı, ş, ç, ğ, ü, ö) desteklenmektedir
- İlk satır başlık satırı olmalıdır
- Boş satırlar otomatik olarak atlanır
