# BarHub - 条形码生成器 | Barcode Generator

A modern, multilingual barcode generator and scanner web application built with React, TypeScript, and Tailwind CSS.

## Features

- 🏷️ **Barcode Generation**: Support for multiple formats (Code128, EAN13, EAN8, Code39, etc.)
- 📱 **Barcode Scanning**: Upload and scan barcode images
- 📦 **Batch Processing**: Generate multiple barcodes at once
- 📄 **PDF Export**: Export barcodes to PDF format
- 🌍 **Multilingual**: Chinese and English support
- 📊 **Google Analytics**: Track user interactions and usage
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast**: Built with Vite for optimal performance

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd barhub
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Google Analytics Setup

This project includes Google Analytics 4 (GA4) integration. See [GOOGLE_ANALYTICS_SETUP.md](./GOOGLE_ANALYTICS_SETUP.md) for detailed setup instructions.

### Quick Setup

1. Create a Google Analytics 4 property
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Create a `.env` file in the root directory:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── BarcodeScanner.tsx
│   ├── BatchProcessor.tsx
│   ├── GoogleAnalytics.tsx
│   └── ...
├── config/             # Configuration files
│   ├── analytics.ts    # Google Analytics config
│   └── seo.ts         # SEO configuration
├── hooks/              # Custom React hooks
│   └── useAnalytics.ts # Analytics tracking hook
└── ...
```

## Analytics Events

The application tracks the following events:

- **Page Views**: Automatic tracking of page navigation
- **Tab Switches**: When users switch between Generate and Scan tabs
- **Language Changes**: When users change the language
- **Barcode Generation**: Successful barcode creation
- **Barcode Scanning**: Successful barcode recognition
- **File Downloads**: PNG/SVG downloads
- **PDF Exports**: Batch PDF generation
- **Batch Processing**: Multiple barcode generation
- **Errors**: Failed operations

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **JsBarcode** - Barcode generation
- **@zxing/library** - Barcode scanning
- **i18next** - Internationalization
- **Google Analytics 4** - Analytics tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.
