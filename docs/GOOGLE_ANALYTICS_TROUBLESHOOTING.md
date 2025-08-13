# Google Analytics 故障排除指南

## 问题描述

Google Analytics 初始化成功但收不到数据

## 常见原因和解决方案

### 1. 环境问题

#### 问题：在本地环境运行

- **症状**：控制台显示 "Analytics disabled: running on local network"
- **原因**：Google Analytics 在 localhost 或本地网络环境下被禁用
- **解决方案**：
  - 部署到生产环境
  - 使用 ngrok 等工具创建公网可访问的 URL
  - 临时修改 `isAnalyticsEnabled()` 函数允许本地测试

#### 问题：非生产环境

- **症状**：控制台显示 "Analytics disabled: not in production environment"
- **原因**：代码检查 `import.meta.env.PROD` 为 false
- **解决方案**：
  - 确保在生产环境部署
  - 检查 Vite 配置中的环境变量

### 2. 配置问题

#### 问题：Measurement ID 无效

- **症状**：控制台显示 "Invalid Google Analytics Measurement ID"
- **原因**：使用了占位符 ID 或无效的 ID
- **解决方案**：
  - 在 Google Analytics 后台获取正确的 Measurement ID
  - 更新 `src/config/analytics.ts` 中的 `MEASUREMENT_ID`
  - 设置环境变量 `VITE_GA_MEASUREMENT_ID`

#### 问题：脚本加载失败

- **症状**：控制台显示 "Failed to load Google Analytics script"
- **原因**：网络问题或防火墙阻止
- **解决方案**：
  - 检查网络连接
  - 确认防火墙允许访问 `googletagmanager.com`
  - 检查 DNS 解析

### 3. 浏览器问题

#### 问题：广告拦截器

- **症状**：脚本加载但数据不发送
- **原因**：广告拦截器阻止 Google Analytics
- **解决方案**：
  - 禁用广告拦截器
  - 将 `analytics.google.com` 添加到白名单
  - 使用浏览器隐私模式测试

#### 问题：隐私设置

- **症状**：启用了 "Do Not Track"
- **原因**：浏览器隐私设置阻止跟踪
- **解决方案**：
  - 检查浏览器隐私设置
  - 禁用 "Do Not Track" 选项
  - 清除浏览器缓存和 Cookie

### 4. 代码问题

#### 问题：gtag 函数未定义

- **症状**：控制台显示 "gtag is not defined"
- **原因**：Google Analytics 脚本未正确加载
- **解决方案**：
  - 检查脚本加载顺序
  - 确保在 DOM 加载完成后初始化
  - 添加错误处理

#### 问题：重复初始化

- **症状**：多次加载 Google Analytics 脚本
- **原因**：组件重复渲染导致重复初始化
- **解决方案**：
  - 添加脚本存在性检查
  - 使用 useEffect 依赖项控制初始化

## 诊断步骤

### 1. 运行诊断工具

在开发环境中，点击页面右上角的 "🧪 Test GA" 按钮运行诊断：

```javascript
// 手动运行诊断
import { logAnalyticsDiagnostics, testAnalyticsTracking } from './utils/analyticsDiagnostics';

logAnalyticsDiagnostics();
testAnalyticsTracking();
```

### 2. 检查控制台输出

查看浏览器控制台的诊断信息：

```
🔍 Google Analytics Diagnostics
Enabled: true
Environment: production
Production: true
Hostname: yourdomain.com
Localhost: false
Measurement ID: G-XXXXXXXXXX
Valid Measurement ID: true
gtag Loaded: true
DataLayer Exists: true
Script Loaded: true
```

### 3. 验证 Google Analytics 设置

1. 登录 Google Analytics
2. 进入 "管理" > "数据流"
3. 确认 Measurement ID 正确
4. 检查数据流状态

### 4. 测试实时数据

1. 在 Google Analytics 中查看 "实时" 报告
2. 触发页面浏览或事件
3. 检查数据是否出现在实时报告中

## 调试技巧

### 1. 网络面板检查

1. 打开浏览器开发者工具
2. 切换到 "网络" 面板
3. 刷新页面
4. 查找对 `googletagmanager.com` 的请求
5. 检查请求是否成功（状态码 200）

### 2. 数据层检查

在浏览器控制台中运行：

```javascript
// 检查 dataLayer
console.log('DataLayer:', window.dataLayer);

// 检查 gtag 函数
console.log('gtag function:', typeof window.gtag);

// 手动发送测试事件
window.gtag('event', 'test_event', {
  event_category: 'test',
  event_label: 'manual_test'
});
```

### 3. 脚本检查

检查页面中是否存在 Google Analytics 脚本：

```javascript
// 检查脚本标签
const scripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
console.log('GA Scripts found:', scripts.length);
```

## 常见错误代码

| 错误信息 | 原因 | 解决方案 |
|---------|------|----------|
| "Analytics disabled: not in production environment" | 非生产环境 | 部署到生产环境 |
| "Analytics disabled: running on local network" | 本地网络 | 使用公网域名 |
| "Invalid Google Analytics Measurement ID" | ID 无效 | 更新正确的 Measurement ID |
| "Failed to load Google Analytics script" | 脚本加载失败 | 检查网络和防火墙 |
| "gtag is not defined" | 脚本未加载 | 检查脚本加载顺序 |

## 预防措施

### 1. 环境配置

- 使用环境变量管理 Measurement ID
- 在不同环境使用不同的配置
- 添加配置验证

### 2. 错误处理

- 添加脚本加载错误处理
- 实现降级方案
- 记录错误日志

### 3. 监控

- 定期检查数据收集状态
- 设置数据收集告警
- 监控脚本加载成功率

## 联系支持

如果问题仍然存在，请提供以下信息：

1. 诊断工具的输出结果
2. 浏览器控制台的错误信息
3. 网络面板的请求日志
4. 环境信息（域名、浏览器版本等）
5. Google Analytics 账户信息

## 相关文档

- [Google Analytics 4 设置指南](GOOGLE_ANALYTICS_SETUP.md)
- [SEO 优化指南](../seo/SEO_OPTIMIZATION.md)
- [测试指南](TESTING.md)
