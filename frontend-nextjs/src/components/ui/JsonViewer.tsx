import { Textarea, Button, Group, Text } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

interface JsonViewerProps {
  data: unknown;
  maxRows?: number;
  label?: string;
}

export const JsonViewer = ({ data, maxRows = 8, label }: JsonViewerProps) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div>
      {label && (
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>
            {label}
          </Text>
          <Button
            variant="subtle"
            size="xs"
            leftSection={
              copied ? <IconCheck size={14} /> : <IconCopy size={14} />
            }
            onClick={handleCopy}
            color={copied ? 'green' : 'gray'}
          >
            {copied ? '已複製' : '複製'}
          </Button>
        </Group>
      )}

      <Textarea
        readOnly
        autosize
        minRows={2}
        maxRows={maxRows}
        value={jsonString}
        styles={{
          input: {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '12px',
            lineHeight: 1.4,
            backgroundColor: 'var(--mantine-color-gray-0)',
            border: '1px solid var(--mantine-color-gray-3)',
          },
        }}
      />
    </div>
  );
};
