'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { signupSchema, SignupFormData } from '@/shared/utils/validators';
import { useSignup } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function SignupPage() {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate: signup, isPending } = useSignup();

  const onSubmit = (data: SignupFormData) => {
    signup(data);
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
          Create your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Input
            label="First Name"
            type="text"
            placeholder="John"
            {...register('firstName')}
            error={!!errors.firstName?.message}
            helperText={errors.firstName?.message}
          />

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
            sx={{ width: '100%' }}
            disabled={isPending}
          >
            {isPending ? 'Creating account...' : 'Sign up'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
