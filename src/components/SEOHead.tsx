import { useEffect } from 'react';
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

  useEffect(() => {
    // 更新页面标题
    const pageTitle = title || t('title');
    document.title = pageTitle;
    
    // 更新HTML lang属性
    document.documentElement.lang = i18n.language === 'zh' ? 'zh-CN' : 'en-US';
    
    // 更新meta标签
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

    // 语言特定的关键词和描述
    const getLanguageSpecificContent = () => {
      if (i18n.language === 'zh') {
        return {
          description: description || '免费的在线条形码和二维码生成器、扫描器。支持Code128、EAN13、QR码等多种格式。快速生成、批量处理、PDF导出功能。专业、快速、可靠的条码处理工具。',
          keywords: keywords || '条形码生成器,二维码生成器,条形码扫描器,二维码扫描器,在线条码工具,批量条码处理,PDF条码,条码识别,条码制作,QR码生成,条码工具,654653',
          locale: 'zh_CN',
          localeAlternate: 'en_US'
        };
      } else {
        return {
          description: description || 'Free online barcode and QR code generator and scanner. Supports multiple formats including Code128, EAN13, QR codes. Fast generation, batch processing, PDF export. Professional, fast, and reliable barcode processing tool.',
          keywords: keywords || 'barcode generator,QR code generator,barcode scanner,QR code scanner,online barcode tool,batch barcode processing,PDF barcode,barcode recognition,barcode maker,QR code maker,barcode tool,654653',
          locale: 'en_US',
          localeAlternate: 'zh_CN'
        };
      }
    };

    const langContent = getLanguageSpecificContent();

    // 更新基本meta标签
    updateMetaTag('description', langContent.description);
    updateMetaTag('keywords', langContent.keywords);
    updateMetaTag('language', i18n.language === 'zh' ? 'zh-CN' : 'en-US');
    updateMetaTag('author', '654653工具箱');
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('googlebot', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no');
    updateMetaTag('theme-color', '#3b82f6');
    updateMetaTag('msapplication-TileColor', '#3b82f6');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('apple-mobile-web-app-title', pageTitle);
    
    // 更新Open Graph标签
    updatePropertyTag('og:title', pageTitle);
    updatePropertyTag('og:description', langContent.description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', url);
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:locale', langContent.locale);
    updatePropertyTag('og:locale:alternate', langContent.localeAlternate);
    updatePropertyTag('og:site_name', i18n.language === 'zh' ? '654653工具箱' : '654653 Toolbox');
    updatePropertyTag('og:image:width', '1200');
    updatePropertyTag('og:image:height', '630');
    updatePropertyTag('og:image:type', 'image/png');
    
    // 更新Twitter Card标签
    updatePropertyTag('twitter:card', 'summary_large_image');
    updatePropertyTag('twitter:title', pageTitle);
    updatePropertyTag('twitter:description', langContent.description);
    updatePropertyTag('twitter:image', image);
    updatePropertyTag('twitter:url', url);
    updatePropertyTag('twitter:site', '@654653');
    updatePropertyTag('twitter:creator', '@654653');
    
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

  }, [title, description, keywords, image, url, type, t, i18n.language, alternateLanguages]);

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

  const addStructuredData = () => {
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
  };

  return null;
};

export default SEOHead; 