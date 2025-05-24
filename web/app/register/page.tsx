'use client';

import { useRouter } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    register.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-6 px-4">
      <Card className="max-w-[430px] w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl sm:text-2xl font-extrabold text-foreground">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={register.isPending}
            >
              {register.isPending ? 'Creating account...' : 'Create account'}
            </Button>
            {register.isError && (
              <div className="text-red-500 text-sm sm:text-base text-center">
                Failed to create account. Please try again.
              </div>
            )}
            {password !== confirmPassword && (
              <div className="text-red-500 text-sm sm:text-base text-center">
                Passwords do not match
              </div>
            )}
            <div className="text-sm text-center text-muted-foreground">
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 