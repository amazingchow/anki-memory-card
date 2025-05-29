import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { Textarea } from "@/components/ui/textarea";

interface ProfileProps {
  profile: {
    username: string;
    email: string;
    bio: string;
  };
  onProfileChange: (profile: { username: string; email: string; bio: string }) => void;
  onSave: () => void;
}

export function Profile({ profile, onProfileChange, onSave }: ProfileProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <div className="text-sm text-muted-foreground mb-4">
          This is how others will see you on the site.
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={profile.username}
            onChange={e => onProfileChange({ ...profile, username: e.target.value })}
            placeholder="Enter your username"
          />
          <div className="text-xs text-muted-foreground">
            This is your public display name. It can be your real name or a pseudonym.
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile.email}
            disabled
            placeholder="Select a verified email to display"
          />
          <div className="text-xs text-muted-foreground">
            You cannot change your email address.
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={e => onProfileChange({ ...profile, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={3}
          />
          <div className="text-xs text-muted-foreground">
            You can @mention other users and organizations to link to them.
          </div>
        </div>
        <Button onClick={onSave}>Update profile</Button>
      </CardContent>
    </Card>
  );
} 