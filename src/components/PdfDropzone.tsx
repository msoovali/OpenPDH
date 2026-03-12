import { useRef } from 'react';
import { Group, Text, Button, CloseButton } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconFileUpload } from '@tabler/icons-react';
import '@mantine/dropzone/styles.css';

interface Props {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  label?: string;
}

export function PdfDropzone({ file, onFileSelect, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (file) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelect(f);
            e.target.value = '';
          }}
        />
        <Group
          gap={6}
          align="center"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            borderRadius: 'var(--mantine-radius-sm)',
            padding: '4px 8px',
            height: 30,
          }}
        >
          <Text size="xs" truncate style={{ maxWidth: 160 }}>{file.name}</Text>
          <Button size="compact-xs" variant="subtle" onClick={() => inputRef.current?.click()}>
            Change
          </Button>
          <CloseButton size="xs" onClick={() => onFileSelect(null)} />
        </Group>
      </>
    );
  }

  return (
    <Dropzone
      onDrop={(files) => {
        if (files[0]) onFileSelect(files[0]);
      }}
      accept={[MIME_TYPES.pdf]}
      maxFiles={1}
      multiple={false}
      py={6}
      px="sm"
      radius="sm"
      style={{
        flex: '1 1 160px',
        maxWidth: 260,
        cursor: 'pointer',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'var(--mantine-color-blue-4)',
        backgroundColor: 'var(--mantine-color-blue-0)',
      }}
    >
      <Group gap={6} justify="center" style={{ pointerEvents: 'none' }}>
        <IconFileUpload size={18} color="var(--mantine-color-blue-6)" />
        <Text size="xs" fw={500} c="blue.6">
          {label ?? 'Select or drop PDF'}
        </Text>
      </Group>
    </Dropzone>
  );
}
