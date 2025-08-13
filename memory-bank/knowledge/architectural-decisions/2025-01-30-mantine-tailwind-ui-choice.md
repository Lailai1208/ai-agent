# ADR-001: 選擇 Mantine + Tailwind CSS 作為前端 UI 解決方案

**日期**: 2025-01-30
**狀態**: 已接受

## 背景

前端專案需要選擇 UI 框架，要求：
- 現代化的元件庫
- 與 TypeScript 良好整合
- 支援客製化樣式
- 開發效率高

## 選項

1. **Mantine + Tailwind CSS** (選擇)
2. Material-UI (MUI)
3. Ant Design
4. 純 Tailwind CSS

## 決策

選擇 **Mantine + Tailwind CSS** 的組合：

- **Mantine**: 提供豐富的現成元件，減少開發時間
- **Tailwind CSS**: 提供靈活的工具類別，便於快速客製化
- **整合方案**: 透過設定 `preflight: false` 避免樣式衝突

## 後果

### 正面影響
- 開發效率提升，元件豐富且文件完整
- 樣式客製化靈活，適合快速迭代
- TypeScript 支援良好

### 負面影響
- 學習成本：需要掌握兩套系統
- Bundle 大小可能較大
- 需要注意樣式衝突的配置

## 實作細節

在 `tailwind.config.ts` 中設定：
```typescript
module.exports = {
  corePlugins: {
    preflight: false, // 避免與 Mantine 樣式衝突
  },
  // ...其他設定
}
```
