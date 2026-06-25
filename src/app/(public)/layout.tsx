'use client';

import { Box } from '@mui/material';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {children}
    </Box>
  );
}
