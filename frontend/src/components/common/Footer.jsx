import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-kenyan-green to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Matatu<span className="text-green-400">Tracker</span>
                </h2>
                <p className="text-sm text-gray-400">
                  {language === 'sw' ? 'Ufuatiliaji wa Matatu' : 'Real-time Matatu Tracking'}
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              {language === 'sw' 
                ? 'Tunasaidia wakenya kupata matatu kwa urahisi na usalama.'
                : 'Helping Kenyans find matatus easily and safely.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quick_links') || 'Quick Links'}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-white transition-colors">
                  {t('routes') || 'Routes'}
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="text-gray-400 hover:text-white transition-colors">
                  {t('alerts')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'sw' ? 'Kuhusu Sisi' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Drivers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'sw' ? 'Kwa Madereva' : 'For Drivers'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/driver/login" className="text-gray-400 hover:text-white transition-colors">
                  {t('driver_login')}
                </Link>
              </li>
              <li>
                <Link to="/driver/register" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'sw' ? 'Jisajili kama Dereva' : 'Register as Driver'}
                </Link>
              </li>
              <li>
                <Link to="/driver/benefits" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'sw' ? 'Faida' : 'Benefits'}
                </Link>
              </li>
              <li>
                <Link to="/sacco" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'sw' ? 'SACCO' : 'SACCO Partners'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'sw' ? 'Mawasiliano' : 'Contact Info'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-green-400 mt-1" />
                <span className="text-gray-400">
                  Nairobi, Kenya
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-green-400" />
                <a href="tel:+254700000000" className="text-gray-400 hover:text-white">
                  +254 700 000 000
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-green-400" />
                <a href="mailto:info@matatutracker.co.ke" className="text-gray-400 hover:text-white">
                  info@matatutracker.co.ke
                </a>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">
                {language === 'sw' ? 'Tunasaidia Wakenya' : 'Serving Kenyans'}
              </h4>
              <p className="text-sm text-gray-400">
                {language === 'sw'
                  ? 'Tumeisaidia Nairobi na miji mingine ya Kenya'
                  : 'Serving Nairobi and other major Kenyan cities'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MatatuTracker. {
                language === 'sw'
                  ? 'Haki zote zimehifadhiwa.'
                  : 'All rights reserved.'
              }
            </p>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">
                {language === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy'}
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white">
                {language === 'sw' ? 'Masharti ya Matumizi' : 'Terms of Service'}
              </Link>
              <Link to="/safety" className="text-sm text-gray-400 hover:text-white">
                {language === 'sw' ? 'Usalama' : 'Safety'}
              </Link>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {language === 'sw'
                ? 'Imetengenezwa kwa ❤️ nchini Kenya'
                : 'Made with ❤️ in Kenya'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'sw'
                ? 'Tunatumia teknolojia ya hali ya juu kwa huduma bora'
                : 'Using cutting-edge technology for better service'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;