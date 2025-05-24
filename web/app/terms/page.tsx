'use client';

import Link from 'next/link';

import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">Back to Register</Link>
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground">
              By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p className="text-sm text-muted-foreground">
              Our application provides a platform for creating and managing memory cards for learning purposes. The service allows users to create, edit, and organize their study materials.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p className="text-sm text-muted-foreground">
              To use certain features of the service, you must register for an account. You agree to provide accurate information and maintain account security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. User Content</h2>
            <p className="text-sm text-muted-foreground">
              You retain all rights to any content you create, upload, or share through our service. By using our service, you grant us a license to store and display your content.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Acceptable Use</h2>
            <p className="text-sm text-muted-foreground">
              You agree not to use the service for any illegal purpose or violate any laws in your jurisdiction.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Termination</h2>
            <p className="text-sm text-muted-foreground">
              We reserve the right to terminate or suspend your account and access to the service at our sole discretion.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Changes to Terms</h2>
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any material changes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Contact Information</h2>
            <p className="text-sm text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at support@example.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 