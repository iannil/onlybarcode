import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { generateStructuredData } from '../config/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  alternateLanguages?: Array<{
    lang: string;
    url: string;
  }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = 'https://654653.com/og-image.png',
  url = 'https://654653.com/',
  type = 'website',
  alternateLanguages = [
    { lang: 'zh', url: 'https://654653.com/' },
    { lang: 'en', url: 'https://654653.com/en/' }
  ]
}) => {
  const { t, i18n } = useTranslation();

  const addStructuredData = useCallback(() => {
    // 移除现有的结构化数据
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // 添加新的结构化数据
    const structuredData = generateStructuredData(i18n.language);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // 添加网站结构化数据
    const websiteData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: i18n.language === 'zh' ? '654653工具箱' : '654653 Toolbox',
      url: 'https://654653.com',
      description: i18n.language === 'zh' 
        ? '专业的在线条形码和二维码处理工具'
        : 'Professional online barcode and QR code processing tool',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://654653.com/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    };

    const websiteScript = document.createElement('script');
    websiteScript.type = 'application/ld+json';
    websiteScript.textContent = JSON.stringify(websiteData);
    document.head.appendChild(websiteScript);

    // 添加组织结构化数据
    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: i18n.language === 'zh' ? '654653工具箱' : '654653 Toolbox',
      url: 'https://654653.com',
      logo: 'https://654653.com/logo.png',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Chinese', 'English']
      }
    };

    const organizationScript = document.createElement('script');
    organizationScript.type = 'application/ld+json';
    organizationScript.textContent = JSON.stringify(organizationData);
    document.head.appendChild(organizationScript);
  }, [i18n.language]);

  useEffect(() => {
    // 更新页面标题
    document.title = title || (i18n.language === 'zh' ? '654653工具箱 - 专业的在线条形码和二维码处理工具' : '654653 Toolbox - Professional Online Barcode and QR Code Processing Tool');

    // Helper functions
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 更新meta标签
    updateMetaTag('description', description || (i18n.language === 'zh' ? '专业的在线条形码和二维码处理工具，支持多种格式转换和批量处理' : 'Professional online barcode and QR code processing tool with multiple format conversion and batch processing'));
    updateMetaTag('keywords', keywords || (i18n.language === 'zh' ? '条形码,二维码,条码生成,二维码生成,条码扫描,二维码扫描,条码转换,二维码转换' : 'barcode,qr code,barcode generator,qr code generator,barcode scanner,qr code scanner,barcode converter,qr code converter'));
    updateMetaTag('author', '654653 Toolbox');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // 更新Open Graph标签
    updatePropertyTag('og:title', title || (i18n.language === 'zh' ? '654653工具箱' : '654653 Toolbox'));
    updatePropertyTag('og:description', description || (i18n.language === 'zh' ? '专业的在线条形码和二维码处理工具' : 'Professional online barcode and QR code processing tool'));
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', url);
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:locale', i18n.language === 'zh' ? 'zh_CN' : 'en_US');
    updatePropertyTag('og:site_name', i18n.language === 'zh' ? '654653工具箱' : '654653 Toolbox');

    // 更新Twitter Card标签
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || (i18n.language === 'zh' ? '654653工具箱' : '654653 Toolbox'));
    updateMetaTag('twitter:description', description || (i18n.language === 'zh' ? '专业的在线条形码和二维码处理工具' : 'Professional online barcode and QR code processing tool'));
    updateMetaTag('twitter:image', image);

    // 更新canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // 更新hreflang标签
    updateHreflangTags(alternateLanguages);

    // 添加结构化数据
    addStructuredData();

  }, [title, description, keywords, image, url, type, t, i18n.language, alternateLanguages, addStructuredData]);

  const updateHreflangTags = (languages: Array<{ lang: string; url: string }>) => {
    // 移除现有的hreflang标签
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach(tag => tag.remove());

    // 添加新的hreflang标签
    languages.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = url;
      document.head.appendChild(link);
    });

    // 添加x-default hreflang
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = languages[0]?.url || 'https://654653.com/';
    document.head.appendChild(xDefault);
  };

  return null;
};

export default SEOHead; 