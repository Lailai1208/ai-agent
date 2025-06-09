import { backendApi } from '@/lib/api/endpoints';
import { ApiError } from '@/lib/api/client';
import type {
  BackendHealthResponse,
  AIModelResponse,
  AIModelRequest,
  TestResult,
} from '@/types/api';
import type { AiModelProviderValue } from '@/lib/constants'; // 🆕 引入提供者類型

// 🆕 錯誤序列化輔助函數
function serializeError(error: unknown): string {
  if (error instanceof ApiError) {
    // 構建詳細的錯誤信息
    let errorMessage = error.message;

    if (error.status) {
      errorMessage += `\n狀態碼: ${error.status}`;
    }

    if (error.endpoint) {
      errorMessage += `\n端點: ${error.endpoint}`;
    }

    if (error.response) {
      try {
        const responseInfo =
          typeof error.response === 'string'
            ? error.response
            : JSON.stringify(error.response, null, 2);
        errorMessage += `\n響應詳情: ${responseInfo}`;
      } catch {
        errorMessage += `\n響應詳情: [無法序列化]`;
      }
    }

    return errorMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  // 處理其他類型的錯誤
  return typeof error === 'string' ? error : String(error);
}

export class BackendService {
  // 健康檢查
  static async checkHealth(): Promise<TestResult<BackendHealthResponse>> {
    const startTime = Date.now();

    try {
      const data = await backendApi.health.check();
      return {
        status: 'connected',
        data,
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'failed',
        error: serializeError(error),
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 🆕 修改：testAIModel 方法支持選擇提供者
  static async testAIModel(
    provider: AiModelProviderValue,
    message: string,
  ): Promise<TestResult<AIModelResponse>> {
    const startTime = Date.now();

    console.log(
      `🎯 [BackendService] testAIModel called - Provider: ${provider}, Message: ${message}`,
    );

    // 🛠️ 修復：構建完整的請求物件，匹配後端期望的格式
    let request: AIModelRequest;

    if (provider === 'nvidia') {
      request = {
        message,
        model: 'deepseek-ai/deepseek-r1', // 根據 curl 測試，使用此模型
        temperature: 0.7,
        max_tokens: 1000,
      };
    } else if (provider === 'ollama') {
      request = {
        message,
        // Ollama 可能不需要 model 參數，或者有不同的默認值
        temperature: 0.7,
        max_tokens: 1000,
      };
    } else {
      console.error(
        `[Frontend] BackendService.testAIModel - Unsupported provider: ${provider}`,
      );
      throw new Error(`不支援的 AI 模型提供者: ${provider}`);
    }

    console.log(
      `🚀 [BackendService] testAIModel - Complete request object:`,
      JSON.stringify(request, null, 2),
    );

    try {
      let data: AIModelResponse;
      switch (provider) {
        case 'ollama':
          console.log(`📞 [BackendService] Calling chatOllama with:`, request);
          data = await backendApi.aiModel.chatOllama(request);
          break;
        case 'nvidia':
          console.log(`📞 [BackendService] Calling chatNvidia with:`, request);
          data = await backendApi.aiModel.chatNvidia(request);
          break;
        default:
          console.error(
            `[Frontend] BackendService.testAIModel - Unsupported provider: ${provider}`,
          );
          throw new Error(`不支援的 AI 模型提供者: ${provider}`);
      }

      console.log(
        `✅ [BackendService] testAIModel success - Provider: ${provider}, Response:`,
        data,
      );

      return {
        status: 'connected',
        data,
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        `❌ [BackendService] testAIModel Error - Provider: ${provider}, Error:`,
        error,
      );

      return {
        status: 'failed',
        error: serializeError(error),
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Ollama 聊天
  static async chatWithOllama(
    message: string,
  ): Promise<TestResult<AIModelResponse>> {
    const startTime = Date.now();

    try {
      const request: AIModelRequest = { message };
      const data = await backendApi.aiModel.chatOllama(request);
      return {
        status: 'connected',
        data,
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'failed',
        error: serializeError(error),
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // NVIDIA NIM 聊天
  static async chatWithNIM(
    message: string,
  ): Promise<TestResult<AIModelResponse>> {
    const startTime = Date.now();

    try {
      // 🛠️ 修復：為 NVIDIA NIM 構建完整的請求物件
      const request: AIModelRequest = {
        message,
        model: 'deepseek-ai/deepseek-r1',
        temperature: 0.7,
        max_tokens: 1000,
      };
      const data = await backendApi.aiModel.chatNvidia(request);
      return {
        status: 'connected',
        data,
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'failed',
        error: serializeError(error),
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 獲取根信息
  static async getRootInfo(): Promise<TestResult<unknown>> {
    const startTime = Date.now();

    try {
      const data = await backendApi.root.getInfo();
      return {
        status: 'connected',
        data,
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'failed',
        error: serializeError(error),
        timing: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 連接測試
  static async testConnection(): Promise<boolean> {
    try {
      const result = await this.checkHealth();
      return result.status === 'connected';
    } catch {
      return false;
    }
  }
}
