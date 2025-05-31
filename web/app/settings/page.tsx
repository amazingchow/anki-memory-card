'use client';

import { useState, useEffect, useCallback } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { users, type NotificationSettings as ApiNotificationSettings } from '@/lib/api';

import { Account } from './account';
import { Appearance } from './appearance';
import { Notifications } from './notifications';
import { Profile } from './profile';

const TAB_ITEMS = [
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

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await users.getProfile();
      setProfile({
        id: response.id,
        username: response.nickname || '',
        email: response.email || '',
        bio: '',
        isPremium: response.is_premium || false,
        usageCount: response.usage_count || 0,
        createdAt: response.created_at || '',
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchNotificationSettings = useCallback(async () => {
    try {
      const response = await users.getNotificationSettings();
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
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUserProfile();
    fetchNotificationSettings();
    const colorTheme = typeof window !== 'undefined' ? localStorage.getItem('color-theme') || 'default' : 'default';
    setSelectedColorTheme(colorTheme);
  }, [fetchNotificationSettings, fetchUserProfile]);

  const handleSaveProfile = async () => {
    try {
      await users.updateProfile({
        nickname: profile.username,
        email: profile.email,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await users.cancelSubscription();
      setProfile(prev => ({ ...prev, isPremium: false }));
      toast({
        title: "Success",
        description: "Subscription cancelled successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await users.deleteAccount();
      window.location.href = '/login';
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
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
        } catch (error: unknown) {
          console.error(`Failed to load theme: ${colorTheme}`, error);
        }
      }
    }
  };

  const handleNotificationSettingsChange = async (newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings);
    try {
      const apiSettings: ApiNotificationSettings = {
        email_notifications: newSettings.emailNotifications,
        push_notifications: newSettings.pushNotifications,
        notification_types: {
          new_cards: newSettings.notificationTypes.newCards,
          study_reminders: newSettings.notificationTypes.studyReminders,
          achievement_unlocked: newSettings.notificationTypes.achievementUnlocked,
          system_updates: newSettings.notificationTypes.systemUpdates,
        },
        study_reminder_time: newSettings.studyReminderTime,
      };
      
      await users.updateNotificationSettings(apiSettings);
      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch {
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
    <div className="container max-w-[800px] mx-auto py-8">
      <h2 className="text-2xl font-bold mb-8">Settings</h2>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {TAB_ITEMS.map(item => (
            <TabsTrigger key={item.key} value={item.key}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profile">
          <Profile
            profile={{ username: profile.username, email: profile.email, bio: profile.bio }}
            onProfileChange={({ username, email, bio }) => setProfile(prev => ({ ...prev, username, email, bio }))}
            onSave={handleSaveProfile}
          />
        </TabsContent>
        <TabsContent value="account">
          <Account
            profile={{ isPremium: profile.isPremium, usageCount: profile.usageCount, createdAt: profile.createdAt }}
            onCancelSubscription={handleCancelSubscription}
            onDeleteAccount={handleDeleteAccount}
          />
        </TabsContent>
        <TabsContent value="appearance">
          <Appearance
            selectedColorTheme={selectedColorTheme}
            onColorThemeChange={handleColorThemeChange}
          />
        </TabsContent>
        <TabsContent value="notifications">
          <Notifications
            settings={notificationSettings}
            onSettingsChange={handleNotificationSettingsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
