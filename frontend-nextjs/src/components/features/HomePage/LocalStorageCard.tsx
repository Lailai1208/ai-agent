// src/components/features/HomePage/LocalStorageCard.tsx
'use client';

import { Button, Title, Card, Text, Group } from '@mantine/core';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function LocalStorageCard() {
  const [count, setCount] = useLocalStorage('count', 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className="mb-4">
        💾 本地儲存測試
      </Title>
      <Text className="mb-4">
        計數器: <strong>{count}</strong>
      </Text>
      <Group gap="sm">
        <Button
          onClick={() => setCount(count + 1)}
          variant="filled"
          color="green"
        >
          增加
        </Button>
        <Button
          onClick={() => setCount(Math.max(0, count - 1))}
          variant="outline"
          color="red"
        >
          減少
        </Button>
      </Group>
    </Card>
  );
}
