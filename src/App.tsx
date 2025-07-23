import React, { useState } from 'react';
import { Package, FileText, Settings } from 'lucide-react';
import BarcodeProcessor from './components/BatchProcessor';
import BarcodeScanner from './components/BarcodeScanner';
import './App.css';
import { useTranslation } from 'react-i18next';

type TabType = 'generate' | 'scan';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('generate');

  const tabs = [
    { id: 'generate' as TabType, label: t('generate'), icon: Package, description: t('generate_desc') },
    { id: 'scan' as TabType, label: t('scan'), icon: FileText, description: t('scan_desc') },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header with Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{t('title')}</h1>
                <p className="text-xs text-slate-500">{t('slogan')}</p>
              </div>
            </div>
            
            {/* Main Navigation */}
            <nav className="flex items-center space-x-1">
              <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                    title={tab.description}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="ml-4">
                <select
                  className="text-xs bg-transparent border-none outline-none text-slate-600 hover:text-slate-900 cursor-pointer"
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value)}
                  title={t('language')}
                >
                  <option value="zh">{t('chinese')}</option>
                  <option value="en">{t('english')}</option>
                </select>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="transition-all duration-300">
          {activeTab === 'generate' && <BarcodeProcessor />}
          {activeTab === 'scan' && <BarcodeScanner />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50/50 border-t border-slate-200/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; 2025 {t('footer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;