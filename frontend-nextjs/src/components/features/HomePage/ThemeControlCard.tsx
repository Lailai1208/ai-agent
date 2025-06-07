// src/components/features/HomePage/ThemeControlCard.tsx
'use client';

import { Button, Title, Card, Text } from '@mantine/core';
import { useApp } from '@/context/AppContext';

export function ThemeControlCard() {
  const { theme, toggleTheme } = useApp();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className="mb-4">
        🎨 主題控制
      </Title>
      <Text className="mb-4">
        目前主題: <strong>{theme}</strong>
      </Text>
      <Button onClick={toggleTheme} variant="light" color="blue">
        切換主題
      </Button>
    </Card>
  );
}
