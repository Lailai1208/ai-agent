import { apiClient } from './client';
import { API_ENDPOINTS, AI_CHAT_TIMEOUT } from '@/lib/constants';
import type {
  BackendHealthResponse,
  AIModelResponse,
  AIModelRequest,
} from '@/types/api';

export const healthApi = {
  check: (): Promise<BackendHealthResponse> =>
    apiClient.get<BackendHealthResponse>(API_ENDPOINTS.HEALTH),
};

export const aiModelApi = {
  // 列出可用模型
  listModels: (): Promise<unknown> =>
    apiClient.get(API_ENDPOINTS.AI_MODELS_LIST),

  // 🆕 修改：為不同提供者創建聊天方法
  chatOllama: (request: AIModelRequest): Promise<AIModelResponse> => {
    // 🆕 詳細調試信息
    console.log('🤖 [Frontend] aiModelApi.chatOllama - Request Details:', {
      endpoint: API_ENDPOINTS.AI_OLLAMA_CHAT,
      request,
      requestType: typeof request,
      stringified: JSON.stringify(request),
    });
    return apiClient.post<AIModelResponse>(
      API_ENDPOINTS.AI_OLLAMA_CHAT,
      request,
      undefined,
      AI_CHAT_TIMEOUT,
    );
  },

  chatNvidia: (request: AIModelRequest): Promise<AIModelResponse> => {
    // 🆕 詳細調試信息
    console.log('🤖 [Frontend] aiModelApi.chatNvidia - Request Details:', {
      endpoint: API_ENDPOINTS.AI_NIM_CHAT,
      request,
      requestType: typeof request,
      stringified: JSON.stringify(request),
    });
    return apiClient.post<AIModelResponse>(
      API_ENDPOINTS.AI_NIM_CHAT,
      request,
      undefined,
      AI_CHAT_TIMEOUT,
    );
  },

  // 保留舊的 testConnection 方法以保持向後兼容
  testConnection: (request: AIModelRequest): Promise<AIModelResponse> =>
    apiClient.post<AIModelResponse>(API_ENDPOINTS.AI_OLLAMA_CHAT, request),

  // 獲取 AI 服務狀態
  getStatus: (): Promise<unknown> => apiClient.get(API_ENDPOINTS.AI_STATUS),
};

export const rootApi = {
  getInfo: (): Promise<unknown> => apiClient.get(API_ENDPOINTS.ROOT),
};

// 統一的 API 導出
export const backendApi = {
  health: healthApi,
  aiModel: aiModelApi,
  root: rootApi,
};
