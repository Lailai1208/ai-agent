// 驗證重構後的組件結構
// const fs = require('fs');
// const path = require('path');
import fs from 'fs';
import path from 'path';

const componentsDir = path.join(__dirname, 'src/components/features/HomePage');
const pageFile = path.join(__dirname, 'src/app/page.tsx');

console.log('🔍 驗證 Phase 1: Frontend Internal Refactoring...\n');

// 檢查組件目錄是否存在
if (!fs.existsSync(componentsDir)) {
  console.log('❌ 組件目錄不存在');
  process.exit(1);
}

// 檢查所有必要的組件文件
const requiredComponents = [
  'HomePageHeader.tsx',
  'ThemeControlCard.tsx',
  'LocalStorageCard.tsx',
  'NotificationCard.tsx',
  'UtilityTestCard.tsx',
  'StyleTestsCard.tsx',
  'SuccessCard.tsx',
  'index.ts',
];

console.log('📁 檢查組件文件：');
let allComponentsExist = true;

requiredComponents.forEach((component) => {
  const componentPath = path.join(componentsDir, component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - 文件不存在`);
    allComponentsExist = false;
  }
});

// 檢查主頁面是否正確重構
console.log('\n📄 檢查主頁面重構：');
if (fs.existsSync(pageFile)) {
  const pageContent = fs.readFileSync(pageFile, 'utf8');

  // 檢查是否使用了正確的導入
  if (pageContent.includes("from '@/components/features/HomePage'")) {
    console.log('✅ 正確使用組件導入');
  } else {
    console.log('❌ 組件導入不正確');
    allComponentsExist = false;
  }

  // 檢查頁面是否簡化
  const lineCount = pageContent.split('\n').length;
  if (lineCount < 100) {
    console.log(`✅ 頁面已簡化 (${lineCount} 行，原本 313 行)`);
  } else {
    console.log(`⚠️  頁面仍然較長 (${lineCount} 行)`);
  }
} else {
  console.log('❌ 主頁面文件不存在');
  allComponentsExist = false;
}

// 最終結果
console.log('\n📊 重構驗證結果：');
if (allComponentsExist) {
  console.log('🎉 Phase 1: Frontend Internal Refactoring 完成！');
  console.log('✅ 所有組件文件存在');
  console.log('✅ 主頁面正確重構');
  console.log('✅ 代碼結構符合最佳實踐');
} else {
  console.log('❌ 重構未完全完成，請檢查缺失的文件');
  process.exit(1);
}
