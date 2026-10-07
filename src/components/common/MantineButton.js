import React from 'react';
import { Button } from '@mantine/core';

export function MantineButton({
  children,
  variant = 'primary',
  size = 'sm',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  icon,
  style = {},
  ...props
}) {
  let mantineVariant = 'filled';
  let mantineColor = 'blue';

  if (variant === 'orange') {
    mantineVariant = 'filled';
    mantineColor = 'orange';
  } else if (variant === 'primary') {
    mantineVariant = 'filled';
    mantineColor = 'blue';
  } else if (variant === 'light') {
    mantineVariant = 'light';
    mantineColor = 'blue';
  } else if (variant === 'outline') {
    mantineVariant = 'outline';
    mantineColor = 'gray';
  } else if (variant === 'danger') {
    mantineVariant = 'filled';
    mantineColor = 'red';
  } else if (variant === 'danger-light') {
    mantineVariant = 'light';
    mantineColor = 'red';
  }

  return (
    <Button
      type={type}
      variant={mantineVariant}
      color={mantineColor}
      size={size}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      leftSection={icon ? <span>{icon}</span> : undefined}
      style={style}
      {...props}
    >
      {children}
    </Button>
  );
}
