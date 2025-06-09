# My Next.js Side Project

基於 Next.js 14、TypeScript、Mantine 和 Tailwind CSS 建立的現代化 web 應用程式。

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **UI 框架**: Mantine 7.x
- **樣式**: Tailwind CSS
- **狀態管理**: React Context + TanStack Query
- **程式碼規範**: ESLint + Prettier + Husky

## 開始使用

### 前置需求

- Node.js 20.x 或更高版本
- npm 或 yarn

### 安裝

```bash
# 複製專案
git clone <your-repo-url>
cd my-side-project

# 安裝依賴
npm install

# 設定環境變數
cp .env.example .env.local

# 啟動開發伺服器
npm run dev
```

### 可用腳本

```bash
npm run dev - 啟動開發伺服器
npm run build - 建立生產版本
npm run start - 啟動生產伺服器
npm run lint - 執行 ESLint 檢查
npm run format - 執行 Prettier 格式化
npm run type-check - 執行 TypeScript 類型檢查
```

## 🔧 API 整合與服務

### 核心組件架構

#### 1. **ApiClient (`src/lib/api/client.ts`)**

統一的 HTTP 請求處理中心，提供：

- 自動錯誤處理和重試機制
- 支援自定義超時時間
- Content-Type 自動設置
- 詳細的請求/響應日誌

```typescript
// 基本使用
const response = await apiClient.post<AIModelResponse>(
  '/api/v1/ai/chat/nvidia',
  requestData,
  headers,
  customTimeout,
);
```

#### 2. **API Endpoints (`src/lib/api/endpoints.ts`)**

集中化的 API 端點定義，包含：

- 類型安全的請求/響應處理
- AI 模型專用的長超時設置（120秒）
- 詳細的調試信息

```typescript
// AI 模型聊天端點
export const aiModelApi = {
  chatOllama: (request: AIModelRequest): Promise<AIModelResponse>,
  chatNvidia: (request: AIModelRequest): Promise<AIModelResponse>,
  getStatus: (): Promise<AIStatusResponse>
};
```

#### 3. **Backend Service (`src/services/backendService.ts`)**

高階業務邏輯封裝，負責：

- 統一的錯誤處理和狀態管理
- AI 模型請求參數標準化
- 跨組件的服務協調

### AI 模型整合規範

#### 請求格式標準

```typescript
// NVIDIA NIM 請求格式
interface NvidiaRequest {
  message: string;
  model: 'deepseek-ai/deepseek-r1';
  temperature: 0.7;
  max_tokens: 1000;
}

// Ollama 請求格式
interface OllamaRequest {
  message: string;
  temperature?: 0.7;
  max_tokens?: 1000;
}
```

#### 超時配置

```typescript
// src/lib/constants.ts
export const API_TIMEOUT = 60000; // 一般 API 請求: 60 秒
export const AI_CHAT_TIMEOUT = 120000; // AI 聊天請求: 120 秒
```

### 錯誤處理模式

```typescript
// 統一錯誤處理範例
try {
  const result = await BackendService.testAIModel(provider, message);
  // 處理成功響應
  setResult(result);
} catch (error) {
  if (error instanceof ApiError) {
    // 處理 API 錯誤（包含狀態碼和詳細信息）
    setError(error.message);
  } else {
    // 處理網絡錯誤
    setError('網絡連接失敗');
  }
}
```

### 類型安全

所有 API 請求/響應都有完整的 TypeScript 類型定義：

```typescript
// src/types/api.ts
export interface AIModelRequest {
  message: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AIModelResponse {
  response: string;
  model: string;
  timestamp: string;
}
```

### 整合測試策略

#### 使用 `useConnectionTest` Hook

```typescript
const { testAIModel, isLoading, error, result } = useConnectionTest();

// 測試 NVIDIA NIM
await testAIModel('nvidia', 'Hello AI!');

// 測試 Ollama
await testAIModel('ollama', 'Hello AI!');
```

#### 測試覆蓋範圍

- ✅ 多種 AI 模型提供者測試
- ✅ 網絡錯誤處理測試
- ✅ 超時處理測試
- ✅ 請求格式驗證測試
- ✅ 詳細的錯誤診斷信息

### 調試與監控

#### 前端調試工具

```typescript
// 開啟詳細日誌（開發環境）
console.log('🔍 API Request Debug:', {
  url,
  method,
  headers,
  body,
  bodyType,
});

console.log('✅ API Success Response:', {
  status,
  data,
});

console.log('❌ API Error Response:', {
  status,
  statusText,
  errorData,
  requestBody,
});
```

#### 常見問題診斷

1. **422 錯誤**: 檢查請求格式是否完整
2. **CORS 錯誤**: 確認後端 CORS 設定
3. **超時錯誤**: 檢查網絡連接和 API 回應時間
4. **類型錯誤**: 確認 TypeScript 類型定義正確

### 專案結構

```
frontend-nextjs/src/
├── app/                 # Next.js App Router 頁面
├── components/          # React 元件
│   ├── ui/             # 基礎 UI 元件
│   ├── common/         # 通用元件
│   └── forms/          # 表單元件
├── context/            # React Context
├── hooks/              # 自訂 Hooks
├── lib/                # 工具庫和常數
├── services/           # API 服務
├── types/              # TypeScript 類型定義
└── utils/              # 工具函式
```
