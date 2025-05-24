'use client';

import useAuth from '@/lib/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';
// Card and CardContent are removed as the new design doesn't use them for the form area
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Label will be sr-only for inputs
import { Icons } from "@/components/icons"; // Ensure Icons.logo and Icons.gitHub are defined

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Column */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" /> {/* Replace with your actual logo component or SVG */}
          The Little Peepers Club
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Vocabulary is the bedrock of learning any new language. Think of Anki as the master architect, meticulously ensuring every foundational stone is solidly set within your memory palace. Without it, constructing my tower of multiple languages would have cost me manifolds more effort.&rdquo;
            </p>
            <footer className="text-sm">Adam Chow</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex h-full items-center justify-center bg-background p-4 lg:p-8">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <Link
            href="/register" // Link to the registration page
            className="text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Create an account
          </Link>
        </div>
        
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
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
                disabled={login.isPending}
                autoComplete="email"
                className="h-10" // Adjusted height
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">Password</Label>
              {/* "Forgot password?" link removed from here to match cleaner form style of reference image */}
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password" // Changed placeholder
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={login.isPending}
                autoComplete="current-password"
                className="h-10" // Adjusted height
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <span className="flex items-center justify-center">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In with Email" // Text matches reference image button
              )}
            </Button>

            {login.isError && (
              <div className="rounded-md bg-destructive/15 p-2.5 text-xs text-destructive"> {/* Adjusted styling */}
                <div className="flex items-center gap-1.5">
                  <Icons.alertCircle className="h-4 w-4" />
                  <span>Invalid email or password</span>
                </div>
              </div>
            )}
             {/* "Forgot password?" could be placed here if desired, e.g., below the error message */}
             <div className="text-sm text-right">
                <Link
                    href="/forgot-password"
                    className="font-medium text-primary hover:text-primary/90 transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
             </div>
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

          <Button 
            variant="outline" 
            className="w-full h-10" 
            onClick={() => { /* TODO: Implement GitHub Login logic */ }}
            disabled={login.isPending} 
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Button>

          {/* The "Don't have an account? Sign up" link is more appropriate here for a login page
              than the Terms/Privacy link from the registration reference image. */}
          <p className="px-6 text-center text-xs text-muted-foreground sm:px-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}