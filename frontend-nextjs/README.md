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
