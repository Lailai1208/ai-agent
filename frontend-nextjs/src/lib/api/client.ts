import { API_ENDPOINTS, API_TIMEOUT } from '@/lib/constants';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown, // Changed from any to unknown
    public endpoint?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(
    baseURL: string = API_ENDPOINTS.BACKEND_BASE,
    timeout: number = API_TIMEOUT,
  ) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    customTimeout?: number,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // 使用自定義超時或默認超時
    const timeoutDuration = customTimeout || this.timeout;

    // 創建 AbortController 用於超時控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    // 🆕 確保 headers 正確合併，並且不會覆蓋重要的 Content-Type
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
    };

    // 如果有 body，則默認設置 Content-Type 為 application/json
    if (options.body) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers, // 選項 headers 在後面，允許覆蓋
      },
      signal: controller.signal,
    };

    // 🆕 調試：打印請求詳情
    console.log('🔍 API Request Debug:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body,
      bodyType: typeof config.body,
    });

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // 🆕 調試：打印錯誤回應
        console.log('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestBody: config.body,
        });

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // 處理 Pydantic 驗證錯誤
            errorMessage = (
              errorData.detail as { loc: string[]; msg: string }[]
            )
              .map(
                (
                  err, // Added type for err
                ) => `${err.loc?.join('.')} - ${err.msg}`,
              )
              .join('\n');
          } else {
            errorMessage = String(errorData.detail);
          }
        } else if ((errorData as { message?: string }).message) {
          // Added type assertion for errorData
          errorMessage = (errorData as { message?: string }).message!;
        }

        // 針對特定錯誤狀態的友好提示
        if (response.status === 422) {
          errorMessage += `\n\n💡 請求格式錯誤建議：\n• 檢查 JSON 格式是否正確\n• 確認請求參數類型匹配\n• 檢查是否有重複序列化問題`;
        } else if (response.status === 404) {
          errorMessage += `\n端點 ${endpoint} 不存在，請檢查 API 路徑是否正確`;
        } else if (response.status === 500) {
          errorMessage += `\n後端服務器內部錯誤，請檢查後端日誌`;
        } else if (response.status === 503) {
          errorMessage += `\n服務暫時不可用，請稍後再試`;
        }

        throw new ApiError(errorMessage, response.status, errorData, endpoint);
      }

      const responseData = await response.json();

      // 🆕 調試：打印成功回應
      console.log('✅ API Success Response:', {
        status: response.status,
        data: responseData,
      });

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      // 檢查 AbortError (fetch 被中止)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(
          `請求超時 (${timeoutDuration}ms)\n請檢查網絡連接或增加超時時間`,
          408,
          undefined,
          endpoint,
        );
      }

      // 檢查自定義 ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      // 檢查一般 Error
      if (error instanceof Error) {
        // 🆕 更友好的網絡錯誤提示
        let friendlyMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
          friendlyMessage = `網絡連接失敗\n可能原因：\n• 後端服務未啟動 (${this.baseURL})\n• 網絡連接問題\n• CORS 設定問題`;
        } else if (error.message.includes('ECONNREFUSED')) {
          friendlyMessage = `無法連接到後端服務\n請確認後端服務已啟動並運行在 ${this.baseURL}`;
        }

        throw new ApiError(friendlyMessage, undefined, undefined, endpoint);
      }

      // 處理未知類型錯誤
      throw new ApiError(
        `未知錯誤：${String(error)}\n請檢查網絡連接和後端服務狀態`,
        undefined,
        undefined,
        endpoint,
      );
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    data?: unknown, // Changed from any to unknown
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<T> {
    let body: string | undefined;

    if (data !== undefined) {
      // 🆕 確保只序列化一次，避免雙重序列化
      if (typeof data === 'string') {
        // 如果已經是字符串，直接使用
        body = data;
        console.warn(
          '📤 [Frontend] ApiClient.post - Data is already a string:',
          body,
        );
      } else {
        // 如果是物件，序列化為 JSON
        body = JSON.stringify(data);
        console.log(
          '📤 [Frontend] ApiClient.post - Object stringified to:',
          body,
        );
      }
    }

    // 🆕 明確設置 Content-Type 為 application/json
    const postHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers, // 用戶自定義 headers 放在後面，但不應該覆蓋 Content-Type
    };

    // 🆕 詳細調試信息
    console.log('📤 [Frontend] ApiClient.post - Request Details:', {
      endpoint,
      originalData: data,
      dataType: typeof data,
      serializedBody: body,
      bodyLength: body?.length,
      finalHeaders: postHeaders,
    });

    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        headers: postHeaders,
        body,
      },
      timeout,
    );
  }

  async put<T>(
    endpoint: string,
    data?: unknown, // Changed from any to unknown
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  // 檢查後端連接性
  async checkConnection(): Promise<boolean> {
    try {
      await this.get('/');
      return true;
    } catch {
      return false;
    }
  }
}

// 創建默認實例
export const apiClient = new ApiClient();
