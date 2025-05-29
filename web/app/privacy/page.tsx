'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">Back to Register</Link>
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p className="text-sm text-muted-foreground">
              We collect information that you provide directly to us, including account information (email address, password), content you create and store in the application, usage data and preferences, and device and browser information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-sm text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices, respond to your questions, and monitor usage patterns.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
            <p className="text-sm text-muted-foreground">
              We do not share your personal information with third parties except with your consent, to comply with legal obligations, to protect our rights, or with service providers who assist in our operations.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p className="text-sm text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
            <p className="text-sm text-muted-foreground">
              You have the right to access your personal information, correct inaccurate data, request deletion of your data, object to processing of your data, and export your data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Cookies and Tracking</h2>
            <p className="text-sm text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Children&apos;s Privacy</h2>
            <p className="text-sm text-muted-foreground">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Changes to This Policy</h2>
            <p className="text-sm text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
            <p className="text-sm text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 