# React Hook 模式

收集專案中常用的 React Hook 模式。

## useLocalStorage Hook

**使用情境**: 需要將狀態持久化到 localStorage

**程式碼**:
```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

**說明**: 
- 提供 localStorage 的讀寫功能
- 包含錯誤處理
- 支援 TypeScript 泛型

**相關檔案**: `frontend-nextjs/src/hooks/useLocalStorage.ts`

## useConnectionTest Hook

**使用情境**: 測試後端 API 連線狀態

**程式碼**:
```typescript
// hooks/useConnectionTest.ts
import { useState } from 'react';

interface ConnectionResult {
  isConnected: boolean;
  response?: any;
  error?: string;
}

export function useConnectionTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConnectionResult | null>(null);

  const testConnection = async (endpoint: string) => {
    setIsLoading(true);
    try {
      // 連線測試邏輯
      const response = await fetch(endpoint);
      const data = await response.json();
      
      setResult({
        isConnected: response.ok,
        response: data
      });
    } catch (error) {
      setResult({
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { testConnection, isLoading, result };
}
```

**說明**: 
- 提供 API 連線測試功能
- 管理載入狀態和結果
- 統一的錯誤處理

**相關檔案**: `frontend-nextjs/src/hooks/useConnectionTest.ts`
