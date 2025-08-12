# Google Analytics 配置说明

## 概述

本项目已配置 Google Analytics，并实现了智能的环境检测功能，确保在本地开发环境中不会触发分析事件。

## 功能特性

### 1. 环境检测

- **开发环境**: 自动禁用 Google Analytics
- **测试环境**: 启用 Google Analytics（用于测试）
- **生产环境**: 根据域名判断是否启用

### 2. 本地网络检测

在以下情况下，Google Analytics 将被自动禁用：

- `localhost`
- `127.0.0.1`
- `192.168.*` (本地网络)
- `10.*` (私有网络)
- `172.*` (私有网络)

### 3. 配置检查

- 检查 Measurement ID 是否有效
- 检查是否为默认的测试 ID (`G-891EFN0THT`)

## 配置方法

### 1. 设置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. 获取 Google Analytics Measurement ID

1. 登录 [Google Analytics](https://analytics.google.com/)
2. 创建新的数据流或选择现有数据流
3. 复制 Measurement ID（格式：G-XXXXXXXXXX）

## 使用方法

### 1. 在组件中使用

```tsx
import { useAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const { trackEvent, trackPageView } = useAnalytics();

  const handleClick = () => {
    trackEvent({
      action: 'button_click',
      category: 'user_interaction',
      label: 'submit_button',
    });
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

### 2. 预定义事件类型

```tsx
import { ANALYTICS_CONFIG } from './config/analytics';

// 使用预定义的事件名称
trackEvent({
  action: ANALYTICS_CONFIG.EVENTS.BARCODE_GENERATED,
  category: ANALYTICS_CONFIG.CATEGORIES.BARCODE,
  label: 'code128',
});
```

## 测试

### 运行测试

```bash
npm test
```

### 测试覆盖范围

- 配置结构验证
- 事件跟踪功能
- 页面浏览跟踪
- 错误处理
- 环境检测

## 开发调试

### 1. 检查分析状态

在浏览器控制台中，当 Google Analytics 被禁用时会显示：

```
Google Analytics disabled for localhost/development environment
```

### 2. 手动测试

在开发环境中，可以通过修改 `src/config/analytics.ts` 中的 `isAnalyticsEnabled` 函数来临时启用分析功能进行测试。

## 注意事项

1. **隐私保护**: 在本地开发环境中自动禁用分析，保护用户隐私
2. **性能优化**: 只在需要时加载 Google Analytics 脚本
3. **错误处理**: 所有分析调用都包含错误处理，不会影响应用正常运行
4. **测试友好**: 在测试环境中启用分析，确保测试覆盖完整

## 故障排除

### 1. 分析不工作

- 检查 Measurement ID 是否正确设置
- 确认环境变量名称正确 (`VITE_GA_MEASUREMENT_ID`)
- 检查是否在生产环境中运行

### 2. 开发环境中看到分析请求

- 确认当前域名是否为 localhost 或本地 IP
- 检查 `isAnalyticsEnabled()` 函数的返回值

### 3. 测试失败

- 确保测试环境中的 `import.meta.env.MODE` 设置为 `'test'`
- 检查 mock 配置是否正确
