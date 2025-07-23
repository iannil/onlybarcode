import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  image = 'https://barhub.example.com/og-image.png',
  url = 'https://barhub.example.com/',
  type = 'website',
  alternateLanguages = [
    { lang: 'zh', url: 'https://barhub.example.com/' },
    { lang: 'en', url: 'https://barhub.example.com/en/' }
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
          description: description || '免费的在线条形码生成器和扫描器。支持多种条形码格式，包括Code128、EAN13、QR码等。快速生成、批量处理、PDF导出功能。',
          keywords: keywords || '条形码生成器,条形码扫描器,二维码生成器,在线条形码工具,批量条形码处理,PDF条形码,条码识别,条码制作',
          locale: 'zh_CN'
        };
      } else {
        return {
          description: description || 'Free online barcode generator and scanner. Supports multiple barcode formats including Code128, EAN13, QR codes. Fast generation, batch processing, PDF export.',
          keywords: keywords || 'barcode generator,barcode scanner,QR code generator,online barcode tool,batch barcode processing,PDF barcode,barcode recognition,barcode maker',
          locale: 'en_US'
        };
      }
    };

    const langContent = getLanguageSpecificContent();

    // 更新基本meta标签
    updateMetaTag('description', langContent.description);
    updateMetaTag('keywords', langContent.keywords);
    updateMetaTag('language', i18n.language === 'zh' ? 'zh-CN' : 'en-US');
    
    // 更新Open Graph标签
    updatePropertyTag('og:title', pageTitle);
    updatePropertyTag('og:description', langContent.description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', url);
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:locale', langContent.locale);
    
    // 更新Twitter Card标签
    updatePropertyTag('twitter:title', pageTitle);
    updatePropertyTag('twitter:description', langContent.description);
    updatePropertyTag('twitter:image', image);
    updatePropertyTag('twitter:url', url);
    
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
    xDefault.href = languages[0]?.url || 'https://barhub.example.com/';
    document.head.appendChild(xDefault);
  };

  return null;
};

export default SEOHead; 