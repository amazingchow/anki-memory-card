import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

interface AccountProps {
  profile: {
    isPremium: boolean;
    usageCount: number;
    createdAt: string;
  };
  onCancelSubscription: () => void;
  onDeleteAccount: () => void;
}

export function Account({ profile, onCancelSubscription, onDeleteAccount }: AccountProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div className="space-y-1">
          <Label>Subscription</Label>
          <div className="text-xs text-muted-foreground">
            {profile.isPremium ? 'You are a premium member.' : 'You are on the free plan.'}
          </div>
          {profile.isPremium ? (
            <Button variant="outline" onClick={onCancelSubscription}>Cancel Subscription</Button>
          ) : (
            <Button variant="default" onClick={() => window.location.href = '/subscribe'}>Upgrade to Premium</Button>
          )}
        </div>
        <div className="space-y-1">
          <Label>AI Card Generation Usage</Label>
          <div className="text-xs text-muted-foreground">
            {profile.isPremium ? 'Unlimited usage for premium members.' : 'Free accounts are limited to 15 AI card generations.'}
          </div>
        </div>
        {profile.createdAt && (
          <div className="space-y-1">
            <Label>Registered At</Label>
            <div className="text-xs text-muted-foreground">{profile.createdAt}</div>
          </div>
        )}
        <Separator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteAccount}>
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
} 