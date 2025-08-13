import { ANALYTICS_CONFIG } from '../config/analytics';

/**
 * Google Analytics 快速修复工具
 * 用于诊断和修复常见的Google Analytics问题
 */

export interface QuickFixResult {
  success: boolean;
  message: string;
  details: string[];
  nextSteps: string[];
}

/**
 * 运行快速修复检查
 */
export const runQuickFix = (): QuickFixResult => {
  const details: string[] = [];
  const nextSteps: string[] = [];
  let success = false;
  let message = '';

  try {
    // 1. 检查Measurement ID
    if (!ANALYTICS_CONFIG.MEASUREMENT_ID) {
      details.push('❌ 未配置Measurement ID');
      nextSteps.push('设置环境变量 VITE_GA_MEASUREMENT_ID');
      message = 'Measurement ID未配置';
    } else if (ANALYTICS_CONFIG.MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      details.push('❌ 使用占位符Measurement ID');
      nextSteps.push('替换为真实的Google Analytics 4 Measurement ID');
      message = 'Measurement ID需要更新';
    } else if (!/^G-[A-Z0-9]{10}$/.test(ANALYTICS_CONFIG.MEASUREMENT_ID)) {
      details.push('❌ Measurement ID格式错误');
      nextSteps.push('确保Measurement ID格式为 G-XXXXXXXXXX');
      message = 'Measurement ID格式错误';
    } else {
      details.push('✅ Measurement ID配置正确');
    }

    // 2. 检查环境
    if (!import.meta.env.PROD) {
      details.push('⚠️ 非生产环境 - Analytics可能不会工作');
      nextSteps.push('部署到生产环境以启用Analytics');
    } else {
      details.push('✅ 生产环境');
    }

    // 3. 检查gtag函数
    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        details.push('✅ gtag函数可用');
      } else {
        details.push('❌ gtag函数不可用');
        nextSteps.push('检查Google Analytics脚本是否正确加载');
      }

      // 4. 检查dataLayer
      if (Array.isArray(window.dataLayer)) {
        details.push(`✅ dataLayer存在，包含 ${window.dataLayer.length} 个事件`);
      } else {
        details.push('❌ dataLayer不存在');
        nextSteps.push('检查Google Analytics初始化');
      }

      // 5. 检查网络连接
      testNetworkConnectivity().then((accessible) => {
        if (accessible) {
          details.push('✅ Google Analytics域名可访问');
        } else {
          details.push('❌ Google Analytics域名被阻止');
          nextSteps.push('检查广告拦截器或防火墙设置');
        }
      });

      // 6. 检查广告拦截器
      if (isAdBlockerActive()) {
        details.push('⚠️ 检测到广告拦截器');
        nextSteps.push('禁用广告拦截器或将Google Analytics域名加入白名单');
      } else {
        details.push('✅ 未检测到广告拦截器');
      }

      // 7. 检查隐私设置
      if (isDoNotTrackEnabled()) {
        details.push('⚠️ 启用了"请勿跟踪"设置');
        nextSteps.push('检查浏览器隐私设置');
      } else {
        details.push('✅ 未启用"请勿跟踪"');
      }
    }

    // 判断整体状态
    const errorCount = details.filter(d => d.startsWith('❌')).length;
    const warningCount = details.filter(d => d.startsWith('⚠️')).length;

    if (errorCount === 0 && warningCount === 0) {
      success = true;
      message = '✅ Google Analytics配置正常';
    } else if (errorCount === 0) {
      success = true;
      message = '⚠️ Google Analytics基本正常，但有警告';
    } else {
      success = false;
      message = `❌ 发现 ${errorCount} 个错误需要修复`;
    }

  } catch (error) {
    success = false;
    message = '❌ 检查过程中发生错误';
    details.push(`错误: ${error}`);
  }

  return {
    success,
    message,
    details,
    nextSteps,
  };
};

/**
 * 测试网络连接
 */
const testNetworkConnectivity = async (): Promise<boolean> => {
  try {
    await fetch('https://www.google-analytics.com/collect', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * 检测广告拦截器
 */
const isAdBlockerActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // 检查常见的广告拦截器标识
  const adBlockerTests = [
    () => (window as Window & { adsbygoogle?: boolean }).adsbygoogle === false,
    () => !!(window as Window & { canRunAds?: boolean }).canRunAds === false,
    () => !!(window as Window & { google_adblock?: boolean }).google_adblock === true,
  ];

  return adBlockerTests.some(test => {
    try {
      return test();
    } catch {
      return false;
    }
  });
};

/**
 * 检查"请勿跟踪"设置
 */
const isDoNotTrackEnabled = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  return (
    (navigator as Navigator & { doNotTrack?: string }).doNotTrack === '1' ||
    (navigator as Navigator & { doNotTrack?: string }).doNotTrack === 'yes' ||
    (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack === '1'
  );
};

/**
 * 发送测试事件
 */
export const sendTestEvent = (): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('🧪 发送测试事件...');
    
    // 发送页面视图
    window.gtag('config', ANALYTICS_CONFIG.MEASUREMENT_ID, {
      page_title: 'Analytics Test',
      page_location: window.location.href,
    });
    
    // 发送自定义事件
    window.gtag('event', 'analytics_test', {
      event_category: 'diagnostics',
      event_label: 'quick_fix_test',
      value: 1,
    });
    
    console.log('✅ 测试事件已发送');
    console.log('📊 请检查Google Analytics实时报告');
  } else {
    console.error('❌ 无法发送测试事件 - gtag不可用');
  }
};

/**
 * 获取实时报告URL
 */
export const getRealTimeUrl = (): string => {
  const measurementId = ANALYTICS_CONFIG.MEASUREMENT_ID;
  return `https://analytics.google.com/analytics/web/#/p${measurementId}/realtime/intro`;
};

/**
 * 打印修复建议
 */
export const printFixSuggestions = (): void => {
  console.group('🔧 Google Analytics 修复建议');
  
  const result = runQuickFix();
  
  console.log(result.message);
  console.log('');
  
  console.group('📋 检查结果:');
  result.details.forEach(detail => console.log(detail));
  console.groupEnd();
  
  if (result.nextSteps.length > 0) {
    console.group('💡 下一步操作:');
    result.nextSteps.forEach((step, index) => {
      console.log(`${index + 1}. ${step}`);
    });
    console.groupEnd();
  }
  
  console.log('');
  console.log('🔗 实时报告:', getRealTimeUrl());
  console.log('🧪 运行测试:', 'sendTestEvent()');
  
  console.groupEnd();
};
