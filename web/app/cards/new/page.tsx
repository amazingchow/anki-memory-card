'use client';

import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ExpandableTextarea } from "@/components/expandable-textarea";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cards } from '@/lib/api';
import { useCards } from '@/lib/hooks/useCards';

export default function NewCardPage() {
  const router = useRouter();
  const { createCard } = useCards();
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    example: '',
    notes: '',
  });
  const [isImporting, setIsImporting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCard.mutateAsync(formData);
      router.push('/cards');
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      await cards.uploadFile(file);
      router.push('/cards');
    } catch (error) {
      console.error('Failed to import cards:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container max-w-[800px] mx-auto py-8">
      <h2 className="text-2xl font-bold mb-8">New Card</h2>
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Anki Cards</TabsTrigger>
          <TabsTrigger value="create">Create an Anki Card</TabsTrigger>
        </TabsList>
        <TabsContent value="import"> 
          <Card>
            <CardHeader>
              <CardTitle>Import Anki Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="file-import"
                  accept=".apkg"
                  onChange={handleFileImport}
                  disabled={isImporting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isImporting}
                  onClick={() => document.getElementById('file-import')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Import cards from an Anki .apkg file
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create an Anki Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="word">Word</Label>
                  <Input
                    type="text"
                    name="word"
                    id="word"
                    required
                    value={formData.word}
                    onChange={handleChange}
                    placeholder="Enter the word"
                  />
                </div>
                <Separator />
                <div className="space-y-1">
                  <Label htmlFor="definition">Definition</Label>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <ExpandableTextarea
                        name="definition"
                        id="definition"
                        required
                        rows={3}
                        value={formData.definition}
                        onChange={handleChange}
                        placeholder="Enter the definition"
                        label="Definition"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="min-h-[100px] rounded-md border border-input bg-background p-3">
                        <MarkdownPreview content={formData.definition} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="example">Example (optional)</Label>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <ExpandableTextarea
                        name="example"
                        id="example"
                        rows={2}
                        value={formData.example}
                        onChange={handleChange}
                        placeholder="Enter an example sentence"
                        label="Example"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="min-h-[80px] rounded-md border border-input bg-background p-3">
                        <MarkdownPreview content={formData.example} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <ExpandableTextarea
                        name="notes"
                        id="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any additional notes"
                        label="Notes"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="min-h-[80px] rounded-md border border-input bg-background p-3">
                        <MarkdownPreview content={formData.notes} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <Separator />
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCard.isPending}
                  >
                    {createCard.isPending ? 'Creating...' : 'Create Card'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 