// API 相關類型定義
export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'failed'
  | 'timeout';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface TestResult<T = unknown> {
  status: ConnectionStatus;
  data?: T;
  error?: string;
  timing?: number;
  timestamp?: string;
}

export interface BackendHealthResponse {
  status: string;
  message: string;
  timestamp: string;
  version: string;
  environment: string;
}

export interface AIModelResponse {
  response: string; // 來自後端的 ChatResponse.response
  model: string; // 來自後端的 ChatResponse.model
  timestamp: string; // 來自後端的 ChatResponse.timestamp
}

export interface ConnectionTestState {
  health: TestResult<BackendHealthResponse>;
  aiModel: TestResult<AIModelResponse>;
  rootInfo: TestResult<unknown>;
  overall: ConnectionStatus;
}

// 請求類型
export interface HealthCheckRequest {
  // 健康檢查通常不需要參數
  [key: string]: unknown;
}

export interface AIModelRequest {
  message: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface BackendError {
  detail: string;
  status_code: number;
  timestamp: string;
}
