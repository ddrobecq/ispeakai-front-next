'use client';

import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'error'> {
  error?: string;
}

export function Input({ error, ...props }: InputProps) {
  return (
    <TextField
      {...props}
      error={!!error}
      helperText={error}
      variant="outlined"
      fullWidth
    />
  );
}
