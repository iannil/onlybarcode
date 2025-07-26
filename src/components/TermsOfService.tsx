import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import SEOHead from './SEOHead';
import { seoConfig, getAlternateLanguages } from '../config/seo';

const TermsOfService: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // SEO配置
  const seoData = seoConfig.pages.terms[i18n.language as keyof typeof seoConfig.pages.terms] || seoConfig.pages.terms.zh;
  const alternateLanguages = getAlternateLanguages();

  const handleBackToHome = () => {
    window.location.hash = '';
  };

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        alternateLanguages={alternateLanguages}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">{t('back_to_home')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {t('terms_of_service_title')}
              </h1>
              <p className="text-slate-500 text-sm">
                {t('terms_of_service_last_updated')}
              </p>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 mb-8">
                {t('terms_of_service_intro')}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('terms_of_service_use')}
                </h2>
                <p className="text-slate-700">
                  {t('terms_of_service_use_desc')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('terms_of_service_liability')}
                </h2>
                <p className="text-slate-700">
                  {t('terms_of_service_liability_desc')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('terms_of_service_intellectual_property')}
                </h2>
                <p className="text-slate-700">
                  {t('terms_of_service_intellectual_property_desc')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('terms_of_service_changes')}
                </h2>
                <p className="text-slate-700">
                  {t('terms_of_service_changes_desc')}
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TermsOfService; 