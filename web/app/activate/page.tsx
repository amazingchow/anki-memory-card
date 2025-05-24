'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { auth } from '@/lib/api';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid activation link');
      return;
    }

    const activateAccount = async () => {
      try {
        await auth.activate(token);
        setStatus('success');
        setMessage('Your account has been successfully activated!');
      } catch {
        setStatus('error');
        setMessage('Failed to activate account. The link may be invalid or expired.');
      }
    };

    activateAccount();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          {status === 'loading' && (
            <div className="flex justify-center">
              <Icons.spinner className="h-16 w-16 text-primary animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          )}
          {status === 'error' && (
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight">
            {status === 'loading' && 'Activating Account...'}
            {status === 'success' && 'Account Activated!'}
            {status === 'error' && 'Activation Failed'}
          </h2>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">
              {status === 'success' ? 'Go to Login' : 'Return to Login'}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 