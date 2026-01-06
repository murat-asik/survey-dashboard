// Bölge ofisleri ve şehir listesi
export const REGIONS: Record<string, string[]> = {
    "Edirne Bölge Ofisi": ["Edirne", "Tekirdağ", "Kırklareli"],
    "İstanbul Avrupa Bölge Ofisi": ["İstanbul (Avrupa)"],
    "İstanbul Anadolu Bölge Ofisi": ["İstanbul (Anadolu)"],
    "Kocaeli Bölge Ofisi": ["Kocaeli", "Düzce", "Sakarya", "Bolu", "Yalova"],
    "Zonguldak Bölge Ofisi": ["Zonguldak", "Karabük", "Bartın"],
    "Kastamonu Bölge Ofisi": ["Kastamonu", "Çankırı", "Sinop"],
    "Samsun Bölge Ofisi": ["Samsun", "Tokat", "Çorum", "Amasya"],
    "Trabzon Bölge Ofisi": ["Trabzon", "Ordu", "Giresun", "Rize", "Artvin", "Gümüşhane"],
    "Kars Bölge Ofisi": ["Kars", "Iğdır", "Ağrı", "Ardahan"],
    "Erzurum Bölge Ofisi": ["Erzurum", "Erzincan", "Bayburt"],
    "Kayseri Bölge Ofisi": ["Kayseri", "Sivas", "Yozgat"],
    "Nevşehir Bölge Ofisi": ["Nevşehir", "Aksaray", "Niğde", "Kırıkkale", "Kırşehir"],
    "Ankara Bölge Ofisi": ["Ankara"],
    "Bursa Bölge Ofisi": ["Bursa", "Eskişehir", "Bilecik"],
    "Balıkesir Bölge Ofisi": ["Balıkesir", "Çanakkale"],
    "İzmir Bölge Ofisi": ["İzmir"],
    "Manisa Bölge Ofisi": ["Manisa", "Afyon", "Kütahya", "Uşak"],
    "Konya Bölge Ofisi": ["Konya", "Karaman"],
    "Malatya Bölge Ofisi": ["Malatya", "Elazığ", "Bingöl", "Tunceli"],
    "Van Bölge Ofisi": ["Van", "Muş", "Bitlis", "Hakkari"],
    "Siirt Bölge Ofisi": ["Siirt", "Mardin", "Batman", "Şırnak"],
    "Diyarbakır Bölge Ofisi": ["Diyarbakır", "Şanlıurfa"],
    "Gaziantep Bölge Ofisi": ["Gaziantep", "Adıyaman", "Kilis"],
    "Hatay Bölge Ofisi": ["Hatay", "Osmaniye", "Kahramanmaraş"],
    "Adana Bölge Ofisi": ["Adana", "Mersin"],
    "Antalya Bölge Ofisi": ["Antalya", "Isparta", "Burdur"],
    "Denizli Bölge Ofisi": ["Denizli", "Muğla", "Aydın"]
};

// Bölge kod tanımlamaları
// İstanbul iki ayrı bölge olarak tanımlanmıştır
export const REGION_CODES: Record<string, string> = {
    "Edirne Bölge Ofisi": "2200",
    "İstanbul Avrupa Bölge Ofisi": "3402", // Sabit ID
    "İstanbul Anadolu Bölge Ofisi": "3401", // Sabit ID
    "Kocaeli Bölge Ofisi": "4100",
    "Zonguldak Bölge Ofisi": "6700",
    "Kastamonu Bölge Ofisi": "3700",
    "Samsun Bölge Ofisi": "5500",
    "Trabzon Bölge Ofisi": "6100",
    "Kars Bölge Ofisi": "3600",
    "Erzurum Bölge Ofisi": "2500",
    "Kayseri Bölge Ofisi": "3800",
    "Nevşehir Bölge Ofisi": "5000",
    "Ankara Bölge Ofisi": "0600",
    "Bursa Bölge Ofisi": "1600",
    "Balıkesir Bölge Ofisi": "1000",
    "İzmir Bölge Ofisi": "3500",
    "Manisa Bölge Ofisi": "4500",
    "Konya Bölge Ofisi": "4200",
    "Malatya Bölge Ofisi": "4400",
    "Van Bölge Ofisi": "6500",
    "Siirt Bölge Ofisi": "5600",
    "Diyarbakır Bölge Ofisi": "2100",
    "Gaziantep Bölge Ofisi": "2700",
    "Hatay Bölge Ofisi": "3100",
    "Adana Bölge Ofisi": "0100",
    "Antalya Bölge Ofisi": "0700",
    "Denizli Bölge Ofisi": "2000"
};

export const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export const DATA_TYPES = [
    { value: 'cevaplilik', label: 'Cevaplılık' },
    { value: 'analiz', label: 'Analiz' },
    { value: 'tamamlilik', label: 'Tamamlılık' }
];

export const YEARS = [2021, 2022, 2023, 2024, 2025];

export const YEAR_OPTIONS = YEARS.map(year => ({ value: year.toString(), label: year.toString() }));

// Harita görselleştirmesi için şehir-bölge eşleşmesi  
export const CITY_TO_REGION: Record<string, string> = {};
Object.entries(REGIONS).forEach(([regionName, cities]) => {
    cities.forEach(city => {
        CITY_TO_REGION[city] = regionName;
    });
});
