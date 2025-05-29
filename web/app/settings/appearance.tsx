import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

interface AppearanceProps {
  selectedColorTheme: string;
  onColorThemeChange: (colorTheme: string) => void;
}

export function Appearance({ selectedColorTheme, onColorThemeChange }: AppearanceProps) {
  const colorThemes = [
    { value: 'default', label: 'Default', color: 'hsl(var(--primary))' },
    { value: 'violet', label: 'Violet', color: 'hsl(262.1 83.3% 57.8%)' },
    { value: 'yellow', label: 'Yellow', color: 'hsl(47.9 95.8% 53.1%)' },
    { value: 'blue', label: 'Blue', color: 'hsl(221.2 83.2% 53.3%)' },
    { value: 'green', label: 'Green', color: 'hsl(142.1 76.2% 36.3%)' },
    { value: 'orange', label: 'Orange', color: 'hsl(24.6 95% 53.1%)' },
    { value: 'rose', label: 'Rose', color: 'hsl(346.8 77.2% 49.8%)' },
    { value: 'red', label: 'Red', color: 'hsl(0 72.2% 50.6%)' },
    { value: 'black', label: 'Black', color: 'hsl(240 5.9% 10%)' }
  ];

  return (
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
            {colorThemes.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorThemeChange(color.value)}
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
  );
} 