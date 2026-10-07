import React from 'react';
import { TextInput, NativeSelect } from '@mantine/core';

export function MantineTextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error,
  helperText,
  name,
  disabled = false,
  style = {},
  ...props
}) {
  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      <TextInput
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        error={error}
        description={helperText}
        name={name}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}

export function MantineSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
  error,
  name,
  style = {},
  ...props
}) {
  const formattedData = options.map((opt) => {
    if (typeof opt === 'object') {
      return { value: String(opt.value), label: String(opt.label) };
    }
    return { value: String(opt), label: String(opt) };
  });

  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      <NativeSelect
        label={label}
        value={value ? String(value) : ''}
        onChange={onChange}
        data={formattedData}
        required={required}
        error={error}
        name={name}
        {...props}
      />
    </div>
  );
}
