# 环境变量设置指南

## Google Analytics 配置

### 1. 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-你的真实Measurement ID

# 其他环境变量
VITE_APP_TITLE=OnlyBarcode
VITE_APP_DESCRIPTION=Free online barcode and QR code tools
```

### 2. 获取Google Analytics Measurement ID

1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择您的属性
3. 进入 **管理** > **数据流** > **网站**
4. 复制Measurement ID (格式: G-XXXXXXXXXX)

### 3. 验证配置

运行以下命令验证配置：

```bash
# 检查环境变量是否正确加载
npm run dev
```

在浏览器控制台中应该看到：

```
Loading Google Analytics with Measurement ID: G-你的ID
```

### 4. 生产环境部署

确保在生产环境中也设置了正确的环境变量：

#### Vercel

在Vercel项目设置中添加环境变量：

- `VITE_GA_MEASUREMENT_ID` = `G-你的ID`

#### Netlify

在Netlify项目设置中添加环境变量：

- `VITE_GA_MEASUREMENT_ID` = `G-你的ID`

#### 其他平台

根据您的部署平台，在环境变量设置中添加：

- `VITE_GA_MEASUREMENT_ID` = `G-你的ID`

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |
| `VITE_APP_TITLE` | 应用标题 | `OnlyBarcode` |
| `VITE_APP_DESCRIPTION` | 应用描述 | `Free online barcode and QR code tools` |

## 注意事项

1. **不要提交 `.env` 文件到版本控制**
   - 确保 `.env` 在 `.gitignore` 中
   - 使用 `.env.example` 作为模板

2. **Vite 环境变量前缀**
   - 只有以 `VITE_` 开头的变量才会暴露给客户端代码

3. **生产环境验证**
   - 部署后检查控制台日志
   - 验证Google Analytics是否正常工作

## 故障排除

### 环境变量未加载

```bash
# 检查 .env 文件是否存在
ls -la .env

# 重启开发服务器
npm run dev
```

### Measurement ID 错误

1. 确认ID格式正确 (G-XXXXXXXXXX)
2. 检查Google Analytics属性设置
3. 验证数据流配置

### 生产环境问题

1. 检查部署平台的环境变量设置
2. 重新部署应用
3. 清除浏览器缓存
