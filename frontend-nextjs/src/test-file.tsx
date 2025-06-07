// 故意製造格式錯誤的檔案
import React from 'react'; // 缺少分號
import { useState } from 'react'; // 缺少空格

export function TestComponent() {
  // 多餘空格
  const [count, setCount] = useState(0); // 缺少空格

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
