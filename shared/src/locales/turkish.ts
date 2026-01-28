import { TurkishLocale } from '../types/localization';

export const turkishLocale: TurkishLocale = {
  // Form Labels
  prescription: 'Reçete',
  rightEye: 'Sağ Göz',
  leftEye: 'Sol Göz',
  sph: 'SPH (Küre)',
  cyl: 'CYL (Silindir)',
  axis: 'AXIS (Eksen)',
  frameSize: 'Çerçeve Boyutu',
  frameWidth: 'Çerçeve Genişliği (mm)',
  frameHeight: 'Çerçeve Yüksekliği (mm)',
  frameBridge: 'Burun Köprüsü (mm)',
  manualMeasurements: 'Manuel Ölçümler',
  optionalMeasurements: 'Opsiyonel - Daha hassas hesaplama için',
  lensType: 'Lens Tipi',
  usage: 'Kullanım Amacı',
  priority: 'Öncelik',

  // Lens Types
  lensTypes: {
    uzak: 'Uzak Görüş',
    yakın: 'Yakın Görüş',
    progresif: 'Progresif',
    bifocal: 'Bifokal',
    multifocal: 'Multifokal'
  },

  // Frame Sizes
  frameSizes: {
    small: 'Küçük',
    medium: 'Orta',
    large: 'Büyük'
  },

  // Priorities
  priorities: {
    thin: 'İnce Lens',
    cheap: 'Ekonomik',
    balanced: 'Dengeli'
  },

  // Priority Descriptions
  priorityDescriptions: {
    thin: 'En ince lens seçenekleri - Estetik görünüm öncelikli',
    cheap: 'En ekonomik seçenekler - Bütçe dostu çözümler',
    balanced: 'Kalınlık ve fiyat dengesi - Optimal seçim'
  },

  // Usage related text
  usageLabels: {
    placeholder: 'Gözlüklerinizi nasıl kullanacağınızı açıklayın...',
    suggestions: 'Öneriler',
    description: 'Kullanım amacınızı belirtmek daha iyi öneriler almamızı sağlar'
  },

  // Validation Messages
  validation: {
    sphRange: 'SPH değeri -20.00 ile +20.00 arasında olmalıdır',
    cylRange: 'CYL değeri -6.00 ile +6.00 arasında olmalıdır',
    axisRange: 'AXIS değeri 0 ile 180 arasında olmalıdır',
    required: 'Bu alan zorunludur',
    invalidNumber: 'Geçerli bir sayı giriniz',
    invalidPassword: 'Geçersiz şifre',
    sessionExpired: 'Oturum süresi doldu, lütfen tekrar giriş yapın'
  },

  // Thickness Warnings
  thickness: {
    safe: 'Güvenli kalınlık',
    warning: 'Dikkat: Lens kalın olabilir',
    danger: 'Uyarı: Lens çok kalın olacak'
  },

  // Navigation
  navigation: {
    home: 'Ana Sayfa',
    calculator: 'Hesaplama',
    results: 'Sonuçlar',
    dashboard: 'Kontrol Paneli',
    lensSettings: 'Lens Ayarları',
    pricing: 'Fiyatlandırma',
    coatings: 'Kaplamalar',
    rules: 'Kurallar',
    changeLog: 'Değişiklik Geçmişi',
    logout: 'Çıkış'
  },

  // Buttons
  buttons: {
    start: 'Başla',
    calculate: 'Hesapla',
    save: 'Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    delete: 'Sil',
    add: 'Ekle',
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    back: 'Geri',
    next: 'İleri',
    refresh: 'Yenile'
  },

  // Messages
  messages: {
    welcome: 'Kepekci Lens Kalınlık Hesaplama Sistemine Hoş Geldiniz',
    calculationComplete: 'Hesaplama tamamlandı',
    dataSaved: 'Veriler başarıyla kaydedildi',
    error: 'Bir hata oluştu',
    loading: 'Yükleniyor...',
    noData: 'Veri bulunamadı',
    confirmDelete: 'Bu öğeyi silmek istediğinizden emin misiniz?',
    loginRequired: 'Bu sayfaya erişmek için giriş yapmanız gerekiyor'
  },

  // Admin Specific
  admin: {
    dashboard: 'Yönetici Paneli',
    systemStats: 'Sistem İstatistikleri',
    recentActivity: 'Son Aktiviteler',
    lensIndices: 'Lens İndeksleri',
    coatingTypes: 'Kaplama Türleri',
    pricingRules: 'Fiyatlandırma Kuralları',
    referenceData: 'Referans Veriler',
    ruleEngine: 'Kural Motoru',
    usageKeywords: 'Kullanım Anahtar Kelimeleri',
    changeLog: 'Değişiklik Geçmişi'
  },

  // Currency and Formatting
  currency: {
    symbol: '₺',
    format: (amount: number): string => {
      return amount.toLocaleString('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  },

  // Date Formatting
  date: {
    format: (date: Date): string => {
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    timeFormat: (date: Date): string => {
      return date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};