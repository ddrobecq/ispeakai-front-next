'use client';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // Middleware already protects this route - no need for additional client-side checks
  return <>{children}</>;
}
