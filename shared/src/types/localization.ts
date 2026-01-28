// Turkish Localization Types
export interface TurkishLocale {
  // Form Labels
  prescription: string;
  rightEye: string;
  leftEye: string;
  sph: string;
  cyl: string;
  axis: string;
  frameSize: string;
  frameWidth: string;
  frameHeight: string;
  frameBridge: string;
  manualMeasurements: string;
  optionalMeasurements: string;
  lensType: string;
  usage: string;
  priority: string;

  // Lens Types
  lensTypes: {
    uzak: string;
    yakın: string;
    progresif: string;
    bifocal: string;
    multifocal: string;
  };

  // Frame Sizes
  frameSizes: {
    small: string;
    medium: string;
    large: string;
  };

  // Priorities
  priorities: {
    thin: string;
    cheap: string;
    balanced: string;
  };

  // Priority Descriptions
  priorityDescriptions: {
    thin: string;
    cheap: string;
    balanced: string;
  };

  // Usage related text
  usageLabels: {
    placeholder: string;
    suggestions: string;
    description: string;
  };

  // Validation Messages
  validation: {
    sphRange: string;
    cylRange: string;
    axisRange: string;
    required: string;
    invalidNumber: string;
    invalidPassword: string;
    sessionExpired: string;
  };

  // Thickness Warnings
  thickness: {
    safe: string;
    warning: string;
    danger: string;
  };

  // Navigation
  navigation: {
    home: string;
    calculator: string;
    results: string;
    dashboard: string;
    lensSettings: string;
    pricing: string;
    coatings: string;
    rules: string;
    changeLog: string;
    logout: string;
  };

  // Buttons
  buttons: {
    start: string;
    calculate: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    add: string;
    login: string;
    logout: string;
    back: string;
    next: string;
    refresh: string;
  };

  // Messages
  messages: {
    welcome: string;
    calculationComplete: string;
    dataSaved: string;
    error: string;
    loading: string;
    noData: string;
    confirmDelete: string;
    loginRequired: string;
  };

  // Admin Specific
  admin: {
    dashboard: string;
    systemStats: string;
    recentActivity: string;
    lensIndices: string;
    coatingTypes: string;
    pricingRules: string;
    referenceData: string;
    ruleEngine: string;
    usageKeywords: string;
    changeLog: string;
  };

  // Currency and Formatting
  currency: {
    symbol: string;
    format: (amount: number) => string;
  };

  // Date Formatting
  date: {
    format: (date: Date) => string;
    timeFormat: (date: Date) => string;
  };
}

export interface LocalizationContextType {
  locale: TurkishLocale;
  formatPrice: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatNumber: (value: number, decimals?: number) => string;
  getText: (key: string) => string;
}