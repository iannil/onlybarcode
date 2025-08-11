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
      url: 'https://onlybarcode.com/',
      title: 'OnlyBarcode - 专业条形码和二维码生成器',
      description: '免费的在线条形码和二维码生成器、扫描器。支持Code128、EAN13、QR码等多种格式。快速生成、批量处理、PDF导出功能。专业、快速、可靠的条码处理工具。',
      keywords: '条形码生成器,二维码生成器,条形码扫描器,二维码扫描器,在线条码工具,批量条码处理,PDF条码,条码识别,条码制作,QR码生成,条码工具,onlybarcode',
      locale: 'zh_CN'
    } as LanguageConfig,
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      url: 'https://onlybarcode.com/en/',
      title: 'OnlyBarcode - Professional Barcode & QR Code Generator',
      description: 'Free online barcode and QR code generator and scanner. Supports multiple formats including Code128, EAN13, QR codes. Fast generation, batch processing, PDF export. Professional, fast, and reliable barcode processing tool.',
      keywords: 'barcode generator,QR code generator,barcode scanner,QR code scanner,online barcode tool,batch barcode processing,PDF barcode,barcode recognition,barcode maker,QR code maker,barcode tool,onlybarcode',
      locale: 'en_US'
    } as LanguageConfig
  },
  
  // 页面特定的SEO配置
  pages: {
    generate: {
      zh: {
        title: '条形码生成器 - 在线生成条形码 | OnlyBarcode',
        description: '在线生成条形码，支持Code128、EAN13、UPC等多种格式。单个或批量生成，可导出PNG、SVG、PDF格式。专业的条形码制作工具。',
        keywords: '条形码生成,条码制作,在线条码生成器,批量条码生成,条码导出,Code128,EAN13,UPC,条码工具'
      },
      en: {
        title: 'Barcode Generator - Generate Barcodes Online | OnlyBarcode',
        description: 'Generate barcodes online, supporting Code128, EAN13, UPC and more formats. Single or batch generation, export to PNG, SVG, PDF formats. Professional barcode creation tool.',
        keywords: 'barcode generation,barcode maker,online barcode generator,batch barcode generation,barcode export,Code128,EAN13,UPC,barcode tool'
      }
    },
    scan: {
      zh: {
        title: '条形码扫描器 - 在线识别条形码 | OnlyBarcode',
        description: '在线扫描识别条形码，支持JPG、PNG、WEBP等多种图片格式。批量处理，结果可导出CSV文件。快速准确的条码识别工具。',
        keywords: '条形码扫描,条码识别,在线条码扫描器,批量扫描,条码识别工具,条码读取,条码解码'
      },
      en: {
        title: 'Barcode Scanner - Scan Barcodes Online | OnlyBarcode',
        description: 'Scan and recognize barcodes online, supporting JPG, PNG, WEBP and other image formats. Batch processing, results can be exported as CSV files. Fast and accurate barcode recognition tool.',
        keywords: 'barcode scanner,barcode recognition,online barcode scanner,batch scanning,barcode recognition tool,barcode reader,barcode decoder'
      }
    },
    'qrcode-generate': {
      zh: {
        title: '二维码生成器 - 在线生成二维码 | OnlyBarcode',
        description: '在线生成二维码，支持自定义尺寸、颜色、错误纠正级别。单个或批量生成，可导出PNG、PDF格式。专业的二维码制作工具。',
        keywords: '二维码生成,QR码制作,在线二维码生成器,批量二维码生成,二维码导出,二维码设置,QR码工具'
      },
      en: {
        title: 'QR Code Generator - Generate QR Codes Online | OnlyBarcode',
        description: 'Generate QR codes online with customizable size, color, and error correction level. Single or batch generation, export to PNG, PDF formats. Professional QR code creation tool.',
        keywords: 'QR code generator,QR code maker,online QR code generator,batch QR code generation,QR code export,QR code settings,QR code tool'
      }
    },
    'qrcode-scan': {
      zh: {
        title: '二维码扫描器 - 在线识别二维码 | OnlyBarcode',
        description: '在线扫描识别二维码，支持JPG、PNG、GIF等多种图片格式。批量处理，结果可导出CSV文件。快速准确的二维码识别工具。',
        keywords: '二维码扫描,QR码识别,在线二维码扫描器,批量二维码扫描,二维码识别工具,QR码读取,QR码解码'
      },
      en: {
        title: 'QR Code Scanner - Scan QR Codes Online | OnlyBarcode',
        description: 'Scan and recognize QR codes online, supporting JPG, PNG, GIF and other image formats. Batch processing, results can be exported as CSV files. Fast and accurate QR code recognition tool.',
        keywords: 'QR code scanner,QR code recognition,online QR code scanner,batch QR code scanning,QR code recognition tool,QR code reader,QR code decoder'
      }
    },
    'batch-process': {
      zh: {
        title: '批量条码处理 - 批量生成条形码 | OnlyBarcode',
        description: '批量生成条形码，支持多种格式和自定义设置。可导出PNG、SVG、PDF格式，支持多行文本处理。高效的批量条码制作工具。',
        keywords: '批量条码生成,批量处理,条码批量制作,批量导出,条码工具,批量条码'
      },
      en: {
        title: 'Batch Barcode Processing - Generate Barcodes in Batch | OnlyBarcode',
        description: 'Generate barcodes in batch with multiple formats and custom settings. Export to PNG, SVG, PDF formats, support multi-line text processing. Efficient batch barcode creation tool.',
        keywords: 'batch barcode generation,batch processing,barcode batch maker,batch export,barcode tool,batch barcode'
      }
    },

    'contact': {
      zh: {
        title: '联系我们 - OnlyBarcode',
        description: '联系OnlyBarcode团队，获取技术支持、功能建议或合作机会。我们提供专业的技术支持和客户服务。',
        keywords: '联系我们,技术支持,客户服务,OnlyBarcode,联系团队'
      },
      en: {
        title: 'Contact Us - OnlyBarcode',
        description: 'Contact the OnlyBarcode team for technical support, feature suggestions, or partnership opportunities. We provide professional technical support and customer service.',
        keywords: 'contact us,technical support,customer service,OnlyBarcode,contact team'
      }
    },
    'privacy': {
      zh: {
        title: '隐私政策 - OnlyBarcode',
        description: 'OnlyBarcode隐私政策，详细说明我们如何收集、使用和保护您的个人信息。保护用户隐私是我们的首要任务。',
        keywords: '隐私政策,数据保护,个人信息,隐私保护,OnlyBarcode'
      },
      en: {
        title: 'Privacy Policy - OnlyBarcode',
        description: 'OnlyBarcode privacy policy detailing how we collect, use, and protect your personal information. Protecting user privacy is our top priority.',
        keywords: 'privacy policy,data protection,personal information,privacy protection,OnlyBarcode'
      }
    },
    'terms': {
      zh: {
        title: '服务条款 - OnlyBarcode',
        description: 'OnlyBarcode服务条款，明确用户使用我们服务的权利和义务。请仔细阅读并遵守相关条款。',
        keywords: '服务条款,使用条款,法律条款,OnlyBarcode,用户协议'
      },
      en: {
        title: 'Terms of Service - OnlyBarcode',
        description: 'OnlyBarcode terms of service clarifying user rights and obligations when using our services. Please read and comply with relevant terms.',
        keywords: 'terms of service,usage terms,legal terms,OnlyBarcode,user agreement'
      }
    },
    'tutorial': {
      zh: {
        title: '使用教程 - OnlyBarcode',
        description: '详细的条形码和二维码生成使用教程，包含步骤说明和操作指南。快速掌握条码制作和扫描技巧。',
        keywords: '条形码教程,二维码教程,使用指南,操作说明,条码制作教程,扫描教程,批量处理教程'
      },
      en: {
        title: 'Tutorial - OnlyBarcode',
        description: 'Detailed tutorials for barcode and QR code generation with step-by-step instructions. Quickly master barcode creation and scanning techniques.',
        keywords: 'barcode tutorial,qr code tutorial,usage guide,operation manual,barcode making tutorial,scanning tutorial,batch processing tutorial'
      }
    },
    'faq': {
      zh: {
        title: '常见问题 - OnlyBarcode',
        description: 'OnlyBarcode常见问题解答，包含条形码生成、二维码制作、扫描识别等功能的详细说明。',
        keywords: '常见问题,FAQ,问题解答,条形码问题,二维码问题,使用帮助'
      },
      en: {
        title: 'FAQ - OnlyBarcode',
        description: 'Frequently asked questions about OnlyBarcode, including detailed explanations of barcode generation, QR code creation, scanning recognition and other features.',
        keywords: 'frequently asked questions,FAQ,help,barcode questions,qr code questions,usage help'
      }
    }
  },
  
  // 结构化数据配置
  structuredData: {
    applicationName: 'OnlyBarcode',
    applicationCategory: '工具软件',
    operatingSystem: 'Web Browser',
    price: '0',
    priceCurrency: 'CNY',
    features: {
      zh: ['条形码生成', '二维码生成', '条形码扫描', '二维码扫描', '批量处理', 'PDF导出', '多种格式支持', '在线工具'],
      en: ['Barcode Generation', 'QR Code Generation', 'Barcode Scanning', 'QR Code Scanning', 'Batch Processing', 'PDF Export', 'Multiple Format Support', 'Online Tool']
    },
    // 添加更多结构化数据
    organization: {
      name: 'OnlyBarcode',
      url: 'https://onlybarcode.com',
      logo: 'https://onlybarcode.com/logo.png',
      sameAs: []
    },
    webSite: {
      name: 'OnlyBarcode',
      url: 'https://onlybarcode.com',
      description: {
        zh: '专业的在线条形码和二维码处理工具',
        en: 'Professional online barcode and QR code processing tool'
      }
    },
    webApplication: {
      name: 'OnlyBarcode',
      url: 'https://onlybarcode.com',
      description: {
        zh: '免费的在线条形码和二维码生成器、扫描器',
        en: 'Free online barcode and QR code generator and scanner'
      },
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      operatingSystem: 'Any',
      applicationCategory: 'UtilityApplication'
    }
  }
};

export const getSeoConfig = (language: string) => {
  const langConfig = seoConfig.languages[language as keyof typeof seoConfig.languages] || seoConfig.languages.zh;
  
  return langConfig;
};

export const getAlternateLanguages = () => {
  return Object.values(seoConfig.languages).map(lang => ({
    lang: lang.code,
    url: lang.url
  }));
};

// 生成结构化数据JSON-LD
export const generateStructuredData = (language: string) => {
  const isZh = language === 'zh';
  const baseUrl = isZh ? 'https://onlybarcode.com' : 'https://onlybarcode.com/en';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: isZh ? 'OnlyBarcode' : 'OnlyBarcode',
    url: baseUrl,
    description: isZh 
      ? '免费的在线条形码和二维码生成器、扫描器。支持多种格式，快速生成、批量处理。'
      : 'Free online barcode and QR code generator and scanner. Supports multiple formats, fast generation, batch processing.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY'
    },
    featureList: seoConfig.structuredData.features[language as keyof typeof seoConfig.structuredData.features] || seoConfig.structuredData.features.zh,
    author: {
      '@type': 'Organization',
      name: isZh ? 'OnlyBarcode' : 'OnlyBarcode',
      url: 'https://onlybarcode.com'
    }
  };

  return structuredData;
}; 