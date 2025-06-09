import { useState, useCallback, useRef } from 'react';
import {
  AIModelResponse,
  ConnectionStatus,
  TestResult,
  BackendHealthResponse,
  ConnectionTestState,
} from '@/types/api'; // Corrected import path
import { AiModelProviderValue } from '@/lib/constants'; // Corrected import path
import { BackendService } from '@/services/backendService';

const initialState: ConnectionTestState = {
  health: { status: 'idle' as ConnectionStatus },
  aiModel: { status: 'idle' as ConnectionStatus },
  rootInfo: { status: 'idle' as ConnectionStatus },
  overall: 'idle' as ConnectionStatus,
};

interface UseConnectionTestReturn {
  testConnection: (
    provider: AiModelProviderValue,
    modelId?: string,
  ) => Promise<void>;
  isLoading: boolean;
  result: AIModelResponse | null;
  error: Error | null;
  state: ConnectionTestState;
  testHealth: () => Promise<TestResult<BackendHealthResponse>>;
  testAIModel: (
    provider: AiModelProviderValue,
    message: string,
  ) => Promise<TestResult<AIModelResponse>>;
  testRootInfo: () => Promise<TestResult<unknown>>;
  runAllTests: (
    provider?: AiModelProviderValue,
    testMessage?: string,
  ) => Promise<void>;
  resetTests: () => void;
  isAnyLoading: boolean;
}

export const useConnectionTest = (): UseConnectionTestReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIModelResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<ConnectionTestState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateTestResult = useCallback(
    (
      key: keyof Omit<ConnectionTestState, 'overall'>,
      res: TestResult<unknown>,
    ) => {
      setState((prev) => {
        const newState = { ...prev, [key]: res };
        // 計算整體狀態
        const testResults = [
          newState.health,
          newState.aiModel,
          newState.rootInfo,
        ];
        let overallStatus: ConnectionStatus = 'idle';
        if (testResults.some((r) => r.status === 'connecting')) {
          overallStatus = 'connecting';
        } else if (testResults.every((r) => r.status === 'connected')) {
          overallStatus = 'connected';
        } else if (testResults.some((r) => r.status === 'failed')) {
          overallStatus = 'failed';
        } else if (testResults.some((r) => r.status === 'timeout')) {
          overallStatus = 'timeout';
        }
        return { ...newState, overall: overallStatus };
      });
    },
    [],
  );

  const testHealth = useCallback(async () => {
    updateTestResult('health', { status: 'connecting' });
    const res = await BackendService.checkHealth();
    updateTestResult('health', res);
    return res;
  }, [updateTestResult]);

  const testAIModel = useCallback(
    async (provider: AiModelProviderValue, message: string) => {
      updateTestResult('aiModel', { status: 'connecting' });
      const res = await BackendService.testAIModel(provider, message);
      updateTestResult('aiModel', res);
      setResult(res.data || null); // 更新主要結果狀態
      setError(res.error ? new Error(res.error) : null); // 更新主要錯誤狀態
      return res;
    },
    [updateTestResult],
  );

  const testRootInfo = useCallback(async () => {
    updateTestResult('rootInfo', { status: 'connecting' });
    const res = await BackendService.getRootInfo();
    updateTestResult('rootInfo', res);
    return res;
  }, [updateTestResult]);

  const testConnection = useCallback(
    async (provider: AiModelProviderValue, modelId?: string) => {
      setIsLoading(true);
      setResult(null);
      setError(null);
      try {
        // 如果 modelId 不是主要焦點，則默認使用測試消息
        // 根據 `testConnection` 的實際用途，這部分可能需要調整
        const messageForTest = modelId || 'Connection test';
        const res = await BackendService.testAIModel(provider, messageForTest);
        setResult(res.data || null);
        if (res.error) {
          setError(new Error(res.error));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const runAllTests = useCallback(
    async (
      provider: AiModelProviderValue = 'ollama',
      testMessage: string = 'Hello from frontend!',
    ) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        await testHealth();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await testRootInfo();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await testAIModel(provider, testMessage);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [testHealth, testRootInfo, testAIModel],
  );

  const resetTests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(initialState);
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const isAnyLoading =
    state.health.status === 'connecting' ||
    state.aiModel.status === 'connecting' ||
    state.rootInfo.status === 'connecting' ||
    isLoading; // 也考慮主要的 isLoading 標誌

  return {
    testConnection,
    isLoading,
    result,
    error,
    state,
    testHealth,
    testAIModel,
    testRootInfo,
    runAllTests,
    resetTests,
    isAnyLoading,
  };
};
