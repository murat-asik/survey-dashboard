// Excel satır veri yapısı
export interface ExcelRow {
    ORG_CODE: number;           // Organizasyon kodu
    YIL_REF: number;            // Referans yılı
    AY_REF: number;             // Referans ayı
    REGION_ID: number;          // Bölge kimliği
    YANIT_DURUMU: number;       // Yanıt durumu
    ANALIZ_KAYNAK: number;      // Analiz kaynağı
    KAYIT_STATU: number;        // Kayıt statüsü
    [key: string]: any;
}

export interface RegionData {
    regionName: string;
    regionCode: string;
    percentage: number;
    totalCount: number;
    matchCount: number;
}

export type DataType = 'cevaplilik' | 'analiz' | 'tamamlilik';
