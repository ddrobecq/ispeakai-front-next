'use client';

import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  ...props
}: ButtonProps) {
  const variantMap = {
    primary: 'contained' as const,
    secondary: 'outlined' as const,
    danger: 'contained' as const,
  };

  const colorMap = {
    primary: 'primary' as const,
    secondary: 'inherit' as const,
    danger: 'error' as const,
  };

  return (
    <MuiButton
      variant={variantMap[variant]}
      color={colorMap[variant]}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
