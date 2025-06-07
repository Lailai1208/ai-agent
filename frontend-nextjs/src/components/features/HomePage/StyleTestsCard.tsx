// src/components/features/HomePage/StyleTestsCard.tsx
'use client';

import { Button, Title, Card, Text, Group } from '@mantine/core';

export function StyleTestsCard() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className="mb-4">
        🎨 Tailwind CSS + Mantine 整合測試
      </Title>

      <div className="space-y-4">
        {/* 測試混合樣式 */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-lg text-white">
          <Text className="font-bold">Tailwind 漸層背景</Text>
          <Text size="sm">這是使用 Tailwind CSS 類別的漸層背景</Text>
        </div>

        {/* 測試響應式網格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded text-center">
            <Text className="font-semibold text-blue-800">響應式</Text>
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            <Text className="font-semibold text-green-800">網格</Text>
          </div>
          <div className="bg-orange-100 p-4 rounded text-center">
            <Text className="font-semibold text-orange-800">佈局</Text>
          </div>
        </div>

        {/* 測試 Mantine 元件 + Tailwind 類別 */}
        <Group justify="center" className="mt-6">
          <Button
            variant="filled"
            color="blue"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            Mantine + Tailwind 按鈕
          </Button>
          <Button
            variant="outline"
            color="green"
            className="border-2 hover:border-green-400 transition-colors"
          >
            混合樣式按鈕
          </Button>
        </Group>
      </div>
    </Card>
  );
}
