import { Badge, Loader } from '@mantine/core';
import { IconCheck, IconX, IconClock, IconWifi } from '@tabler/icons-react';
import type { ConnectionStatus } from '@/types/api';

interface StatusBadgeProps {
  status: ConnectionStatus;
  timing?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({
  status,
  timing,
  size = 'sm',
}: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          color: 'gray',
          icon: <IconWifi size={12} />,
          text: '待測試',
        };
      case 'connecting':
        return {
          color: 'blue',
          icon: <Loader size={12} />,
          text: '連接中...',
        };
      case 'connected':
        return {
          color: 'green',
          icon: <IconCheck size={12} />,
          text: timing ? `成功 (${timing}ms)` : '成功',
        };
      case 'failed':
        return {
          color: 'red',
          icon: <IconX size={12} />,
          text: '失敗',
        };
      case 'timeout':
        return {
          color: 'orange',
          icon: <IconClock size={12} />,
          text: '超時',
        };
      default:
        return {
          color: 'gray',
          icon: <IconWifi size={12} />,
          text: '未知',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant="light"
      color={config.color}
      size={size}
      leftSection={config.icon}
    >
      {config.text}
    </Badge>
  );
};
