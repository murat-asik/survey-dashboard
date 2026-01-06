import * as XLSX from 'xlsx';
import { ExcelRow, RegionData, DataType } from './types';
import { REGION_CODES } from './constants';

// Excel veri dosyası yolu
export const EXCEL_FILE_PATH = '/data/test.xlsx';

export async function loadExcelData(filePath: string): Promise<ExcelRow[]> {
    try {
        // Önbellek engellemek için zaman damgası
        const timestamp = new Date().getTime();
        const urlWithTimestamp = `${filePath}?t=${timestamp}`;

        console.log('📊 Excel dosyası yükleniyor:', filePath);

        const response = await fetch(urlWithTimestamp, {
            cache: 'no-store',  // Önbellek kontrolü
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Çalışma sayfası okunur
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

        console.log(`✅ Excel yüklendi: ${jsonData.length} satır`);

        if (jsonData.length > 0) {
            // Sütun isimleri kontrol edilir
            const firstRow = jsonData[0];
            const actualColumns = Object.keys(firstRow);
            const expectedColumns = ['ORG_CODE', 'YIL_REF', 'AY_REF', 'REGION_ID', 'YANIT_DURUMU', 'ANALIZ_KAYNAK', 'KAYIT_STATU'];

            console.log('📋 Excel kolonları:', actualColumns);

            // Eksik sütun kontrolü
            const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
            if (missingColumns.length > 0) {
                console.error('❌ EKSIK KOLONLAR:', missingColumns);
                console.warn('⚠️ Beklenen kolonlar:', expectedColumns);
                throw new Error(`Eksik Excel kolonları: ${missingColumns.join(', ')}`);
            }

            // Veri örneği gösterimi
            console.log('📝 İlk satır örneği:', {
                ORG_CODE: firstRow.ORG_CODE,
                YIL_REF: firstRow.YIL_REF,
                AY_REF: firstRow.AY_REF,
                REGION_ID: firstRow.REGION_ID,
                YANIT_DURUMU: firstRow.YANIT_DURUMU
            });

            // Benzersiz bölge kimlikleri
            const uniqueRegions = [...new Set(jsonData.map(row => row.REGION_ID))];
            console.log('🗺️ Excel\'deki benzersiz REGION_ID değerleri:', uniqueRegions);

            // Yıl referansları
            const uniqueYears = [...new Set(jsonData.map(row => row.YIL_REF))];
            console.log('📅 Excel\'deki yıllar:', uniqueYears);

            // Ay referansları
            const uniqueMonths = [...new Set(jsonData.map(row => row.AY_REF))];
            console.log('📆 Excel\'deki aylar:', uniqueMonths);

            console.log('✅ Veri doğrulama tamamlandı');
        }

        return jsonData;
    } catch (error) {
        console.error('❌ Excel dosyası yüklenirken hata oluştu:', error);
        throw error; // Hatayı yukarı fırlat ki App.tsx yakalasın
    }
}

export function calculateRegionPercentages(
    data: ExcelRow[],
    dataType: DataType,
    selectedMonths?: number[],
    selectedYear?: number
): Record<string, RegionData> {
    console.log('🔄 Bölge yüzdeleri hesaplanıyor...');
    console.log(`📊 Toplam veri: ${data.length} satır`);
    console.log(`📅 Seçili yıl: ${selectedYear}`);
    console.log(`📆 Seçili aylar: ${selectedMonths}`);
    console.log(`📈 Veri tipi: ${dataType}`);

    const regionStats: Record<string, RegionData> = {};

    // Bölge istatistikleri başlatılır
    Object.entries(REGION_CODES).forEach(([regionName, regionCode]) => {
        regionStats[regionCode] = {
            regionName,
            regionCode,
            percentage: 0,
            totalCount: 0,
            matchCount: 0
        };
    });

    console.log(`🗺️ Toplam bölge sayısı: ${Object.keys(regionStats).length}`);

    // Yıl filtresi uygulanır
    let filteredData = data;
    if (selectedYear) {
        const beforeFilter = filteredData.length;
        filteredData = filteredData.filter(row => Number(row.YIL_REF) === selectedYear);
        console.log(`📅 Yıl filtresi (${selectedYear}): ${beforeFilter} → ${filteredData.length} satır`);

        if (filteredData.length === 0) {
            console.warn('⚠️ UYARI: Yıl filtresinden sonra hiç veri kalmadı!');
            console.warn(`   Excel'deki yıllar ile seçili yıl (${selectedYear}) eşleşmiyor olabilir.`);
        }
    }

    // Ay filtresi uygulanır
    if (selectedMonths && selectedMonths.length > 0) {
        const beforeFilter = filteredData.length;
        filteredData = filteredData.filter(row => selectedMonths.includes(Number(row.AY_REF)));
        console.log(`📆 Ay filtresi (${selectedMonths}): ${beforeFilter} → ${filteredData.length} satır`);

        if (filteredData.length === 0) {
            console.warn('⚠️ UYARI: Ay filtresinden sonra hiç veri kalmadı!');
            console.warn(`   Excel'deki aylar ile seçili aylar eşleşmiyor olabilir.`);
        }
    }

    console.log(`✅ Filtreleme sonrası toplam: ${filteredData.length} satır`);

    let totalMatchedRows = 0;
    let regionsWithData = 0;

    // Bölge bazlı hesaplama
    Object.keys(regionStats).forEach(regionCode => {
        // Bölgeye ait satırlar filtrelenir
        const regionRows = filteredData!.filter(row => {
            const excelRegionId = row.REGION_ID;
            if (!excelRegionId) return false;
            const regionCodeStr = String(excelRegionId).padStart(4, '0');
            return regionCodeStr === regionCode;
        });

        if (regionRows.length === 0) {
            return; // Bu bölge için veri yok
        }

        regionsWithData++;
        totalMatchedRows += regionRows.length;

        // Kurum kodu sayımı
        const totalKurumKeys = regionRows
            .map(row => row.ORG_CODE)
            .filter(key => key != null && key !== undefined);

        // İlgili veri tipine göre sayım yapılır
        let columnSum = 0;
        switch (dataType) {
            case 'cevaplilik':
                columnSum = regionRows.filter(row => row.YANIT_DURUMU == 1).length;
                break;
            case 'analiz':
                columnSum = regionRows.filter(row => row.ANALIZ_KAYNAK == 1).length;
                break;
            case 'tamamlilik':
                columnSum = regionRows.filter(row => row.KAYIT_STATU == 1).length;
                break;
        }

        regionStats[regionCode].totalCount = totalKurumKeys.length;
        regionStats[regionCode].matchCount = columnSum;

        // Oran hesaplaması
        if (totalKurumKeys.length > 0) {
            regionStats[regionCode].percentage = (columnSum / totalKurumKeys.length) * 100;
        }

        // Detaylı loglama
        if (regionsWithData <= 3) {
            console.log(`   🏢 ${regionStats[regionCode].regionName} (${regionCode}):`, {
                satırSayısı: regionRows.length,
                toplamOrg: totalKurumKeys.length,
                eşleşen: columnSum,
                yüzde: regionStats[regionCode].percentage.toFixed(1) + '%'
            });
        }
    });

    console.log(`📊 Özet: ${regionsWithData}/${Object.keys(regionStats).length} bölgede veri var`);
    console.log(`📝 Toplam eşleşen satır: ${totalMatchedRows}/${filteredData.length}`);

    if (regionsWithData === 0) {
        console.error('❌ KRİTİK: HİÇ BİR BÖLGE İLE VERİ EŞLEŞMEDİ!');
        console.error('   Olası nedenler:');
        console.error('   1. Excel REGION_ID değerleri beklenen formatla eşleşmiyor');
        console.error('   2. REGION_ID sütunu yanlış formatta (string/number uyumsuzluğu)');
        console.error('   Beklenen kodlar:', Object.keys(regionStats).join(', '));
    }

    return regionStats;
}

export function getColorForPercentage(percentage: number): string {
    // Yüzdeye göre renk değeri hesaplanır (Kırmızı -> Yeşil)
    const hue = (percentage / 100) * 120; // 0° = kırmızı, 120° = yeşil
    const lightness = 50 - (percentage / 100) * 10; // %50 ile %40 arası açıklık

    return `hsl(${hue}, 100%, ${lightness}%)`;
}
