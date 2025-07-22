import React, { useState } from 'react';
import { Package, FileText, Settings } from 'lucide-react';
import BarcodeProcessor from './components/BatchProcessor';
import BarcodeScanner from './components/BarcodeScanner';
import './App.css';

type TabType = 'generate' | 'scan';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('generate');

  const tabs = [
    { id: 'generate' as TabType, label: '条形码生成', icon: Package, description: '单个或批量生成条形码' },
    { id: 'scan' as TabType, label: '条形码识别', icon: FileText, description: '从图片中识别条形码' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">条形码处理中心</h1>
                <p className="text-sm text-gray-600">专业的条形码生成与识别工具</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Settings className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
        {/* Tab Description */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="transition-all duration-300">
          {activeTab === 'generate' && <BarcodeProcessor />}
          {activeTab === 'scan' && <BarcodeScanner />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 条形码处理中心. 专业、快速、可靠的条形码处理工具.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;