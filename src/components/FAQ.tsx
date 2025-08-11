import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, HelpCircle, ArrowLeft } from 'lucide-react';
import SEOHead from './SEOHead';
import { seoConfig, getAlternateLanguages } from '../config/seo';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const FAQ: React.FC = () => {
  const { i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<string[]>([]);

  // SEO配置
  const seoData = seoConfig.pages.faq[i18n.language as keyof typeof seoConfig.pages.faq];
  const alternateLanguages = getAlternateLanguages();

  const categories: FAQCategory[] = [
    {
      id: 'general',
      name: i18n.language === 'zh' ? '通用问题' : 'General',
      icon: HelpCircle,
      description: i18n.language === 'zh' ? '关于工具的基本问题' : 'Basic questions about the tool'
    },
    {
      id: 'barcode',
      name: i18n.language === 'zh' ? '条形码相关' : 'Barcode',
      icon: HelpCircle,
      description: i18n.language === 'zh' ? '条形码生成和扫描问题' : 'Barcode generation and scanning questions'
    },
    {
      id: 'qrcode',
      name: i18n.language === 'zh' ? '二维码相关' : 'QR Code',
      icon: HelpCircle,
      description: i18n.language === 'zh' ? '二维码生成和扫描问题' : 'QR code generation and scanning questions'
    },
    {
      id: 'technical',
      name: i18n.language === 'zh' ? '技术问题' : 'Technical',
      icon: HelpCircle,
      description: i18n.language === 'zh' ? '技术支持和故障排除' : 'Technical support and troubleshooting'
    }
  ];

  const faqItems: FAQItem[] = [
    // 通用问题
    {
      id: 'faq1',
      question: i18n.language === 'zh' ? 'OnlyBarcode是免费的吗？' : 'Is OnlyBarcode free?',
      answer: i18n.language === 'zh' 
        ? '是的，OnlyBarcode完全免费使用。我们提供所有功能，包括条形码生成、二维码制作、扫描识别等，无需付费。'
        : 'Yes, OnlyBarcode is completely free to use. We provide all features including barcode generation, QR code creation, scanning recognition, etc., without any cost.',
      category: 'general'
    },
    {
      id: 'faq2',
      question: i18n.language === 'zh' ? '支持哪些语言？' : 'What languages are supported?',
      answer: i18n.language === 'zh' 
        ? '目前支持中文和英文两种语言。您可以在页面右上角切换语言。'
        : 'Currently supports Chinese and English. You can switch languages in the top right corner of the page.',
      category: 'general'
    },
    {
      id: 'faq3',
      question: i18n.language === 'zh' ? '我的数据安全吗？' : 'Is my data secure?',
      answer: i18n.language === 'zh' 
        ? '是的，我们非常重视用户隐私和数据安全。所有处理都在您的浏览器本地进行，数据不会上传到我们的服务器。'
        : 'Yes, we take user privacy and data security very seriously. All processing is done locally in your browser, and data is not uploaded to our servers.',
      category: 'general'
    },
    {
      id: 'faq4',
      question: i18n.language === 'zh' ? '支持哪些文件格式？' : 'What file formats are supported?',
      answer: i18n.language === 'zh' 
        ? '支持多种格式：生成支持PNG、SVG、PDF；扫描支持JPG、PNG、WEBP、GIF；数据转换支持CSV、JSON、XML。'
        : 'Supports multiple formats: Generation supports PNG, SVG, PDF; Scanning supports JPG, PNG, WEBP, GIF; Data conversion supports CSV, JSON, XML.',
      category: 'general'
    },

    // 条形码相关
    {
      id: 'faq5',
      question: i18n.language === 'zh' ? '支持哪些条形码格式？' : 'What barcode formats are supported?',
      answer: i18n.language === 'zh' 
        ? '支持Code128、EAN13、EAN8、CODE39、ITF14、MSI、Pharmacode、Codabar等多种格式。'
        : 'Supports multiple formats including Code128, EAN13, EAN8, CODE39, ITF14, MSI, Pharmacode, Codabar.',
      category: 'barcode'
    },
    {
      id: 'faq6',
      question: i18n.language === 'zh' ? 'EAN13条码需要多少位数字？' : 'How many digits does EAN13 barcode need?',
      answer: i18n.language === 'zh' 
        ? 'EAN13条码需要13位数字，其中最后一位是校验位。如果您输入12位数字，系统会自动计算校验位。'
        : 'EAN13 barcode requires 13 digits, with the last digit being a check digit. If you enter 12 digits, the system will automatically calculate the check digit.',
      category: 'barcode'
    },
    {
      id: 'faq7',
      question: i18n.language === 'zh' ? '批量生成最多支持多少个条码？' : 'How many barcodes can be generated in batch?',
      answer: i18n.language === 'zh' 
        ? '批量生成最多支持1000个条码。如果超过这个数量，建议分批处理。'
        : 'Batch generation supports up to 1000 barcodes. If exceeding this number, it\'s recommended to process in batches.',
      category: 'barcode'
    },
    {
      id: 'faq8',
      question: i18n.language === 'zh' ? '为什么条码扫描失败？' : 'Why does barcode scanning fail?',
      answer: i18n.language === 'zh' 
        ? '可能的原因：1) 图片质量太低；2) 条码格式不支持；3) 条码损坏或不完整；4) 图片角度不正确。建议使用清晰的正面图片。'
        : 'Possible reasons: 1) Image quality too low; 2) Barcode format not supported; 3) Barcode damaged or incomplete; 4) Incorrect image angle. Use clear, front-facing images.',
      category: 'barcode'
    },

    // 二维码相关
    {
      id: 'faq9',
      question: i18n.language === 'zh' ? '二维码可以包含什么内容？' : 'What content can QR codes contain?',
      answer: i18n.language === 'zh' 
        ? '二维码可以包含文本、URL、电话号码、邮箱地址、WiFi信息、地理位置等多种内容。'
        : 'QR codes can contain text, URLs, phone numbers, email addresses, WiFi information, geographic locations, and more.',
      category: 'qrcode'
    },
    {
      id: 'faq10',
      question: i18n.language === 'zh' ? '错误纠正级别有什么区别？' : 'What\'s the difference between error correction levels?',
      answer: i18n.language === 'zh' 
        ? 'L级别可恢复7%数据，M级别可恢复15%，Q级别可恢复25%，H级别可恢复30%。级别越高，二维码越复杂但容错性越好。'
        : 'Level L can recover 7% of data, M can recover 15%, Q can recover 25%, H can recover 30%. Higher levels make QR codes more complex but more fault-tolerant.',
      category: 'qrcode'
    },
    {
      id: 'faq11',
      question: i18n.language === 'zh' ? '二维码尺寸建议是多少？' : 'What\'s the recommended QR code size?',
      answer: i18n.language === 'zh' 
        ? '建议尺寸200-400像素。打印用途建议300像素以上，屏幕显示200像素即可。'
        : 'Recommended size is 200-400 pixels. For printing, use 300+ pixels; for screen display, 200 pixels is sufficient.',
      category: 'qrcode'
    },
    {
      id: 'faq12',
      question: i18n.language === 'zh' ? '二维码扫描支持哪些格式？' : 'What formats does QR code scanning support?',
      answer: i18n.language === 'zh' 
        ? '支持JPG、PNG、GIF等常见图片格式。建议使用清晰的图片以获得最佳识别效果。'
        : 'Supports common image formats like JPG, PNG, GIF. Use clear images for best recognition results.',
      category: 'qrcode'
    },

    // 技术问题
    {
      id: 'faq13',
      question: i18n.language === 'zh' ? '浏览器兼容性如何？' : 'What\'s the browser compatibility?',
      answer: i18n.language === 'zh' 
        ? '支持所有现代浏览器：Chrome、Firefox、Safari、Edge等。需要JavaScript支持。'
        : 'Supports all modern browsers: Chrome, Firefox, Safari, Edge, etc. Requires JavaScript support.',
      category: 'technical'
    },
    {
      id: 'faq14',
      question: i18n.language === 'zh' ? '移动端使用体验如何？' : 'How\'s the mobile experience?',
      answer: i18n.language === 'zh' 
        ? '完全支持移动端，响应式设计适配各种屏幕尺寸。支持PWA安装，可离线使用部分功能。'
        : 'Fully supports mobile devices with responsive design for various screen sizes. Supports PWA installation with offline functionality.',
      category: 'technical'
    },
    {
      id: 'faq15',
      question: i18n.language === 'zh' ? '如何处理大文件？' : 'How to handle large files?',
      answer: i18n.language === 'zh' 
        ? '建议单个文件不超过10MB。对于大量文件，建议分批处理。系统会自动优化处理性能。'
        : 'Recommend single files not exceeding 10MB. For large numbers of files, process in batches. The system automatically optimizes processing performance.',
      category: 'technical'
    },
    {
      id: 'faq16',
      question: i18n.language === 'zh' ? '如何获得技术支持？' : 'How to get technical support?',
      answer: i18n.language === 'zh' 
        ? '您可以通过联系我们页面发送邮件，或查看使用教程页面获取详细的操作指南。'
        : 'You can send an email through the contact page, or check the tutorial page for detailed operation guides.',
      category: 'technical'
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBackToHome = () => {
    window.location.hash = '';
  };

  // FAQ结构化数据
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        alternateLanguages={alternateLanguages}
      />
      {/* FAQ结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
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
                <span className="text-sm">{i18n.language === 'zh' ? '返回首页' : 'Back to Home'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {i18n.language === 'zh' ? '常见问题解答' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg text-slate-600">
              {i18n.language === 'zh' 
                ? '在这里找到关于OnlyBarcode的常见问题解答。如果您的问题没有在这里找到答案，请随时联系我们。'
                : 'Find answers to frequently asked questions about OnlyBarcode here. If your question is not answered here, please feel free to contact us.'
              }
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <category.icon className="w-4 h-4 inline-block mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqItems
              .filter(item => item.category === activeCategory)
              .map(item => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-lg">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-start hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-2">{item.question}</h3>
                      {openItems.includes(item.id) && (
                        <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {openItems.includes(item.id) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>
                </div>
              ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {i18n.language === 'zh' ? '还有其他问题？' : 'Still have questions?'}
            </h2>
            <p className="text-slate-600 mb-4">
              {i18n.language === 'zh' 
                ? '如果您的问题没有在这里找到答案，请随时联系我们。我们很乐意为您提供帮助。'
                : 'If your question is not answered here, please feel free to contact us. We\'re happy to help.'
              }
            </p>
            <button
              onClick={() => { window.location.hash = 'contact'; }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {i18n.language === 'zh' ? '联系我们' : 'Contact Us'}
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default FAQ; 