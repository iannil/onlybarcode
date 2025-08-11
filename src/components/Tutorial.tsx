import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, Download, Scan } from 'lucide-react';
import SEOHead from './SEOHead';
import { getAlternateLanguages } from '../config/seo';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
  image?: string;
  video?: string;
}

interface TutorialSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tutorials: TutorialStep[];
}

const Tutorial: React.FC = () => {
  const { i18n } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string>('barcode-generate');
  const [expandedTutorial, setExpandedTutorial] = useState<string>('');

  // SEO配置
  const seoData = {
    title: i18n.language === 'zh' ? '使用教程 - OnlyBarcode' : 'Tutorial - OnlyBarcode',
    description: i18n.language === 'zh' 
      ? '详细的条形码和二维码生成使用教程，包含步骤说明和操作指南。'
      : 'Detailed tutorials for barcode and QR code generation with step-by-step instructions.',
    keywords: i18n.language === 'zh' 
      ? '条形码教程,二维码教程,使用指南,操作说明,条码制作教程'
      : 'barcode tutorial,qr code tutorial,usage guide,operation manual,barcode making tutorial'
  };
  const alternateLanguages = getAlternateLanguages();

  const tutorialSections: TutorialSection[] = [
    {
      id: 'barcode-generate',
      title: i18n.language === 'zh' ? '条形码生成教程' : 'Barcode Generation Tutorial',
      description: i18n.language === 'zh' ? '学习如何生成各种格式的条形码' : 'Learn how to generate barcodes in various formats',
      icon: Download,
      tutorials: [
        {
          id: 'barcode-basic',
          title: i18n.language === 'zh' ? '基础条形码生成' : 'Basic Barcode Generation',
          description: i18n.language === 'zh' ? '快速生成简单的条形码' : 'Quickly generate simple barcodes',
          steps: [
            i18n.language === 'zh' ? '1. 打开条形码生成页面' : '1. Open the barcode generation page',
            i18n.language === 'zh' ? '2. 在文本框中输入要编码的内容' : '2. Enter the content to encode in the text box',
            i18n.language === 'zh' ? '3. 选择合适的条码格式（如Code128、EAN13等）' : '3. Select appropriate barcode format (e.g., Code128, EAN13)',
            i18n.language === 'zh' ? '4. 调整条码尺寸和颜色设置' : '4. Adjust barcode size and color settings',
            i18n.language === 'zh' ? '5. 点击生成按钮创建条码' : '5. Click the generate button to create the barcode',
            i18n.language === 'zh' ? '6. 下载PNG或SVG格式的条码图片' : '6. Download the barcode image in PNG or SVG format'
          ],
          tips: [
            i18n.language === 'zh' ? '• Code128格式支持字母、数字和特殊字符' : '• Code128 format supports letters, numbers, and special characters',
            i18n.language === 'zh' ? '• EAN13格式需要13位数字' : '• EAN13 format requires 13 digits',
            i18n.language === 'zh' ? '• 建议使用高对比度的颜色组合' : '• Use high contrast color combinations'
          ]
        },
        {
          id: 'barcode-batch',
          title: i18n.language === 'zh' ? '批量条形码生成' : 'Batch Barcode Generation',
          description: i18n.language === 'zh' ? '一次性生成多个条形码' : 'Generate multiple barcodes at once',
          steps: [
            i18n.language === 'zh' ? '1. 切换到批量生成模式' : '1. Switch to batch generation mode',
            i18n.language === 'zh' ? '2. 在文本框中输入多行内容，每行一个条码' : '2. Enter multiple lines of content in the text box, one barcode per line',
            i18n.language === 'zh' ? '3. 设置重复次数（如果需要多个相同条码）' : '3. Set repeat count (if multiple identical barcodes are needed)',
            i18n.language === 'zh' ? '4. 配置每行显示的条码数量' : '4. Configure the number of barcodes per row',
            i18n.language === 'zh' ? '5. 点击批量生成按钮' : '5. Click the batch generate button',
            i18n.language === 'zh' ? '6. 下载ZIP压缩包或PDF文件' : '6. Download ZIP archive or PDF file'
          ],
          tips: [
            i18n.language === 'zh' ? '• 支持最多1000个条码同时生成' : '• Supports up to 1000 barcodes generated simultaneously',
            i18n.language === 'zh' ? '• PDF导出支持自定义页面布局' : '• PDF export supports custom page layout',
            i18n.language === 'zh' ? '• 可以设置条码间距和边距' : '• Can set barcode spacing and margins'
          ]
        }
      ]
    },
    {
      id: 'qrcode-generate',
      title: i18n.language === 'zh' ? '二维码生成教程' : 'QR Code Generation Tutorial',
      description: i18n.language === 'zh' ? '学习如何生成自定义二维码' : 'Learn how to generate custom QR codes',
      icon: Download,
      tutorials: [
        {
          id: 'qrcode-basic',
          title: i18n.language === 'zh' ? '基础二维码生成' : 'Basic QR Code Generation',
          description: i18n.language === 'zh' ? '快速生成简单的二维码' : 'Quickly generate simple QR codes',
          steps: [
            i18n.language === 'zh' ? '1. 打开二维码生成页面' : '1. Open the QR code generation page',
            i18n.language === 'zh' ? '2. 输入要编码的文本、URL或数据' : '2. Enter the text, URL, or data to encode',
            i18n.language === 'zh' ? '3. 选择二维码尺寸（建议200-400像素）' : '3. Select QR code size (recommended 200-400 pixels)',
            i18n.language === 'zh' ? '4. 设置前景色和背景色' : '4. Set foreground and background colors',
            i18n.language === 'zh' ? '5. 选择错误纠正级别（L、M、Q、H）' : '5. Select error correction level (L, M, Q, H)',
            i18n.language === 'zh' ? '6. 点击生成按钮创建二维码' : '6. Click the generate button to create the QR code',
            i18n.language === 'zh' ? '7. 下载PNG格式的二维码图片' : '7. Download the QR code image in PNG format'
          ],
          tips: [
            i18n.language === 'zh' ? '• L级别：可恢复7%的数据，适合大尺寸二维码' : '• Level L: Can recover 7% of data, suitable for large QR codes',
            i18n.language === 'zh' ? '• H级别：可恢复30%的数据，适合小尺寸或打印' : '• Level H: Can recover 30% of data, suitable for small size or printing',
            i18n.language === 'zh' ? '• 避免使用红色和绿色组合（色盲友好）' : '• Avoid red and green combinations (colorblind-friendly)'
          ]
        },
        {
          id: 'qrcode-batch',
          title: i18n.language === 'zh' ? '批量二维码生成' : 'Batch QR Code Generation',
          description: i18n.language === 'zh' ? '一次性生成多个二维码' : 'Generate multiple QR codes at once',
          steps: [
            i18n.language === 'zh' ? '1. 切换到批量生成模式' : '1. Switch to batch generation mode',
            i18n.language === 'zh' ? '2. 输入多行内容，每行一个二维码' : '2. Enter multiple lines of content, one QR code per line',
            i18n.language === 'zh' ? '3. 设置二维码尺寸和颜色' : '3. Set QR code size and colors',
            i18n.language === 'zh' ? '4. 配置每行显示的二维码数量' : '4. Configure the number of QR codes per row',
            i18n.language === 'zh' ? '5. 选择是否所有二维码打印在一页' : '5. Choose whether to print all QR codes on one page',
            i18n.language === 'zh' ? '6. 点击批量生成按钮' : '6. Click the batch generate button',
            i18n.language === 'zh' ? '7. 下载ZIP压缩包或PDF文件' : '7. Download ZIP archive or PDF file'
          ],
          tips: [
            i18n.language === 'zh' ? '• 支持URL、文本、电话号码等多种内容类型' : '• Supports various content types: URLs, text, phone numbers',
            i18n.language === 'zh' ? '• 可以设置二维码间距和边距' : '• Can set QR code spacing and margins',
            i18n.language === 'zh' ? '• PDF导出支持自定义页面大小' : '• PDF export supports custom page sizes'
          ]
        }
      ]
    },
    {
      id: 'barcode-scan',
      title: i18n.language === 'zh' ? '条形码扫描教程' : 'Barcode Scanning Tutorial',
      description: i18n.language === 'zh' ? '学习如何扫描识别条形码' : 'Learn how to scan and recognize barcodes',
      icon: Scan,
      tutorials: [
        {
          id: 'scan-basic',
          title: i18n.language === 'zh' ? '基础条形码扫描' : 'Basic Barcode Scanning',
          description: i18n.language === 'zh' ? '快速扫描单个条形码' : 'Quickly scan a single barcode',
          steps: [
            i18n.language === 'zh' ? '1. 打开条形码扫描页面' : '1. Open the barcode scanning page',
            i18n.language === 'zh' ? '2. 点击上传区域或拖拽图片文件' : '2. Click the upload area or drag image files',
            i18n.language === 'zh' ? '3. 选择包含条形码的图片文件' : '3. Select image files containing barcodes',
            i18n.language === 'zh' ? '4. 系统自动识别条码格式和内容' : '4. System automatically recognizes barcode format and content',
            i18n.language === 'zh' ? '5. 查看识别结果和条码信息' : '5. View recognition results and barcode information',
            i18n.language === 'zh' ? '6. 复制条码内容到剪贴板' : '6. Copy barcode content to clipboard'
          ],
          tips: [
            i18n.language === 'zh' ? '• 支持JPG、PNG、WEBP等常见图片格式' : '• Supports common image formats: JPG, PNG, WEBP',
            i18n.language === 'zh' ? '• 图片清晰度越高，识别准确率越高' : '• Higher image clarity leads to better recognition accuracy',
            i18n.language === 'zh' ? '• 支持Code128、EAN13、UPC等多种格式' : '• Supports multiple formats: Code128, EAN13, UPC'
          ]
        },
        {
          id: 'scan-batch',
          title: i18n.language === 'zh' ? '批量条形码扫描' : 'Batch Barcode Scanning',
          description: i18n.language === 'zh' ? '一次性扫描多个条形码图片' : 'Scan multiple barcode images at once',
          steps: [
            i18n.language === 'zh' ? '1. 准备多个包含条形码的图片文件' : '1. Prepare multiple image files containing barcodes',
            i18n.language === 'zh' ? '2. 拖拽多个文件到上传区域' : '2. Drag multiple files to the upload area',
            i18n.language === 'zh' ? '3. 系统自动处理所有图片' : '3. System automatically processes all images',
            i18n.language === 'zh' ? '4. 查看每个文件的识别结果' : '4. View recognition results for each file',
            i18n.language === 'zh' ? '5. 导出结果为CSV文件' : '5. Export results as CSV file',
            i18n.language === 'zh' ? '6. 删除不需要的识别结果' : '6. Delete unwanted recognition results'
          ],
          tips: [
            i18n.language === 'zh' ? '• 支持同时处理最多50个图片文件' : '• Supports processing up to 50 image files simultaneously',
            i18n.language === 'zh' ? '• CSV导出包含文件名、条码内容、格式等信息' : '• CSV export includes filename, barcode content, format, etc.',
            i18n.language === 'zh' ? '• 可以单独删除失败的识别结果' : '• Can individually delete failed recognition results'
          ]
        }
      ]
    },
    {
      id: 'qrcode-scan',
      title: i18n.language === 'zh' ? '二维码扫描教程' : 'QR Code Scanning Tutorial',
      description: i18n.language === 'zh' ? '学习如何扫描识别二维码' : 'Learn how to scan and recognize QR codes',
      icon: Scan,
      tutorials: [
        {
          id: 'qrcode-scan-basic',
          title: i18n.language === 'zh' ? '基础二维码扫描' : 'Basic QR Code Scanning',
          description: i18n.language === 'zh' ? '快速扫描单个二维码' : 'Quickly scan a single QR code',
          steps: [
            i18n.language === 'zh' ? '1. 打开二维码扫描页面' : '1. Open the QR code scanning page',
            i18n.language === 'zh' ? '2. 上传包含二维码的图片文件' : '2. Upload image files containing QR codes',
            i18n.language === 'zh' ? '3. 系统自动识别二维码内容' : '3. System automatically recognizes QR code content',
            i18n.language === 'zh' ? '4. 查看识别结果和内容类型' : '4. View recognition results and content type',
            i18n.language === 'zh' ? '5. 复制二维码内容到剪贴板' : '5. Copy QR code content to clipboard',
            i18n.language === 'zh' ? '6. 如果是URL，可以直接点击访问' : '6. If it\'s a URL, you can click to visit directly'
          ],
          tips: [
            i18n.language === 'zh' ? '• 支持URL、文本、电话号码、邮箱等多种内容' : '• Supports various content: URLs, text, phone numbers, emails',
            i18n.language === 'zh' ? '• 支持JPG、PNG、GIF等图片格式' : '• Supports image formats: JPG, PNG, GIF',
            i18n.language === 'zh' ? '• 自动识别内容类型并格式化显示' : '• Automatically recognizes content type and formats display'
          ]
        }
      ]
    },

  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  const toggleTutorial = (tutorialId: string) => {
    setExpandedTutorial(expandedTutorial === tutorialId ? '' : tutorialId);
  };

  // HowTo结构化数据
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": i18n.language === 'zh' ? '如何使用OnlyBarcode生成条形码和二维码' : 'How to use OnlyBarcode to generate barcodes and QR codes',
    "description": i18n.language === 'zh' 
      ? '详细的条形码和二维码生成使用教程，包含步骤说明和操作指南。'
      : 'Detailed tutorials for barcode and QR code generation with step-by-step instructions.',
    "image": "https://onlybarcode.com/tutorial-image.png",
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "CNY",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": i18n.language === 'zh' ? '电脑或手机' : 'Computer or mobile device'
      },
      {
        "@type": "HowToSupply", 
        "name": i18n.language === 'zh' ? '网络连接' : 'Internet connection'
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "OnlyBarcode"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": i18n.language === 'zh' ? '打开工具网站' : 'Open the tool website',
        "text": i18n.language === 'zh' ? '访问onlybarcode.com网站' : 'Visit onlybarcode.com website',
        "url": "https://onlybarcode.com"
      },
      {
        "@type": "HowToStep",
        "name": i18n.language === 'zh' ? '选择功能' : 'Select function',
        "text": i18n.language === 'zh' ? '选择条形码生成或二维码生成功能' : 'Select barcode generation or QR code generation function'
      },
      {
        "@type": "HowToStep",
        "name": i18n.language === 'zh' ? '输入内容' : 'Enter content',
        "text": i18n.language === 'zh' ? '在文本框中输入要编码的内容' : 'Enter the content to encode in the text box'
      },
      {
        "@type": "HowToStep",
        "name": i18n.language === 'zh' ? '生成条码' : 'Generate barcode',
        "text": i18n.language === 'zh' ? '点击生成按钮创建条码' : 'Click the generate button to create the barcode'
      },
      {
        "@type": "HowToStep",
        "name": i18n.language === 'zh' ? '下载结果' : 'Download result',
        "text": i18n.language === 'zh' ? '下载生成的条码图片' : 'Download the generated barcode image'
      }
    ]
  };

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        alternateLanguages={alternateLanguages}
      />
      {/* HowTo结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToStructuredData)
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-slate-900">
                {i18n.language === 'zh' ? '使用教程' : 'Tutorial'}
              </h1>
              <button
                onClick={() => window.location.hash = ''}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {i18n.language === 'zh' ? '返回首页' : 'Back to Home'}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {i18n.language === 'zh' ? 'OnlyBarcode使用指南' : 'OnlyBarcode User Guide'}
            </h2>
            <p className="text-lg text-slate-600">
              {i18n.language === 'zh' 
                ? '详细的使用教程，帮助您快速掌握条形码和二维码的生成、扫描以及数据转换功能。'
                : 'Detailed tutorials to help you quickly master barcode and QR code generation, scanning, and data conversion features.'
              }
            </p>
          </div>

          {/* Tutorial Sections */}
          <div className="space-y-6">
            {tutorialSections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-slate-200">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                      <p className="text-sm text-slate-600">{section.description}</p>
                    </div>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {expandedSection === section.id && (
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {section.tutorials.map((tutorial) => (
                        <div key={tutorial.id} className="border border-slate-200 rounded-lg">
                          <button
                            onClick={() => toggleTutorial(tutorial.id)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-slate-900">{tutorial.title}</h4>
                              <p className="text-sm text-slate-600">{tutorial.description}</p>
                            </div>
                            {expandedTutorial === tutorial.id ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          {expandedTutorial === tutorial.id && (
                            <div className="px-4 pb-4">
                              <div className="space-y-4">
                                {/* Steps */}
                                <div>
                                  <h5 className="font-medium text-slate-900 mb-2">
                                    {i18n.language === 'zh' ? '操作步骤' : 'Steps'}
                                  </h5>
                                  <ol className="space-y-2">
                                    {tutorial.steps.map((step, index) => (
                                      <li key={index} className="text-sm text-slate-700 pl-4">
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>

                                {/* Tips */}
                                {tutorial.tips && tutorial.tips.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-slate-900 mb-2">
                                      {i18n.language === 'zh' ? '使用技巧' : 'Tips'}
                                    </h5>
                                    <ul className="space-y-1">
                                      {tutorial.tips.map((tip, index) => (
                                        <li key={index} className="text-sm text-slate-700 pl-4">
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {i18n.language === 'zh' ? '快速开始' : 'Quick Start'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => { window.location.hash = 'generate'; }}
                className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <Download className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-slate-900">
                  {i18n.language === 'zh' ? '生成条形码' : 'Generate Barcode'}
                </h4>
                <p className="text-sm text-slate-600">
                  {i18n.language === 'zh' ? '立即开始生成' : 'Start generating now'}
                </p>
              </button>

              <button
                onClick={() => { window.location.hash = 'qrcode-generate'; }}
                className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <Download className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-slate-900">
                  {i18n.language === 'zh' ? '生成二维码' : 'Generate QR Code'}
                </h4>
                <p className="text-sm text-slate-600">
                  {i18n.language === 'zh' ? '立即开始生成' : 'Start generating now'}
                </p>
              </button>

              <button
                onClick={() => { window.location.hash = 'scan'; }}
                className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <Scan className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-slate-900">
                  {i18n.language === 'zh' ? '扫描条形码' : 'Scan Barcode'}
                </h4>
                <p className="text-sm text-slate-600">
                  {i18n.language === 'zh' ? '立即开始扫描' : 'Start scanning now'}
                </p>
              </button>


            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Tutorial; 