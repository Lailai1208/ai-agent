# 失敗分析與解決方案

記錄開發過程中遇到的問題、分析過程和解決方案，避免重複踩坑。

## 記錄格式

```markdown
## 問題: [簡短描述]
**日期**: YYYY-MM-DD
**影響範圍**: [前端/後端/全專案]

### 現象
具體描述遇到的問題現象。

### 根本原因
分析問題的根本原因。

### 解決方案
詳細的解決步驟。

### 預防措施
如何避免再次發生此問題。

---
```

## 問題記錄

## 問題: Mantine 與 Tailwind CSS 樣式衝突
**日期**: 2025-01-30
**影響範圍**: 前端

### 現象
- Mantine 元件的默認樣式被 Tailwind 的 reset CSS 覆蓋
- 按鈕、輸入框等元件顯示異常

### 根本原因
Tailwind CSS 的 `preflight` 功能會重置所有元素的默認樣式，與 Mantine 的元件樣式發生衝突。

### 解決方案
在 `tailwind.config.ts` 中停用 `preflight`：
```typescript
module.exports = {
  corePlugins: {
    preflight: false,
  },
  // ...其他設定
}
```

### 預防措施
- 在整合不同 CSS 框架前，先研究兼容性
- 建立樣式指南，明確定義使用場景

---

## 問題: CORS 錯誤阻止前後端通訊
**日期**: 2025-01-30
**影響範圍**: 全專案

### 現象
- 前端無法呼叫後端 API
- 瀏覽器控制台顯示 CORS 錯誤

### 根本原因
FastAPI 後端沒有正確設定 CORS 中間件，拒絕來自前端的跨域請求。

### 解決方案
在 FastAPI 應用中加入 CORS 中間件：
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 預防措施
- 在專案初期就設定好 CORS 政策
- 記錄所有允許的來源域名

---

<!-- 在此處加入新的問題記錄 -->
