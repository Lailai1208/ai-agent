'use client';

import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Button,
  Group,
  Alert,
  Badge,
  TextInput,
  Stack,
  Divider,
  Grid,
  ActionIcon,
  Tooltip,
  SegmentedControl,
  Collapse,
  Code,
  Paper,
} from '@mantine/core';
// import {
//   IconApi,
//   IconServer,
//   IconRocket,
//   IconRefresh,
//   IconSettings,
//   IconActivity,
// } from '@tabler/icons-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { JsonViewer } from '@/components/ui/JsonViewer';
import { useConnectionTest } from '@/hooks/useConnectionTest';
import {
  TEST_MESSAGES,
  AI_MODEL_PROVIDERS,
  type AiModelProviderValue,
} from '@/lib/constants';

// 🆕 錯誤詳情組件
const ErrorDetails = ({
  error,
  timing,
}: {
  error?: string;
  timing?: number;
}) => {
  if (!error) return null;

  // 分析錯誤類型並提供建議
  const getErrorSuggestions = (errorMessage: string) => {
    const suggestions = [];

    if (
      errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('網絡連接失敗')
    ) {
      suggestions.push('• 檢查後端服務是否已啟動 (http://localhost:8000)');
      suggestions.push('• 檢查網絡連接是否正常');
      suggestions.push('• 檢查防火牆或代理設定');
    }

    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      suggestions.push('• API 端點路徑可能不正確');
      suggestions.push('• 後端路由配置可能有問題');
    }

    if (
      errorMessage.includes('500') ||
      errorMessage.includes('Internal Server Error')
    ) {
      suggestions.push('• 後端服務器內部錯誤');
      suggestions.push('• 檢查後端服務日誌');
      suggestions.push('• 檢查 AI 模型服務配置');
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('超時')) {
      suggestions.push('• AI 模型回應時間過長');
      suggestions.push('• 增加請求超時時間');
      suggestions.push('• 檢查 AI 服務性能');
    }

    if (errorMessage.includes('ollama')) {
      suggestions.push('• Ollama 服務未啟動 (預期端口: 11434)');
      suggestions.push('• 運行: ollama serve');
      suggestions.push('• 檢查 Ollama 模型是否已下載');
    }

    if (errorMessage.includes('nvidia') || errorMessage.includes('NIM')) {
      suggestions.push('• NVIDIA NIM API 金鑰未配置');
      suggestions.push('• 檢查環境變數 NIM_DEEPSEEK_R1_API');
      suggestions.push('• 驗證 API 金鑰是否有效');
    }

    return suggestions;
  };

  const suggestions = getErrorSuggestions(error);

  return (
    <Paper
      p="sm"
      bg="red.0"
      style={{ border: '1px solid var(--mantine-color-red-3)' }}
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" fw={500} c="red">
            ❌ 錯誤詳情
          </Text>
          {timing && (
            <Badge variant="light" color="red" size="sm">
              失敗於 {timing}ms
            </Badge>
          )}
        </Group>

        <Code
          block
          color="red"
          style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}
        >
          {error}
        </Code>

        {suggestions.length > 0 && (
          <Stack gap="xs">
            <Text size="xs" fw={500} c="dimmed">
              💡 解決建議：
            </Text>
            <div>
              {suggestions.map((suggestion, index) => (
                <Text
                  key={index}
                  size="xs"
                  c="dimmed"
                  style={{ marginLeft: '8px' }}
                >
                  {suggestion}
                </Text>
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export const BackendTestCard = () => {
  const [testMessage, setTestMessage] = useState<string>(
    TEST_MESSAGES[0] as string,
  );
  const [selectedProvider, setSelectedProvider] =
    useState<AiModelProviderValue>('ollama');
  const [showDetails, setShowDetails] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(true); // 🆕 錯誤詳情顯示控制

  const {
    state,
    testHealth,
    testAIModel,
    testRootInfo,
    runAllTests,
    resetTests,
    isAnyLoading,
  } = useConnectionTest();

  const handleQuickMessage = (message: string) => {
    setTestMessage(message);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {/* 標題區域 */}
      <Group justify="space-between" mb="md">
        <Group>
          <span className="text-2xl">🔗</span>
          <div>
            <Title order={3}>🔗 前後端連接測試</Title>
            <Text size="sm" c="dimmed">
              測試 Next.js 前端與 FastAPI 後端的連接狀況
            </Text>
          </div>
        </Group>

        <Group>
          <StatusBadge status={state.overall} />
          <Badge variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
            Phase 3
          </Badge>
        </Group>
      </Group>

      {/* 控制面板 */}
      <Stack gap="md" mb="lg">
        {/* AI 模型提供者選擇 */}
        <div>
          <Text size="sm" fw={500} mb="xs">
            🤖 AI 模型提供者
          </Text>
          <SegmentedControl
            value={selectedProvider}
            onChange={(value) =>
              setSelectedProvider(value as AiModelProviderValue)
            }
            data={AI_MODEL_PROVIDERS.map((provider) => ({
              value: provider.value,
              label: provider.label,
            }))}
            disabled={isAnyLoading}
            fullWidth
          />
          <Text size="xs" c="dimmed" mt="xs">
            選擇要測試的 AI 模型提供者平台
          </Text>
        </div>

        <TextInput
          label="AI 模型測試訊息"
          description="輸入要發送給 AI 模型的測試訊息"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="輸入測試訊息..."
          disabled={isAnyLoading}
        />

        {/* 快速訊息選擇 */}
        <Group gap="xs">
          <Text size="xs" c="dimmed">
            快速選擇：
          </Text>
          {TEST_MESSAGES.map((msg, index) => (
            <Button
              key={index}
              variant="light"
              size="xs"
              onClick={() => handleQuickMessage(msg)}
              disabled={isAnyLoading}
            >
              {msg.length > 20 ? `${msg.slice(0, 20)}...` : msg}
            </Button>
          ))}
        </Group>
      </Stack>

      {/* 測試按鈕 */}
      <Group mb="lg">
        <Button
          onClick={testHealth}
          loading={state.health.status === 'connecting'}
          disabled={isAnyLoading}
          leftSection={<span>🏥</span>}
          variant="light"
          color="green"
        >
          健康檢查
        </Button>

        <Button
          onClick={testRootInfo}
          loading={state.rootInfo.status === 'connecting'}
          disabled={isAnyLoading}
          leftSection={<span>📡</span>}
          variant="light"
          color="blue"
        >
          API 資訊
        </Button>

        <Button
          onClick={() => testAIModel(selectedProvider, testMessage)}
          loading={state.aiModel.status === 'connecting'}
          disabled={isAnyLoading || !testMessage.trim()}
          leftSection={<span>🚀</span>}
          variant="light"
          color="purple"
        >
          AI 模型測試 (
          {AI_MODEL_PROVIDERS.find((p) => p.value === selectedProvider)?.label})
        </Button>

        <Button
          onClick={() => runAllTests(selectedProvider, testMessage)}
          loading={isAnyLoading}
          leftSection={<span>🔗</span>}
          variant="gradient"
          gradient={{ from: 'blue', to: 'purple' }}
        >
          執行全部測試
        </Button>

        <Tooltip label="重置所有測試">
          <ActionIcon
            variant="light"
            color="gray"
            onClick={resetTests}
            disabled={isAnyLoading}
          >
            <span>🔄</span>
          </ActionIcon>
        </Tooltip>

        <Tooltip label={showDetails ? '隱藏詳細資訊' : '顯示詳細資訊'}>
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span>⚙️</span>
          </ActionIcon>
        </Tooltip>

        <Tooltip label={showErrorDetails ? '隱藏錯誤詳情' : '顯示錯誤詳情'}>
          <ActionIcon
            variant="light"
            color="orange"
            onClick={() => setShowErrorDetails(!showErrorDetails)}
          >
            <span>🐛</span>
          </ActionIcon>
        </Tooltip>
      </Group>

      <Divider mb="md" />

      {/* 測試結果網格 */}
      <Grid gutter="md">
        <Grid.Col span={4}>
          <Alert
            color={
              state.health.status === 'connected'
                ? 'green'
                : state.health.status === 'failed'
                  ? 'red'
                  : 'blue'
            }
            title={
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  🏥 健康檢查
                </Text>
                <StatusBadge
                  status={state.health.status}
                  timing={state.health.timing}
                />
              </Group>
            }
          >
            {state.health.status === 'connecting' && (
              <Text size="xs">正在檢查後端服務狀態...</Text>
            )}
            {state.health.status === 'connected' && (
              <Text size="xs" c="green">
                後端服務運行正常！
              </Text>
            )}
            {state.health.status === 'failed' && (
              <Stack gap="xs">
                <Text size="xs" c="red">
                  連接失敗
                </Text>
                <Collapse in={showErrorDetails}>
                  <ErrorDetails
                    error={state.health.error}
                    timing={state.health.timing}
                  />
                </Collapse>
              </Stack>
            )}

            {showDetails && state.health.data && (
              <JsonViewer data={state.health.data} maxRows={4} />
            )}
          </Alert>
        </Grid.Col>

        <Grid.Col span={4}>
          <Alert
            color={
              state.rootInfo.status === 'connected'
                ? 'green'
                : state.rootInfo.status === 'failed'
                  ? 'red'
                  : 'blue'
            }
            title={
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  📡 API 資訊
                </Text>
                <StatusBadge
                  status={state.rootInfo.status}
                  timing={state.rootInfo.timing}
                />
              </Group>
            }
          >
            {state.rootInfo.status === 'connecting' && (
              <Text size="xs">正在獲取 API 基本資訊...</Text>
            )}
            {state.rootInfo.status === 'connected' && (
              <Text size="xs" c="green">
                API 資訊獲取成功！
              </Text>
            )}
            {state.rootInfo.status === 'failed' && (
              <Stack gap="xs">
                <Text size="xs" c="red">
                  獲取失敗
                </Text>
                <Collapse in={showErrorDetails}>
                  <ErrorDetails
                    error={state.rootInfo.error}
                    timing={state.rootInfo.timing}
                  />
                </Collapse>
              </Stack>
            )}

            {showDetails && state.rootInfo.data && (
              <JsonViewer data={state.rootInfo.data} maxRows={4} />
            )}
          </Alert>
        </Grid.Col>

        <Grid.Col span={4}>
          <Alert
            color={
              state.aiModel.status === 'connected'
                ? 'green'
                : state.aiModel.status === 'failed'
                  ? 'red'
                  : 'blue'
            }
            title={
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  🤖 AI 模型 (
                  {
                    AI_MODEL_PROVIDERS.find((p) => p.value === selectedProvider)
                      ?.label
                  }
                  )
                </Text>
                <StatusBadge
                  status={state.aiModel.status}
                  timing={state.aiModel.timing}
                />
              </Group>
            }
          >
            {state.aiModel.status === 'connecting' && (
              <Text size="xs">
                正在測試{' '}
                {
                  AI_MODEL_PROVIDERS.find((p) => p.value === selectedProvider)
                    ?.label
                }{' '}
                模型回應...
              </Text>
            )}
            {state.aiModel.status === 'connected' && (
              <Stack gap="xs">
                <Text size="xs" c="green">
                  AI 模型回應正常！
                </Text>
                {state.aiModel.data?.response && (
                  <Paper
                    p="xs"
                    bg="green.0"
                    style={{ border: '1px solid var(--mantine-color-green-3)' }}
                  >
                    <Text size="xs" fw={500} c="green" mb="xs">
                      ✅ AI 回應：
                    </Text>
                    <Text size="xs" style={{ whiteSpace: 'pre-wrap' }}>
                      {state.aiModel.data.response.slice(0, 150)}
                      {state.aiModel.data.response.length > 150 ? '...' : ''}
                    </Text>
                  </Paper>
                )}
              </Stack>
            )}
            {state.aiModel.status === 'failed' && (
              <Stack gap="xs">
                <Text size="xs" c="red">
                  {selectedProvider === 'ollama' ? 'Ollama' : 'NVIDIA NIM'}{' '}
                  測試失敗
                </Text>
                <Collapse in={showErrorDetails}>
                  <ErrorDetails
                    error={state.aiModel.error}
                    timing={state.aiModel.timing}
                  />
                </Collapse>
              </Stack>
            )}

            {showDetails && state.aiModel.data && (
              <JsonViewer data={state.aiModel.data} maxRows={4} />
            )}
          </Alert>
        </Grid.Col>
      </Grid>

      {/* 整體狀態摘要 */}
      <Divider my="md" />
      <Group justify="center">
        <Badge
          variant="light"
          size="lg"
          color={
            state.overall === 'connected'
              ? 'green'
              : state.overall === 'failed'
                ? 'red'
                : state.overall === 'connecting'
                  ? 'blue'
                  : 'gray'
          }
        >
          {state.overall === 'connected' && '✅ 所有連接正常'}
          {state.overall === 'failed' && '❌ 部分連接失敗'}
          {state.overall === 'connecting' && '⏳ 測試進行中...'}
          {state.overall === 'idle' && '💤 等待測試'}
          {state.overall === 'timeout' && '⏰ 連接超時'}
        </Badge>
      </Group>
    </Card>
  );
};
