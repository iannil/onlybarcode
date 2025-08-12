# Google Analytics 故障排除指南

## 常见问题及解决方案

### 1. Google Analytics 不工作

#### 问题描述

Google Analytics 没有收集数据，控制台显示 "Google Analytics disabled" 消息。

#### 可能原因

1. **环境变量未正确配置**
2. **运行在开发环境中**
3. **使用占位符 Measurement ID**
4. **网络连接问题**

#### 解决方案

##### 步骤 1: 检查环境变量

确保 `.env` 文件包含正确的 Measurement ID：

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**注意**: 将 `G-XXXXXXXXXX` 替换为您的真实 Google Analytics Measurement ID。

##### 步骤 2: 获取正确的 Measurement ID

1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择您的数据流
3. 复制 Measurement ID（格式：G-XXXXXXXXXX）

##### 步骤 3: 验证配置

在浏览器控制台中运行诊断：

```javascript
// 在浏览器控制台中运行
import('./src/utils/analyticsDiagnostics.js').then(module => {
  module.logAnalyticsDiagnostics();
});
```

### 2. 开发环境中测试 Google Analytics

#### 问题描述

需要在本地开发环境中测试 Google Analytics 功能。

#### 解决方案

##### 临时启用开发环境分析

修改 `src/config/analytics.ts` 中的 `isAnalyticsEnabled` 函数：

```typescript
export const isAnalyticsEnabled = (): boolean => {
  // 临时注释掉生产环境检查
  // if (!import.meta.env.PROD) {
  //   return false;
  // }
  
  // 其他检查保持不变...
  return true;
};
```

**注意**: 测试完成后记得恢复原配置。

### 3. 生产环境部署问题

#### 问题描述

在生产环境中 Google Analytics 仍然不工作。

#### 解决方案

##### 检查构建配置

确保生产构建使用正确的环境变量：

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

##### 检查域名

确保您的域名不在以下列表中：

- localhost
- 127.0.0.1
- 192.168.*
- 10.*
- 172.*

### 4. 数据收集延迟

#### 问题描述

Google Analytics 数据没有立即显示。

#### 解决方案

##### 检查实时数据

1. 在 Google Analytics 中查看"实时"报告
2. 确认数据是否正在收集

##### 验证脚本加载

在浏览器开发者工具中检查：

1. Network 标签页中是否有 Google Analytics 脚本请求
2. Console 中是否有相关错误信息

### 5. 隐私和合规问题

#### 问题描述

需要确保符合隐私法规。

#### 解决方案

##### 添加用户同意机制

```typescript
// 在用户同意后启用分析
const enableAnalytics = () => {
  // 设置用户同意标志
  localStorage.setItem('analytics_consent', 'true');
  // 重新初始化分析
  initializeAnalytics();
};
```

## 调试工具

### 1. 浏览器控制台诊断

在开发环境中，应用会自动运行诊断并输出到控制台。

### 2. 手动诊断

```javascript
// 在浏览器控制台中运行
console.log('Analytics Config:', {
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE
});
```

### 3. 网络请求检查

在浏览器开发者工具的 Network 标签页中：

1. 过滤 "gtag" 或 "google"
2. 检查是否有到 Google Analytics 的请求
3. 确认请求状态码为 200

## 最佳实践

### 1. 环境变量管理

- 使用 `.env.example` 作为模板
- 不要将真实的 Measurement ID 提交到版本控制
- 在生产环境中使用环境变量

### 2. 测试策略

- 在测试环境中启用分析
- 使用真实的 Measurement ID 进行测试
- 验证事件跟踪功能

### 3. 错误处理

- 所有分析调用都包含错误处理
- 分析错误不应影响应用正常运行
- 记录分析相关的错误信息

## 联系支持

如果问题仍然存在，请：

1. 检查浏览器控制台的错误信息
2. 运行诊断工具并记录结果
3. 提供环境信息和配置详情
