import React from 'react';
import { Modal } from '@mantine/core';

export function MantineModal({ isOpen, onClose, title, children, size = 'md' }) {
  return (
    <Modal
      opened={Boolean(isOpen)}
      onClose={onClose}
      title={title}
      size={size}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      {children}
    </Modal>
  );
}
