'use client';

import { Box, Container, Typography, useTheme } from '@mui/material';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'IspeakAI', subtitle }: HeaderProps) {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: 1,
        mt: 0.25,
        py: 3,
        px: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: subtitle ? 1 : 0 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
