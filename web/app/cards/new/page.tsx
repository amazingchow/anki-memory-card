'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCards } from '@/lib/hooks/useCards';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpandableTextarea } from "@/components/expandable-textarea";

export default function NewCardPage() {
  const router = useRouter();
  const { createCard } = useCards();
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    example: '',
    notes: '',
  });

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

  return (
    <div className="min-h-screen bg-background py-4">
      <div className="max-w-[430px] mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Card</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="flex flex-col gap-3 pt-2">
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
      </div>
    </div>
  );
} 