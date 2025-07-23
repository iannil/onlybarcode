import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-slate-600">{t('loading')}</span>
    </div>
  );
};

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <DefaultFallback /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// 懒加载组件示例
export const LazyBarcodeProcessor = lazy(() => import('./BatchProcessor'));
export const LazyBarcodeScanner = lazy(() => import('./BarcodeScanner'));

export default LazyLoader; 