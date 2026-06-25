'use client';

import { Box } from '@mui/material';
import { Header } from '@/components/layout/Header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header title="IspeakAI" subtitle="Learn English through conversation" />
      <Box sx={{ width: '100%', px: 2, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
