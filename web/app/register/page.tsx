'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Icons } from '@/components/icons';
import { Testimonials } from '@/components/testimonials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from '@/lib/hooks/useAuth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const errors = validatePassword(newPassword);
    setPasswordError(errors.length > 0 ? errors[0] : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors[0]);
      return;
    }

    if (password !== confirmPassword) {
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
          IntelliVocab
        </div>
        <Testimonials />
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
                onChange={handleEmailChange}
                disabled={register.isPending}
                autoComplete="email"
                className="h-10"
              />
              {emailError && (
                <div className="rounded-md bg-destructive/15 p-2.5 text-xs text-destructive">
                  <div className="flex items-center gap-1.5">
                    <Icons.alertCircle className="h-4 w-4" />
                    <span>{emailError}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={register.isPending}
                  autoComplete="new-password"
                  className="h-10 pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Icons.alertCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="w-64 p-3">
                        <p className="font-medium mb-2">Password Requirements:</p>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center gap-1.5">
                            <Icons.check className="h-3 w-3" />
                            At least 8 characters
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Icons.check className="h-3 w-3" />
                            One uppercase letter
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Icons.check className="h-3 w-3" />
                            One lowercase letter
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Icons.check className="h-3 w-3" />
                            One number
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Icons.check className="h-3 w-3" />
                            One special character
                          </li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="rounded-md bg-destructive/15 p-2.5 text-xs text-destructive">
                  <div className="flex items-center gap-1.5">
                    <Icons.alertCircle className="h-4 w-4" />
                    <span>{passwordError}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="sr-only">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={register.isPending}
                  autoComplete="new-password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <Icons.eyeOff className="h-4 w-4" />
                  ) : (
                    <Icons.eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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

          <div className="grid grid-cols-4 gap-1">
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement Google Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.google className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement Apple Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.apple className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement Facebook Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.facebook className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10" 
              onClick={() => { /* TODO: Implement GitHub Sign Up logic */ }}
              disabled={register.isPending} 
            >
              <Icons.gitHub className="h-4 w-4" />
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