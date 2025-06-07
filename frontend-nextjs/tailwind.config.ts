// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 可以在這裡擴展 Tailwind 的主題
    },
  },
  plugins: [],
  // 重要：避免與 Mantine 的樣式衝突
  corePlugins: {
    preflight: false, // 禁用 Tailwind 的預設重置樣式
  },
} as Config;
export default config;
