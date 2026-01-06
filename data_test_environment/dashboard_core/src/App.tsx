import { useState, useEffect } from 'react';
import Selector from './components/Selector';
import MultiSelector from './components/MultiSelector';
import TurkeyMap from './components/TurkeyMap';
import { DataType, RegionData, ExcelRow } from './types';
import { DATA_TYPES, MONTHS, YEAR_OPTIONS } from './constants';
import { loadExcelData, calculateRegionPercentages, EXCEL_FILE_PATH } from './dataUtils';
import './styles/App.css';

function App() {
    const [selectedYear, setSelectedYear] = useState<string>('2025'); // Varsayılan yıl
    const [dataType, setDataType] = useState<DataType>('cevaplilik');
    const [selectedMonths, setSelectedMonths] = useState<string[]>(MONTHS.slice(0, 11)); // Varsayılan ay aralığı
    const [excelData, setExcelData] = useState<ExcelRow[]>([]);
    const [regionData, setRegionData] = useState<Record<string, RegionData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Veri yükleme işlemi
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await loadExcelData(EXCEL_FILE_PATH);
                setExcelData(data);
            } catch (err) {
                setError('Excel dosyası yüklenirken hata oluştu. Lütfen dosya yolunu kontrol edin.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Hesaplama güncelleme işlemi
    useEffect(() => {
        if (excelData.length > 0) {
            // Ay indeksi dönüşümü
            const monthIndices = selectedMonths.map(month => MONTHS.indexOf(month) + 1);
            const calculatedData = calculateRegionPercentages(excelData, dataType, monthIndices, Number(selectedYear));
            setRegionData(calculatedData);
        }
    }, [excelData, dataType, selectedMonths, selectedYear]);

    const monthOptions = MONTHS.map(month => ({ value: month, label: month }));

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">Bölgesel Anket Veri Analizi</h1>
                    <div className="selectors">
                        <Selector
                            label="Yıl"
                            options={YEAR_OPTIONS}
                            value={selectedYear}
                            onChange={setSelectedYear}
                        />
                        <Selector
                            label="Veri Türü"
                            options={DATA_TYPES}
                            value={dataType}
                            onChange={(value) => setDataType(value as DataType)}
                        />
                        <MultiSelector
                            label="Aylar (Çoklu Seçim)"
                            options={monthOptions}
                            values={selectedMonths}
                            onChange={setSelectedMonths}
                        />
                    </div>
                </div>
            </header>

            <main className="app-main">
                {isLoading && (
                    <div className="loading-message">Veriler yükleniyor...</div>
                )}

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <p className="error-detail">
                            Beklenen dosya yolu: <code>{EXCEL_FILE_PATH}</code>
                        </p>
                    </div>
                )}

                {!isLoading && !error && excelData.length === 0 && (
                    <div className="info-message">
                        <p>Excel verisi bulunamadı.</p>
                        <p>
                            Lütfen <code>{EXCEL_FILE_PATH}</code> konumuna Excel dosyanızı yerleştirin.
                        </p>
                        <div className="data-format-info">
                            <h3>Beklenen Excel Formatı:</h3>
                            <ul>
                                <li>REGION_ID: Bölge kimliği</li>
                                <li>AY_REF: Ay (1-12)</li>
                                <li>YANIT_DURUMU: Yanıt durumu (0 veya 1)</li>
                                <li>ANALIZ_KAYNAK: Analiz kaynağı (0 veya 1)</li>
                                <li>KAYIT_STATU: Kayıt statüsü (0 veya 1)</li>
                            </ul>
                        </div>
                    </div>
                )}

                {!isLoading && !error && excelData.length > 0 && (
                    <>
                        <div className="selected-months-info">
                            <strong>Seçili Aylar:</strong> {selectedMonths.join(', ')}
                            <span className="month-count">({selectedMonths.length} ay)</span>
                        </div>
                        <TurkeyMap regionData={regionData} />
                    </>
                )}
            </main>

            <footer className="app-footer">
                <div className="footer-content-wrapper">
                    <p className="footer-center">Toplam {excelData.length} kayıt yüklendi</p>
                    <p className="footer-right">Developed by Murat Aşık</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
