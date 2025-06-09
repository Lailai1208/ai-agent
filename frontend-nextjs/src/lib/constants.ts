// src/lib/constants.ts
export const APP_NAME = 'My Side Project of AIagents for Next.js';
export const APP_DESCRIPTION =
  'A Next.js side project with Mantine and Tailwind CSS';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Backend API Configuration
export const BACKEND_API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  BACKEND_BASE: BACKEND_API_BASE,
  HEALTH: '/api/v1/health/',
  // 使用正確的後端端點路徑
  AI_MODELS_LIST: '/api/v1/ai/models',
  AI_OLLAMA_CHAT: '/api/v1/ai/chat/ollama',
  AI_NIM_CHAT: '/api/v1/ai/chat/nvidia',
  AI_STATUS: '/api/v1/ai/status',
  ROOT: '/',
} as const;

export const API_TIMEOUT = 60000; // 60 seconds - 增加給 AI 模型響應時間
export const AI_CHAT_TIMEOUT = 120000; // 120 seconds - AI 聊天專用超時時間
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

export const CONNECTION_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  FAILED: 'failed',
  TIMEOUT: 'timeout',
} as const;

export const TEST_MESSAGES: string[] = [
  'Hello from Next.js frontend! 🚀',
  '前後端連接測試訊息',
  'Testing AI model integration',
  '測試中文回應能力',
];

// 🆕 新增：定義 AI 模型提供者選項
export const AI_MODEL_PROVIDERS = [
  { value: 'ollama', label: 'Ollama', endpointKey: 'AI_OLLAMA_CHAT' },
  { value: 'nvidia', label: 'NVIDIA NIM', endpointKey: 'AI_NIM_CHAT' },
] as const;

export type AiModelProviderValue = (typeof AI_MODEL_PROVIDERS)[number]['value'];

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;
