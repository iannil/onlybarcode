import React, { useState, useEffect } from 'react';
import { Barcode, ScanEye, QrCode, Image, Focus, Settings, Menu, X } from 'lucide-react';
import BarcodeProcessor from './components/BatchProcessor';
import BarcodeScanner from './components/BarcodeScanner';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactUs from './components/ContactUs';
import SEOHead from './components/SEOHead';
import GoogleAnalytics from './components/GoogleAnalytics';
import { getSeoConfig, getAlternateLanguages } from './config/seo';
import { ANALYTICS_CONFIG, isAnalyticsEnabled } from './config/analytics';
import { useAnalytics } from './hooks/useAnalytics';
import './App.css';
import { useTranslation } from 'react-i18next';
import QrCodeGenerator from './components/QrCodeGenerator';
import QrCodeScanner from './components/QrCodeScanner';

type TabType = 'generate' | 'scan' | 'qrcode-generate' | 'qrcode-scan';
type ModeType = 'single' | 'batch';
type RouteType = 'home' | 'privacy' | 'terms' | 'contact';

function App() {
  const { t, i18n } = useTranslation();
  const { trackEvent, trackPageView } = useAnalytics();
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [mode, setMode] = useState<ModeType>('single');
  const [currentRoute, setCurrentRoute] = useState<RouteType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      let newRoute: RouteType = 'home';
      let newTab: TabType | null = null;
      let newMode: ModeType = 'single';
      switch (hash) {
        case 'privacy':
          newRoute = 'privacy';
          break;
        case 'terms':
          newRoute = 'terms';
          break;
        case 'contact':
          newRoute = 'contact';
          break;
        case 'generate-batch':
          newTab = 'generate';
          newMode = 'batch';
          newRoute = 'home';
          break;
        case 'qrcode-generate-batch':
          newTab = 'qrcode-generate';
          newMode = 'batch';
          newRoute = 'home';
          break;
        case 'generate':
        case 'scan':
        case 'qrcode-generate':
        case 'qrcode-scan':
          newTab = hash as TabType;
          newMode = 'single';
          newRoute = 'home';
          break;
        default:
          newRoute = 'home';
          break;
      }
      setCurrentRoute(newRoute);
      if (newTab) setActiveTab(newTab);
      setMode(newMode);
      trackPageView(window.location.pathname + window.location.hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [trackPageView]);

  const tabs = [
    { id: 'generate' as TabType, label: t('generate'), icon: Barcode, description: t('generate_desc') },
    { id: 'scan' as TabType, label: t('scan'), icon: ScanEye, description: t('scan_desc') },
    { id: 'qrcode-generate' as TabType, label: t('qrcode_generate', '二维码生成'), icon: QrCode, description: t('qrcode_generate_desc', '生成二维码') },
    { id: 'qrcode-scan' as TabType, label: t('qrcode_scan', '二维码识别'), icon: Focus, description: t('qrcode_scan_desc', '识别二维码') },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    trackEvent({
      action: 'language_change',
      category: 'navigation',
      label: lng,
    });
  };

  const seoConfig = getSeoConfig(i18n.language, activeTab);
  const alternateLanguages = getAlternateLanguages();

  return (
    <>
      {/* {isAnalyticsEnabled() && ( */}
        <GoogleAnalytics measurementId={ANALYTICS_CONFIG.MEASUREMENT_ID} />
      {/* )} */}
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        url={window.location.href}
        alternateLanguages={alternateLanguages}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header with Navigation */}
      {currentRoute === 'home' && (
        <header className="bg-white/80 border-b border-slate-200 sticky top-0 z-50" role="banner">
          <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo and Title */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center cursor-pointer" aria-hidden="true" onClick={() => { setActiveTab('generate'); window.location.hash = 'generate'; }}>
                  <Barcode className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block cursor-pointer" onClick={() => { setActiveTab('generate'); window.location.hash = 'generate'; }}>
                  <h1 className="text-base font-semibold text-slate-900 leading-none">{t('title')}</h1>
                  <p className="text-[10px] text-slate-400 leading-none">{t('slogan')}</p>
                </div>
                <div className="sm:hidden cursor-pointer" onClick={() => { setActiveTab('generate'); window.location.hash = 'generate'; }}>
                  <h1 className="text-base font-semibold text-slate-900 leading-none">{t('title')}</h1>
                </div>
              </div>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label={t('main_navigation')}>
                <div className="flex gap-1" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMode('single');
                        window.location.hash = tab.id;
                        trackEvent({
                          action: 'tab_switch',
                          category: 'navigation',
                          label: tab.id,
                        });
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 border border-transparent ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-blue-600 bg-white'
                          : 'text-slate-600 hover:text-blue-600 hover:border-blue-200 bg-transparent'
                      }`}
                      title={tab.description}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`${tab.id}-panel`}
                    >
                      <tab.icon className="w-4 h-4" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
                <select
                  id="language-select"
                  className="ml-2 text-xs border border-gray-200 rounded px-1.5 py-0.5 text-slate-700 bg-white focus:outline-none"
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value)}
                  title={t('language')}
                  aria-label={t('language')}
                >
                  <option value="zh">{t('chinese')}</option>
                  <option value="en">{t('english')}</option>
                </select>
              </nav>
              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-1">
                <select
                  id="mobile-language-select"
                  className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-slate-700 bg-white focus:outline-none"
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value)}
                  title={t('language')}
                  aria-label={t('language')}
                >
                  <option value="zh">{t('chinese')}</option>
                  <option value="en">{t('english')}</option>
                </select>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1 rounded text-slate-600 hover:text-blue-600 focus:outline-none"
                  aria-label={mobileMenuOpen ? t('close_menu') : t('open_menu')}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-slate-200 py-2 mt-1">
                <div className="flex flex-col gap-1" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                        window.location.hash = tab.id;
                        trackEvent({
                          action: 'tab_switch',
                          category: 'navigation',
                          label: tab.id,
                        });
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors duration-150 border border-transparent ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-blue-600 bg-white'
                          : 'text-slate-600 hover:text-blue-600 hover:border-blue-200 bg-transparent'
                      }`}
                      title={tab.description}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`${tab.id}-panel`}
                    >
                      <tab.icon className="w-5 h-5" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" role="main">
        <div className="transition-all duration-300">
          {currentRoute === 'home' && (
            <>
              <section 
                id="generate-panel" 
                role="tabpanel" 
                aria-labelledby="generate-tab"
                className={activeTab === 'generate' ? 'block' : 'hidden'}
              >
                <BarcodeProcessor mode={mode} setMode={setMode} />
              </section>
              <section 
                id="scan-panel" 
                role="tabpanel" 
                aria-labelledby="scan-tab"
                className={activeTab === 'scan' ? 'block' : 'hidden'}
              >
                <BarcodeScanner />
              </section>
              {/* 预留二维码功能入口 */}
              <section
                id="qrcode-generate-panel"
                role="tabpanel"
                aria-labelledby="qrcode-generate-tab"
                className={activeTab === 'qrcode-generate' ? 'block' : 'hidden'}
              >
                <QrCodeGenerator mode={mode} setMode={setMode} />
              </section>
              <section
                id="qrcode-scan-panel"
                role="tabpanel"
                aria-labelledby="qrcode-scan-tab"
                className={activeTab === 'qrcode-scan' ? 'block' : 'hidden'}
              >
                <QrCodeScanner />
              </section>
            </>
          )}
          {currentRoute === 'privacy' && <PrivacyPolicy />}
          {currentRoute === 'terms' && <TermsOfService />}
          {currentRoute === 'contact' && <ContactUs />}
        </div>
      </main>

      {/* Footer */}
      {currentRoute === 'home' && (
        <footer className="bg-slate-50/50 border-t border-slate-200/50 mt-8 sm:mt-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; 2025 {t('footer')}</p>
            <nav className="mt-2" aria-label={t('footer_navigation')}>
              <ul className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs">
                <li><a href="#privacy" className="hover:text-slate-700">{t('privacy_policy')}</a></li>
                <li><a href="#terms" className="hover:text-slate-700">{t('terms_of_service')}</a></li>
                <li><a href="#contact" className="hover:text-slate-700">{t('contact_us')}</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
      )}
    </div>
    </>
  );
}

export default App;