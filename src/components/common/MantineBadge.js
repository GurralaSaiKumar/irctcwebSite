import React from 'react';
import { Badge } from '@mantine/core';

export function MantineBadge({
  children,
  color = 'blue',
  size = 'md',
  style = {},
  ...props
}) {
  let mantineColor = color;
  if (color === 'green') mantineColor = 'teal';
  else if (color === 'yellow') mantineColor = 'yellow';
  else if (color === 'red') mantineColor = 'red';
  else if (color === 'gray') mantineColor = 'gray';

  return (
    <Badge color={mantineColor} size={size} style={style} {...props}>
      {children}
    </Badge>
  );
}
