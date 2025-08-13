# 環境設定筆記

記錄專案環境設定的關鍵步驟和常見問題解決方案。

## 專案初始化設定

### 前端環境 (Next.js)

**Node.js 版本**: 建議使用 Node.js 18+ 

**套件安裝**:
```bash
cd frontend-nextjs
npm install
```

**環境變數設定**:
```bash
# frontend-nextjs/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**常見問題**:
- 如果遇到 Mantine 樣式衝突，確認 `tailwind.config.ts` 中有設定 `preflight: false`

### 後端環境 (FastAPI)

**Python 版本**: Python 3.10+

**虛擬環境建立**:
```bash
cd backend
# 使用 uv (推薦)
uv venv
source .venv/bin/activate  # Linux/Mac
# 或
.venv\Scripts\activate     # Windows

# 或使用傳統方式
python -m venv .venv
source .venv/bin/activate
```

**依賴安裝**:
```bash
# 使用 uv (推薦)
uv pip install -r requirements.txt

# 或使用 pip
pip install -r requirements.txt
```

**環境變數設定**:
```bash
# backend/.env
NVIDIA_API_KEY=your_nvidia_api_key_here
OLLAMA_BASE_URL=http://localhost:11434
```

## 開發工具設定

### VS Code 擴展建議

**前端開發**:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer

**後端開發**:
- Python
- Pylance
- Python Docstring Generator

### Git Hooks (Husky)

專案已設定 Husky，會在 commit 前自動執行：
- ESLint 檢查
- Prettier 格式化
- TypeScript 型別檢查

## 常見問題解決

### 套件版本衝突
如果遇到套件版本衝突，嘗試清除 cache：
```bash
# 前端
rm -rf node_modules package-lock.json
npm install

# 後端
uv pip list  # 檢查已安裝套件
```

### 服務啟動問題
確認連接埠沒有被佔用：
```bash
# 檢查連接埠使用狀況
lsof -i :3000  # 前端
lsof -i :8000  # 後端
```

## 快速啟動命令

**完整專案啟動**:
```bash
# 在專案根目錄
./dev-start.sh
```

**個別服務啟動**:
```bash
# 前端
npm run dev:frontend

# 後端
npm run dev:backend
```
