'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { users, type NotificationSettings as ApiNotificationSettings } from '@/lib/api';
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const SIDEBAR_ITEMS = [
  { key: 'profile', label: 'Profile' },
  { key: 'account', label: 'Account' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'notifications', label: 'Notifications' },
];

interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio: string;
  isPremium: boolean;
  usageCount: number;
  createdAt: string;
}

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

export default function SettingsPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    username: '',
    email: '',
    bio: '',
    isPremium: false,
    usageCount: 0,
    createdAt: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [selectedColorTheme, setSelectedColorTheme] = useState('default');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    notificationTypes: {
      newCards: true,
      studyReminders: true,
      achievementUnlocked: true,
      systemUpdates: false,
    },
    studyReminderTime: '20:00',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchNotificationSettings();
    // 读取localStorage
    const theme = typeof window !== 'undefined' ? localStorage.getItem('theme-preference') : null;
    const colorTheme = typeof window !== 'undefined' ? localStorage.getItem('color-theme') || 'default' : 'default';
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      setSelectedTheme(theme);
      applyTheme(theme);
    }
    setSelectedColorTheme(colorTheme);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await users.getProfile(profile.id);
      setProfile({
        id: response.id,
        username: response.nickname || '',
        email: response.email || '',
        bio: '',
        isPremium: response.is_premium || false,
        usageCount: response.usage_count || 0,
        createdAt: response.created_at || '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const response = await users.getNotificationSettings();
      console.log(response);
      setNotificationSettings({
        emailNotifications: response.email_notifications,
        pushNotifications: response.push_notifications,
        notificationTypes: {
          newCards: response.notification_types.new_cards,
          studyReminders: response.notification_types.study_reminders,
          achievementUnlocked: response.notification_types.achievement_unlocked,
          systemUpdates: response.notification_types.system_updates,
        },
        studyReminderTime: response.study_reminder_time,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      await users.updateProfile(profile.id, {
        nickname: profile.username,
        email: profile.email,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await users.cancelSubscription(profile.id);
      setProfile(prev => ({ ...prev, isPremium: false }));
      toast({
        title: "Success",
        description: "Subscription cancelled successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await users.deleteAccount(profile.id);
      window.location.href = '/login';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'userId=; Max-Age=0; path=/;';
      window.location.href = '/login';
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-preference', theme);
      applyTheme(theme);
    }
  };

  const handleColorThemeChange = async (colorTheme: string) => {
    setSelectedColorTheme(colorTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('color-theme', colorTheme);
      
      // 移除所有现有的颜色主题类
      document.documentElement.classList.remove('theme-violet', 'theme-yellow', 'theme-blue', 'theme-green', 'theme-orange', 'theme-rose', 'theme-red', 'theme-black');
      
      // 添加新的颜色主题类
      if (colorTheme !== 'default') {
        document.documentElement.classList.add(`theme-${colorTheme}`);
        try {
          // 动态导入主题CSS
          await import(`@/app/themes/globals-${colorTheme}.css`);
        } catch (error) {
          console.error(`Failed to load theme: ${colorTheme}`, error);
        }
      }
    }
  };

  function applyTheme(theme: string) {
    if (typeof window === 'undefined') return;
    if (theme === 'system') {
      // 跟随系统
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }

  const handleNotificationSettingsChange = async () => {
    try {
      const apiSettings: ApiNotificationSettings = {
        email_notifications: notificationSettings.emailNotifications,
        push_notifications: notificationSettings.pushNotifications,
        notification_types: {
          new_cards: notificationSettings.notificationTypes.newCards,
          study_reminders: notificationSettings.notificationTypes.studyReminders,
          achievement_unlocked: notificationSettings.notificationTypes.achievementUnlocked,
          system_updates: notificationSettings.notificationTypes.systemUpdates,
        },
        study_reminder_time: notificationSettings.studyReminderTime,
      };
      
      await users.updateNotificationSettings(apiSettings);
      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-muted/50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white py-8 px-4">
        <h2 className="text-xl font-bold mb-8">Settings</h2>
        <nav className="space-y-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedTab === item.key ? 'bg-muted font-semibold' : 'hover:bg-muted/70'}`}
              onClick={() => setSelectedTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 py-12 px-8">
        {selectedTab === 'profile' && (
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
                  onChange={e => setProfile(prev => ({ ...prev, username: e.target.value }))}
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
                  onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
                <div className="text-xs text-muted-foreground">
                  You can @mention other users and organizations to link to them.
                </div>
              </div>
              <Button onClick={handleSaveProfile}>Update profile</Button>
            </CardContent>
          </Card>
        )}
        {selectedTab === 'account' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <div className="text-sm text-muted-foreground mb-4">
                This is your account information.
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-small">Subscription</div>
                  <div className="text-xs text-muted-foreground">
                    {profile.isPremium ? 'You are a premium member.' : 'You are on the free plan.'}
                  </div>
                </div>
                {profile.isPremium ? (
                  <Button variant="outline" onClick={handleCancelSubscription}>Cancel Subscription</Button>
                ) : (
                  <Button variant="default" onClick={() => window.location.href = '/subscribe'}>Upgrade to Premium</Button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">AI Card Generation Usage</div>
                  <div className="text-xs text-muted-foreground">
                    {profile.isPremium ? 'Unlimited usage for premium members.' : 'Free accounts are limited to 15 AI card generations.'}
                  </div>
                </div>
                <span className="font-bold">{profile.isPremium ? '∞' : `${profile.usageCount} / 15`}</span>
              </div>
              {profile.createdAt && (
                <div>
                  <div className="font-medium">Registered At</div>
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
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
        {selectedTab === 'appearance' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <div className="text-sm text-muted-foreground mb-4">
                Choose your theme preference.
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              <div className="space-y-2">
                <div className="font-medium mb-2">Theme preferences</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: 'default', label: 'Default', color: 'hsl(var(--primary))' },
                    { value: 'violet', label: 'Violet', color: 'hsl(262.1 83.3% 57.8%)' },
                    { value: 'yellow', label: 'Yellow', color: 'hsl(47.9 95.8% 53.1%)' },
                    { value: 'blue', label: 'Blue', color: 'hsl(221.2 83.2% 53.3%)' },
                    { value: 'green', label: 'Green', color: 'hsl(142.1 76.2% 36.3%)' },
                    { value: 'orange', label: 'Orange', color: 'hsl(24.6 95% 53.1%)' },
                    { value: 'rose', label: 'Rose', color: 'hsl(346.8 77.2% 49.8%)' },
                    { value: 'red', label: 'Red', color: 'hsl(0 72.2% 50.6%)' },
                    { value: 'black', label: 'Black', color: 'hsl(240 5.9% 10%)' }
                  ].map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorThemeChange(color.value)}
                      className={`p-3 rounded-md border transition-colors ${
                        selectedColorTheme === color.value
                          ? 'border-primary bg-muted'
                          : 'border-input hover:bg-accent'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-sm">{color.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {selectedTab === 'notifications' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <div className="text-sm text-muted-foreground mb-4">
                Configure how you want to receive notifications.
              </div>
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
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: checked
                      }))
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
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        pushNotifications: checked
                      }))
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
                      checked={notificationSettings.notificationTypes.newCards}
                      onCheckedChange={(checked: boolean) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          notificationTypes: {
                            ...prev.notificationTypes,
                            newCards: checked
                          }
                        }))
                      }
                    />
                    <Label htmlFor="newCards">New Cards Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="studyReminders"
                      checked={notificationSettings.notificationTypes.studyReminders}
                      onCheckedChange={(checked: boolean) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          notificationTypes: {
                            ...prev.notificationTypes,
                            studyReminders: checked
                          }
                        }))
                      }
                    />
                    <Label htmlFor="studyReminders">Study Reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="achievementUnlocked"
                      checked={notificationSettings.notificationTypes.achievementUnlocked}
                      onCheckedChange={(checked: boolean) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          notificationTypes: {
                            ...prev.notificationTypes,
                            achievementUnlocked: checked
                          }
                        }))
                      }
                    />
                    <Label htmlFor="achievementUnlocked">Achievement Unlocked</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="systemUpdates"
                      checked={notificationSettings.notificationTypes.systemUpdates}
                      onCheckedChange={(checked: boolean) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          notificationTypes: {
                            ...prev.notificationTypes,
                            systemUpdates: checked
                          }
                        }))
                      }
                    />
                    <Label htmlFor="systemUpdates">System Updates</Label>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="font-medium">Study Reminder Time</div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={notificationSettings.studyReminderTime}
                    onChange={(e) =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        studyReminderTime: e.target.value
                      }))
                    }
                    className="w-32"
                  />
                  <div className="text-sm text-muted-foreground">
                    Set the time for daily study reminders
                  </div>
                </div>
              </div>
              <Button onClick={handleNotificationSettingsChange}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        )}
        <Toaster />
      </main>
    </div>
  );
}
