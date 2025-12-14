import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    alerts: 'Alerts',
    profile: 'Profile',
    favorites: 'Favorites',
    notifications: 'Notifications',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    settings: 'Settings',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    
    // Auth
    phone_number: 'Phone Number',
    password: 'Password',
    confirm_password: 'Confirm Password',
    forgot_password: 'Forgot Password?',
    remember_me: 'Remember me',
    no_account: "Don't have an account?",
    have_account: 'Already have an account?',
    sign_up: 'Sign Up',
    sign_in: 'Sign In',
    verify_phone: 'Verify Phone',
    enter_otp: 'Enter OTP sent to your phone',
    resend_otp: 'Resend OTP',
    
    // Passenger
    search_routes: 'Search Routes',
    popular_routes: 'Popular Routes',
    live_map: 'Live Map',
    nearest_stage: 'Nearest Stage',
    estimated_arrival: 'Estimated Arrival',
    capacity: 'Capacity',
    empty: 'Empty',
    half_full: 'Half Full',
    full: 'Full',
    reserve_seat: 'Reserve Seat',
    notify_me: 'Notify Me',
    share_eta: 'Share ETA',
    fare: 'Fare',
    distance: 'Distance',
    duration: 'Duration',
    
    // Driver
    start_trip: 'Start Trip',
    end_trip: 'End Trip',
    pause_trip: 'Pause Trip',
    resume_trip: 'Resume Trip',
    current_location: 'Current Location',
    speed: 'Speed',
    heading: 'Heading',
    earnings: 'Earnings',
    trips_today: 'Trips Today',
    rating: 'Rating',
    vehicle: 'Vehicle',
    
    // Admin
    dashboard: 'Dashboard',
    fleet: 'Fleet',
    drivers: 'Drivers',
    revenue: 'Revenue',
    analytics: 'Analytics',
    reports: 'Reports',
    announcements: 'Announcements',
    
    // Alerts
    report_incident: 'Report Incident',
    incident_type: 'Incident Type',
    traffic: 'Traffic',
    police: 'Police',
    accident: 'Accident',
    road_block: 'Road Block',
    other: 'Other',
    description: 'Description',
    submit_report: 'Submit Report',
    verify_report: 'Verify Report',
    
    // Payments
    pay_with_mpesa: 'Pay with M-Pesa',
    enter_mpesa_pin: 'Enter M-Pesa PIN',
    confirm_payment: 'Confirm Payment',
    payment_success: 'Payment Successful',
    payment_failed: 'Payment Failed',
    transaction_id: 'Transaction ID',
    amount: 'Amount',
    
    // Time
    now: 'Now',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    today: 'Today',
    yesterday: 'Yesterday',
    this_week: 'This Week',
    this_month: 'This Month',
    
    // Errors
    connection_error: 'Connection Error',
    try_again: 'Try Again',
    offline_message: 'You are offline. Some features may be unavailable.',
    
    // Success Messages
    reservation_success: 'Seat reserved successfully!',
    report_submitted: 'Report submitted successfully!',
    location_updated: 'Location updated!',
    trip_started: 'Trip started!',
    trip_ended: 'Trip ended!',
    
    // Kenyan Specific
    matatu: 'Matatu',
    sacco: 'SACCO',
    stage: 'Stage',
    route: 'Route',
    nairobi: 'Nairobi',
    cbd: 'CBD',
    githurai: 'Githurai',
    kasarani: 'Kasarani',
    westlands: 'Westlands',
    karen: 'Karen',
    rongai: 'Rongai',
    kitengela: 'Kitengela',
  },
  sw: {
    // Navigation
    home: 'Nyumbani',
    search: 'Tafuta',
    alerts: 'Taarifa',
    profile: 'Wasifu',
    favorites: 'Vipendwa',
    notifications: 'Arifa',
    login: 'Ingia',
    register: 'Jisajili',
    logout: 'Toka',
    settings: 'Mipangilio',
    
    // Common
    loading: 'Inapakia...',
    error: 'Hitilafu',
    success: 'Imefanikiwa',
    cancel: 'Ghairi',
    confirm: 'Thibitisha',
    save: 'Hifadhi',
    delete: 'Futa',
    edit: 'Hariri',
    view: 'Tazama',
    back: 'Rudi',
    next: 'Ifuatayo',
    done: 'Imekamilika',
    
    // Auth
    phone_number: 'Nambari ya Simu',
    password: 'Nenosiri',
    confirm_password: 'Thibitisha Nenosiri',
    forgot_password: 'Umesahau nenosiri?',
    remember_me: 'Nikumbuke',
    no_account: 'Huna akaunti?',
    have_account: 'Tayari una akaunti?',
    sign_up: 'Jisajili',
    sign_in: 'Ingia',
    verify_phone: 'Hakiki Simu',
    enter_otp: 'Weka OTP iliyotumwa kwenye simu yako',
    resend_otp: 'Tuma tena OTP',
    
    // Passenger
    search_routes: 'Tafuta Njia',
    popular_routes: 'Njia Maarufu',
    live_map: 'Ramani ya Moja kwa Moja',
    nearest_stage: 'Kituo cha Karibu',
    estimated_arrival: 'Muda wa Kufika',
    capacity: 'Uwezo',
    empty: 'Tupu',
    half_full: 'Nusu Jaa',
    full: 'Jaa',
    reserve_seat: 'Hifadhi Kit',
    notify_me: 'Nijulishe',
    share_eta: 'Shiriki Muda wa Kufika',
    fare: 'Nauli',
    distance: 'Umbali',
    duration: 'Muda',
    
    // Driver
    start_trip: 'Anza Safari',
    end_trip: 'Maliza Safari',
    pause_trip: 'Sitisha Safari',
    resume_trip: 'Endelea Safari',
    current_location: 'Mahali Upo',
    speed: 'Kasi',
    heading: 'Mwelekeo',
    earnings: 'Mapato',
    trips_today: 'Safari Leo',
    rating: 'Ukadiriaji',
    vehicle: 'Gari',
    
    // Admin
    dashboard: 'Dashibodi',
    fleet: 'Meli',
    drivers: 'Madereva',
    revenue: 'Mapato',
    analytics: 'Uchambuzi',
    reports: 'Ripoti',
    announcements: 'Matangazo',
    
    // Alerts
    report_incident: 'Ripoti Tukio',
    incident_type: 'Aina ya Tukio',
    traffic: 'Msongamano',
    police: 'Polisi',
    accident: 'Ajali',
    road_block: 'Kizuizi Barabarani',
    other: 'Nyingine',
    description: 'Maelezo',
    submit_report: 'Wasilisha Ripoti',
    verify_report: 'Thibitisha Ripoti',
    
    // Payments
    pay_with_mpesa: 'Lipa kwa M-Pesa',
    enter_mpesa_pin: 'Weka PIN ya M-Pesa',
    confirm_payment: 'Thibitisha Malipo',
    payment_success: 'Malipo Yamefanikiwa',
    payment_failed: 'Malipo Yameshindikana',
    transaction_id: 'Kitambulisho cha Muamala',
    amount: 'Kiasi',
    
    // Time
    now: 'Sasa',
    minutes: 'dakika',
    hours: 'masaa',
    days: 'siku',
    today: 'Leo',
    yesterday: 'Jana',
    this_week: 'Wiki Hii',
    this_month: 'Mwezi Huu',
    
    // Errors
    connection_error: 'Hitilafu ya Muunganisho',
    try_again: 'Jaribu Tena',
    offline_message: 'Huna mtandao. Baadhi ya huduma hazipatikani.',
    
    // Success Messages
    reservation_success: 'Kiti kimehifadhiwa!',
    report_submitted: 'Ripoti imewasilishwa!',
    location_updated: 'Mahali pamebadilishwa!',
    trip_started: 'Safari imeanza!',
    trip_ended: 'Safari imemalizika!',
    
    // Kenyan Specific
    matatu: 'Matatu',
    sacco: 'SACCO',
    stage: 'Kituo',
    route: 'Njia',
    nairobi: 'Nairobi',
    cbd: 'Kituo cha Biashara',
    githurai: 'Githurai',
    kasarani: 'Kasarani',
    westlands: 'Westlands',
    karen: 'Karen',
    rongai: 'Rongai',
    kitengela: 'Kitengela',
  }
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 
                         (navigator.language.startsWith('sw') ? 'sw' : 'en');
    setLanguage(savedLanguage);
  }, []);

  // Update direction based on language
  useEffect(() => {
    setDirection(language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const t = (key, params = {}) => {
    let translation = translations[language][key] || translations.en[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Show notification
    toast.success(lang === 'sw' ? 'Lugha imebadilishwa' : 'Language changed', {
      icon: lang === 'sw' ? '🇹🇿' : '🇺🇸',
    });
    
    // Dispatch event for other components to react
    window.dispatchEvent(new Event('languageChanged'));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'sw' ? 'sw-KE' : 'en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date, showSeconds = false) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      hour12: language === 'en' // 12-hour format for English, 24-hour for Swahili
    };
    
    return new Intl.DateTimeFormat(
      language === 'sw' ? 'sw-KE' : 'en-KE',
      options
    ).format(new Date(date));
  };

  const formatDate = (date, format = 'medium') => {
    const options = {
      weekday: 'short',
      day: 'numeric',
      month: format === 'short' ? 'short' : 'long',
      year: 'numeric'
    };
    
    return new Intl.DateTimeFormat(
      language === 'sw' ? 'sw-KE' : 'en-KE',
      options
    ).format(new Date(date));
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('now');
    if (diffInMinutes < 60) return `${diffInMinutes} ${t('minutes')}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${t('hours')}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t('days')}`;
  };

  const value = {
    language,
    t,
    switchLanguage,
    formatCurrency,
    formatTime,
    formatDate,
    formatRelativeTime,
    direction,
    isSwahili: language === 'sw'
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={direction} className="transition-all duration-300">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};