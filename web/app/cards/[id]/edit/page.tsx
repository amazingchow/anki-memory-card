'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';

import { ExpandableTextarea } from "@/components/expandable-textarea";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCards } from '@/lib/hooks/useCards';

import type { Card } from '@/lib/api';

export default function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, updateCard } = useCards();
  const [formData, setFormData] = useState<Partial<Card>>({
    word: '',
    definition: '',
    example: '',
    notes: '',
  });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const card = await getById(parseInt(id));
        setFormData({
          word: card.word || '',
          definition: card.definition || '',
          example: card.example || '',
          notes: card.notes || '',
        });
      } catch (error) {
        console.error('Failed to fetch card:', error);
        router.push('/cards');
      }
    };

    fetchCard();
  }, [id, getById, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word || !formData.definition) {
      return;
    }
    try {
      await updateCard.mutateAsync({
        id: parseInt(id),
        data: {
          word: formData.word,
          definition: formData.definition,
          example: formData.example || '',
          notes: formData.notes || '',
        }
      });
      router.push('/cards');
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || ''
    }));
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-[600px] mx-auto px-4">
        <UICard>
          <CardHeader>
            <CardTitle>Edit Card</CardTitle>
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
                      <MarkdownPreview content={formData.definition || ''} />
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
                      <MarkdownPreview content={formData.example || ''} />
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
                      <MarkdownPreview content={formData.notes || ''} />
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
                  disabled={updateCard.isPending}
                >
                  {updateCard.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </UICard>
      </div>
    </div>
  );
} 