import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: {
    newCards: boolean;
    studyReminders: boolean;
    achievementUnlocked: boolean;
    systemUpdates: boolean;
  };
  studyReminderTime: string;
}

interface NotificationsProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

export function Notifications({ settings, onSettingsChange }: NotificationsProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications via email
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked: boolean) =>
                onSettingsChange({
                  ...settings,
                  emailNotifications: checked
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked: boolean) =>
                onSettingsChange({
                  ...settings,
                  pushNotifications: checked
                })
              }
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="font-medium">Notification Types</div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newCards"
                checked={settings.notificationTypes.newCards}
                onCheckedChange={(checked: boolean) =>
                  onSettingsChange({
                    ...settings,
                    notificationTypes: {
                      ...settings.notificationTypes,
                      newCards: checked
                    }
                  })
                }
              />
              <Label htmlFor="newCards">New Cards Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="studyReminders"
                checked={settings.notificationTypes.studyReminders}
                onCheckedChange={(checked: boolean) =>
                  onSettingsChange({
                    ...settings,
                    notificationTypes: {
                      ...settings.notificationTypes,
                      studyReminders: checked
                    }
                  })
                }
              />
              <Label htmlFor="studyReminders">Study Reminders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="achievementUnlocked"
                checked={settings.notificationTypes.achievementUnlocked}
                onCheckedChange={(checked: boolean) =>
                  onSettingsChange({
                    ...settings,
                    notificationTypes: {
                      ...settings.notificationTypes,
                      achievementUnlocked: checked
                    }
                  })
                }
              />
              <Label htmlFor="achievementUnlocked">Achievement Unlocked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="systemUpdates"
                checked={settings.notificationTypes.systemUpdates}
                onCheckedChange={(checked: boolean) =>
                  onSettingsChange({
                    ...settings,
                    notificationTypes: {
                      ...settings.notificationTypes,
                      systemUpdates: checked
                    }
                  })
                }
              />
              <Label htmlFor="systemUpdates">System Updates</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 