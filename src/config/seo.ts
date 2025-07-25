export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  locale: string;
}

export const seoConfig = {
  defaultLanguage: 'zh',
  languages: {
    zh: {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      url: 'https://654653.com/',
      title: '654653 - 条形码生成器',
      description: '免费的在线条形码生成器和扫描器。支持多种条形码格式，包括Code128、EAN13、QR码等。快速生成、批量处理、PDF导出功能。',
      keywords: '条形码生成器,条形码扫描器,二维码生成器,在线条形码工具,批量条形码处理,PDF条形码,条码识别,条码制作',
      locale: 'zh_CN'
    } as LanguageConfig,
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      url: 'https://654653.com/en/',
      title: '654653 - Barcode Generator',
      description: 'Free online barcode generator and scanner. Supports multiple barcode formats including Code128, EAN13, QR codes. Fast generation, batch processing, PDF export.',
      keywords: 'barcode generator,barcode scanner,QR code generator,online barcode tool,batch barcode processing,PDF barcode,barcode recognition,barcode maker',
      locale: 'en_US'
    } as LanguageConfig
  },
  
  // 页面特定的SEO配置
  pages: {
    generate: {
      zh: {
        title: '条形码生成器 - 654653',
        description: '在线生成条形码，支持Code128、EAN13、QR码等多种格式。单个或批量生成，可导出PNG、SVG、PDF格式。',
        keywords: '条形码生成,条码制作,二维码生成,批量条码生成,条码导出'
      },
      en: {
        title: 'Barcode Generator - 654653',
        description: 'Generate barcodes online, supporting Code128, EAN13, QR codes and more formats. Single or batch generation, export to PNG, SVG, PDF formats.',
        keywords: 'barcode generation,barcode maker,QR code generator,batch barcode generation,barcode export'
      }
    },
    scan: {
      zh: {
        title: '条形码扫描器 - 654653',
        description: '在线扫描识别条形码，支持多种图片格式。批量处理，结果可导出CSV文件。',
        keywords: '条形码扫描,条码识别,二维码识别,批量扫描,条码识别工具'
      },
      en: {
        title: 'Barcode Scanner - 654653',
        description: 'Scan and recognize barcodes online, supporting multiple image formats. Batch processing, results can be exported as CSV files.',
        keywords: 'barcode scanner,barcode recognition,QR code recognition,batch scanning,barcode recognition tool'
      }
    },
    'qrcode-generate': {
      zh: {
        title: '二维码生成器 - 654653',
        description: '在线生成二维码，支持自定义尺寸、颜色、错误纠正级别。单个或批量生成，可导出PNG、PDF格式。',
        keywords: '二维码生成,QR码制作,批量二维码生成,二维码导出,二维码设置'
      },
      en: {
        title: 'QR Code Generator - 654653',
        description: 'Generate QR codes online with customizable size, color, and error correction level. Single or batch generation, export to PNG, PDF formats.',
        keywords: 'QR code generator,QR code maker,batch QR code generation,QR code export,QR code settings'
      }
    },
    'qrcode-scan': {
      zh: {
        title: '二维码扫描器 - 654653',
        description: '在线扫描识别二维码，支持多种图片格式。批量处理，结果可导出CSV文件。',
        keywords: '二维码扫描,QR码识别,批量二维码扫描,二维码识别工具'
      },
      en: {
        title: 'QR Code Scanner - 654653',
        description: 'Scan and recognize QR codes online, supporting multiple image formats. Batch processing, results can be exported as CSV files.',
        keywords: 'QR code scanner,QR code recognition,batch QR code scanning,QR code recognition tool'
      }
    }
  },
  
  // 结构化数据配置
  structuredData: {
    applicationName: '654653',
    applicationCategory: '工具软件',
    operatingSystem: 'Web Browser',
    price: '0',
    priceCurrency: 'CNY',
    features: {
      zh: ['条形码生成', '条形码扫描', '批量处理', 'PDF导出', '多种格式支持'],
      en: ['Barcode Generation', 'Barcode Scanning', 'Batch Processing', 'PDF Export', 'Multiple Format Support']
    }
  }
};

export const getSeoConfig = (language: string, page?: string) => {
  const langConfig = seoConfig.languages[language as keyof typeof seoConfig.languages] || seoConfig.languages.zh;
  
  if (page && seoConfig.pages[page as keyof typeof seoConfig.pages]) {
    const pageConfig = seoConfig.pages[page as keyof typeof seoConfig.pages];
    const pageLangConfig = pageConfig[language as keyof typeof pageConfig] || pageConfig.zh;
    
    return {
      ...langConfig,
      title: pageLangConfig.title,
      description: pageLangConfig.description,
      keywords: pageLangConfig.keywords
    };
  }
  
  return langConfig;
};

export const getAlternateLanguages = () => {
  return Object.values(seoConfig.languages).map(lang => ({
    lang: lang.code,
    url: lang.url
  }));
}; 