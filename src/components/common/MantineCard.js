import React from 'react';
import { Card } from '@mantine/core';

export function MantineCard({
  children,
  style = {},
  withBorder = true,
  padding = 'lg',
  radius = 'md',
  shadow = 'xs',
  onClick,
  ...props
}) {
  return (
    <Card
      withBorder={withBorder}
      padding={padding}
      radius={radius}
      shadow={shadow}
      style={{ backgroundColor: '#ffffff', ...style }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Card>
  );
}
