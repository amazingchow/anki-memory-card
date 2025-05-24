'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <Button variant="outline" asChild>
            <Link href="/register">Back to Register</Link>
          </Button>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Our application provides a platform for creating and managing memory cards for learning purposes. The service allows users to create, edit, and organize their study materials.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use certain features of the service, you must register for an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information when creating your account</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>

          <h2>4. User Content</h2>
          <p>
            You retain all rights to any content you create, upload, or share through our service. By using our service, you grant us a license to store and display your content solely for the purpose of providing the service.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the service for any illegal purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Upload or transmit any harmful code or malware</li>
            <li>Attempt to gain unauthorized access to any portion of the service</li>
            <li>Interfere with the proper working of the service</li>
          </ul>

          <h2>6. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page.
          </p>

          <h2>8. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at support@example.com.
          </p>
        </div>
      </div>
    </div>
  );
} 