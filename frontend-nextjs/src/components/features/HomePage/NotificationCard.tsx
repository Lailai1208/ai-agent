// src/components/features/HomePage/NotificationCard.tsx
'use client';

import { Button, Title, Card, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function NotificationCard() {
  const handleNotification = () => {
    notifications.show({
      title: '測試通知',
      message: '所有功能都正常運作！',
      color: 'green',
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className="mb-4">
        🔔 通知系統
      </Title>
      <Text className="mb-4">測試 Mantine 通知功能</Text>
      <Button
        onClick={handleNotification}
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan' }}
      >
        顯示通知
      </Button>
    </Card>
  );
}
