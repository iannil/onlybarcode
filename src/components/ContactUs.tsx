import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import SEOHead from './SEOHead';
import { seoConfig, getAlternateLanguages } from '../config/seo';

const ContactUs: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // SEO配置
  const seoData = seoConfig.pages.contact[i18n.language as keyof typeof seoConfig.pages.contact] || seoConfig.pages.contact.zh;
  const alternateLanguages = getAlternateLanguages();



  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        alternateLanguages={alternateLanguages}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
                  href="mailto:hi@onlybarcode.com" 
                  className="text-blue-600 underline ml-2 hover:text-blue-800 transition-colors"
                  aria-label="Send email to hi@onlybarcode.com"
                >
                  hi@onlybarcode.com
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