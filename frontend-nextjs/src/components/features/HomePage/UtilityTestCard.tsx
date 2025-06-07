// src/components/features/HomePage/UtilityTestCard.tsx
'use client';

import { Title, Card, Text } from '@mantine/core';
import { formatDate } from '@/utils/helpers';
import { APP_NAME } from '@/lib/constants';

export function UtilityTestCard() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className="mb-4">
        🛠 工具函式測試
      </Title>
      <Text className="mb-2">
        <strong>格式化日期:</strong> {formatDate(new Date())}
      </Text>
      <Text className="mb-2">
        <strong>應用程式名稱:</strong> {APP_NAME}
      </Text>
      <Text>
        <strong>環境:</strong> {process.env.NODE_ENV}
      </Text>
    </Card>
  );
}
