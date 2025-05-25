'use client';

import useAuth from '@/lib/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Error will be displayed by the conditional rendering below
      return;
    }
    register.mutate({ email, password });
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Column */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" />
          Anki AI
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Vocabulary is the bedrock of learning any new language. Think of Anki as the master architect, meticulously ensuring every foundational stone is solidly set within your memory palace. Without it, constructing my tower of multiple languages would have cost me manifolds more effort.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex h-full items-center justify-center bg-background p-4 lg:p-8">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Login
          </Link>
        </div>
        
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={register.isPending}
                autoComplete="email"
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={register.isPending}
                autoComplete="new-password"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="sr-only">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={register.isPending}
                autoComplete="new-password"
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              disabled={register.isPending}
            >
              {register.isPending ? (
                <span className="flex items-center justify-center">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>

            {register.isError && (
              <div className="rounded-md bg-destructive/15 p-2.5 text-xs text-destructive">
                <div className="flex items-center gap-1.5">
                  <Icons.alertCircle className="h-4 w-4" />
                  <span>Failed to create account. Please try again.</span>
                </div>
              </div>
            )}
            {password !== confirmPassword && confirmPassword !== '' && (
              <div className="rounded-md bg-destructive/15 p-2.5 text-xs text-destructive">
                <div className="flex items-center gap-1.5">
                  <Icons.alertCircle className="h-4 w-4" />
                  <span>Passwords do not match</span>
                </div>
              </div>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement Google Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement Apple Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.apple className="mr-2 h-4 w-4" />
              Apple
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement Facebook Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement GitHub Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <p className="px-6 text-center text-xs text-muted-foreground sm:px-8">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
} 