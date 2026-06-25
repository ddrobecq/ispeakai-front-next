'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Box, Card, TextField, Typography, Button as MuiButton, useTheme } from '@mui/material';
import { loginSchema, LoginFormData } from '@/shared/utils/validators';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function LoginPage() {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          marginTop: '2px',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>
          IspeakAI
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          Learn English through conversation
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            error={!!errors.email?.message}
            helperText={errors.email?.message}
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            {...register('password')}
            error={!!errors.password?.message}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            sx={{ width: '100%' }}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
