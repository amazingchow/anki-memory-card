'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Registration Successful!
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please check your email to verify your account. You&apos;ll need to click the verification link to activate your account.
            </p>
          </div>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
