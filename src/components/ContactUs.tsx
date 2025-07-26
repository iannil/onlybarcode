import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail } from 'lucide-react';
import SEOHead from './SEOHead';



const ContactUs: React.FC = () => {
  const { t } = useTranslation();

  const handleBackToHome = () => {
    window.location.hash = '';
  };

  return (
    <>
      <SEOHead 
        title={t('contact_us_title')}
        description={t('contact_us_intro')}
        keywords="contact, support, barcode tool"
        alternateLanguages={[
          { lang: 'en', url: '/contact' },
          { lang: 'zh', url: '/contact' }
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
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {t('contact_us_title')}
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto">
                {t('contact_us_intro')}
              </p>
            </div>
            <div className="text-center py-12">
              <p className="text-lg text-slate-700 font-medium">
                {t('contact_us_email_instruction')}
                <a 
                  href="mailto:hi@654653.com" 
                  className="text-blue-600 underline ml-2 hover:text-blue-800 transition-colors"
                  aria-label="Send email to hi@654653.com"
                >
                  hi@654653.com
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ContactUs; 