import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import SEOHead from './SEOHead';

const PrivacyPolicy: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleBackToHome = () => {
    window.location.hash = '';
  };

  return (
    <>
      <SEOHead 
        title={t('privacy_policy_title')}
        description={t('privacy_policy_intro')}
        keywords="privacy policy, data protection, barcode tool"
        alternateLanguages={[
          { lang: 'en', url: '/privacy' },
          { lang: 'zh', url: '/privacy' }
        ]}
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
                {t('privacy_policy_title')}
              </h1>
              <p className="text-slate-500 text-sm">
                {t('privacy_policy_last_updated')}
              </p>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 mb-8">
                {t('privacy_policy_intro')}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('privacy_policy_info_collection')}
                </h2>
                <p className="text-slate-700">
                  {t('privacy_policy_info_collection_desc')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('privacy_policy_data_usage')}
                </h2>
                <p className="text-slate-700">
                  {t('privacy_policy_data_usage_desc')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('privacy_policy_cookies')}
                </h2>
                <p className="text-slate-700">
                  {t('privacy_policy_cookies_desc')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('privacy_policy_third_party')}
                </h2>
                <p className="text-slate-700">
                  {t('privacy_policy_third_party_desc')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('privacy_policy_contact')}
                </h2>
                <p className="text-slate-700">
                  {t('privacy_policy_contact_desc')}
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicy; 