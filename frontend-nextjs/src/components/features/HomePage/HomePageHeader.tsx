// src/components/features/HomePage/HomePageHeader.tsx
'use client';

import { Title, Text, Badge } from '@mantine/core';
import { formatDate } from '@/utils/helpers';
import { APP_NAME } from '@/lib/constants';

export function HomePageHeader() {
  return (
    <div className="text-center">
      <Title order={1} className="mb-4 text-gray-800">
        🎉 {APP_NAME}
      </Title>
      <Text size="lg" className="text-gray-600">
        Mantine + Tailwind CSS + TypeScript 完美整合
      </Text>
      <Badge color="blue" variant="light" className="mt-2">
        {formatDate(new Date())}
      </Badge>
    </div>
  );
}
