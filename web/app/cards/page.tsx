'use client';

import Link from 'next/link';

import { MarkdownPreview } from '@/components/markdown-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCards } from '@/lib/hooks/useCards';

export default function CardsPage() {
  const { allCards, dueCards } = useCards();

  return (
    <div className="container max-w-[800px] mx-auto py-8">
      <h2 className="text-2xl font-bold mb-8">Cards</h2>
      <Tabs defaultValue="due" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="due">Due Cards</TabsTrigger>
          <TabsTrigger value="all">All Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="due">
          {dueCards.isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : dueCards.isError ? (
            <Card className="bg-destructive/10">
              <CardContent className="p-6">
                <p className="text-destructive">Failed to load due cards</p>
              </CardContent>
            </Card>
          ) : dueCards.data?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">No cards due for review</p>
              </CardContent>
            </Card>
          ) : Array.isArray(dueCards.data) ? (
            <Carousel className="w-full">
              <CarouselContent>
                {dueCards.data.map((card) => (
                  <CarouselItem key={card.id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{card.word}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          <MarkdownPreview content={card.definition} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Status: {card.status}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="link" asChild className="p-0 h-auto">
                          <Link href={`/cards/${card.id}/review`}>Review</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Card className="bg-destructive/10">
              <CardContent className="p-6">
                <p className="text-destructive">Unexpected data format</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          {allCards.isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : allCards.isError ? (
            <Card className="bg-destructive/10">
              <CardContent className="p-6">
                <p className="text-destructive">Failed to load cards</p>
              </CardContent>
            </Card>
          ) : allCards.data?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">No cards yet</p>
              </CardContent>
            </Card>
          ) : Array.isArray(allCards.data) ? (
            <Carousel className="w-full">
              <CarouselContent>
                {allCards.data.map((card) => (
                  <CarouselItem key={card.id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{card.word}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          <MarkdownPreview content={card.definition} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Status: {card.status}
                        </div>
                      </CardContent>
                      <CardFooter className="gap-4">
                        <Button variant="link" asChild className="p-0 h-auto">
                          <Link href={`/cards/${card.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="link" asChild className="p-0 h-auto">
                          <Link href={`/cards/${card.id}/review`}>Review</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Card className="bg-destructive/10">
              <CardContent className="p-6">
                <p className="text-destructive">Unexpected data format</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 