# 测试指南

本项目使用 Vitest 作为测试框架，配合 React Testing Library 进行组件测试。

## 安装依赖

```bash
npm install
```

## 运行测试

### 开发模式（监听模式）

```bash
npm run test
```

### 运行所有测试

```bash
npm run test:run
```

### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

### 使用UI界面运行测试

```bash
npm run test:ui
```

## 测试文件结构

```
src/
├── utils/
│   ├── __tests__/
│   │   ├── csvJson.test.ts      # CSV-JSON转换工具测试
│   │   └── jsonXml.test.ts      # JSON-XML转换工具测试
├── components/
│   ├── __tests__/
│   │   ├── DataConverter.test.tsx  # 数据转换器组件测试
│   │   └── ContactUs.test.tsx      # 联系页面组件测试
└── test/
    ├── vitest.setup.ts          # 测试环境设置
    └── types.d.ts               # 测试类型声明
```

## 测试规范

### 工具函数测试

- 测试所有公共函数
- 包含正常情况和边界情况
- 测试错误处理

### 组件测试

- 测试组件渲染
- 测试用户交互
- 测试状态变化
- 使用 `data-testid` 属性进行元素选择

### 测试命名

- 使用中文描述测试用例
- 格式：`应该[预期行为]`
- 例如：`应该正确转换带表头的CSV`

## Git Hooks

项目配置了 Git hooks 来确保代码质量：

### Pre-commit Hook

在每次提交前自动运行：

- ESLint 检查
- 单元测试

### Pre-push Hook

在每次推送前自动运行：

- 完整的测试套件
- 如果测试失败，推送将被阻止

## 覆盖率要求

- 工具函数：> 90%
- 组件：> 80%
- 整体：> 85%

## 添加新测试

1. 在对应的 `__tests__` 目录下创建测试文件
2. 使用 `.test.ts` 或 `.test.tsx` 扩展名
3. 导入必要的测试工具和被测模块
4. 编写测试用例
5. 运行测试确保通过

## 常见问题

### 测试环境设置

如果遇到测试环境相关错误，检查 `src/test/vitest.setup.ts` 文件中的 mock 设置。

### 组件测试

对于需要 i18n 的组件，使用 `renderWithI18n` 辅助函数：

```typescript
const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}
```

### Mock 外部依赖

使用 `vi.mock()` 来 mock 外部依赖：

```typescript
vi.mock('lucide-react', () => ({
  FileText: () => <span>FileText</span>
}))
```
