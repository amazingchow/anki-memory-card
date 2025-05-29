'use client';

import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';

import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card as UICard, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useCards } from '@/lib/hooks/useCards';

import type { Card } from '@/lib/api';

export default function ReviewCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, reviewCard } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [, setFlipAnimation] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCard = async () => {
      try {
        const cardData = await getById(parseInt(id));
        if (isMounted) {
          setCard(cardData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch card:', error);
        if (isMounted) {
          router.push('/cards');
        }
      }
    };

    fetchCard();

    return () => {
      isMounted = false;
    };
  }, [id, router, getById]);

  const handleRating = async (rating: number) => {
    if (!card || isReviewing) return;

    try {
      setIsReviewing(true);
      await reviewCard.mutateAsync({ card_id: card.id, rating });
      router.push('/cards');
    } catch (error) {
      console.error('Failed to review card:', error);
      setIsReviewing(false);
    }
  };

  const handleFlip = () => {
    setFlipAnimation(true);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setFlipAnimation(false);
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">Card not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-8">
          <Progress value={(card.review_count / 10) * 100} className="h-2" />
          <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Review Count: {card.review_count} | Status: {card.status}
          </div>
        </div>

        {/* Card Container */}
        <div className="relative perspective-1000 mb-20">
          <div
            className={`relative w-full transition-transform duration-300 transform-style-3d ${
              showAnswer ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of Card */}
            <div
              className={`absolute w-full backface-hidden ${
                showAnswer ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <UICard className="min-h-[120px] sm:min-h-[400px] flex items-center">
                <CardContent className="flex flex-col items-center justify-center w-full h-full p-2 sm:p-6">
                  <div className="flex items-center justify-center flex-1 w-full gap-4 sm:gap-8">
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative w-32 h-32 sm:w-64 sm:h-64">
                        <Image
                          src="/examples/example1.webp"
                          alt="Memory Card Logo"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-full bg-scrollbar mx-6" />
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <CardTitle className="text-base sm:text-4xl text-center mb-4">
                        {card.word}
                      </CardTitle>
                      <Button
                        onClick={handleFlip}
                        size="sm"
                        className="w-full sm:w-auto sm:text-base"
                      >
                        Show Answer
                        <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </UICard>
            </div>

            {/* Back of Card */}
            <div
              className={`absolute w-full backface-hidden rotate-y-180 ${
                showAnswer ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <UICard className="min-h-[120px] sm:min-h-[400px]">
                <CardContent className="space-y-2 sm:space-y-6 p-2 sm:p-6">
                  <div>
                    <h2 className="text-sm sm:text-lg font-semibold mb-0.5 sm:mb-2">
                      Definition
                    </h2>
                    <div className="text-[11px] sm:text text-muted-foreground">
                      <MarkdownPreview content={card.definition} />
                    </div>
                  </div>

                  {card.example && (
                    <div>
                      <h2 className="text-sm sm:text-lg font-semibold mb-0.5 sm:mb-2">
                        Example
                      </h2>
                      <div className="text-[11px] sm:text text-muted-foreground italic">
                        <MarkdownPreview content={card.example} />
                      </div>
                    </div>
                  )}

                  {card.notes && (
                    <div>
                      <h2 className="text-sm sm:text-lg font-semibold mb-0.5 sm:mb-2">
                        Notes
                      </h2>
                      <div className="text-[11px] sm:text text-muted-foreground">
                        <MarkdownPreview content={card.notes} />
                      </div>
                    </div>
                  )}

                  <div className="mt-2 sm:mt-8">
                    <h2 className="text-xs sm:text-xl font-medium mb-1 sm:mb-4 text-center">
                      How well did you remember?
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-4">
                      {[
                        { rating: 1, label: 'Hard' },
                        { rating: 2, label: 'Good' },
                        { rating: 3, label: 'Easy' },
                        { rating: 4, label: 'Perfect' },
                      ].map(({ rating, label }) => (
                        <Button
                          key={rating}
                          onClick={() => handleRating(rating)}
                          disabled={isReviewing}
                          variant="outline"
                          size="sm"
                          className="h-auto py-0.5 sm:py-4"
                        >
                          <div className="text-[11px] sm:text-lg font-bold">{rating}</div>
                          <div className="text-[9px] sm:text-xs text-muted-foreground">{label}</div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 sm:mt-8">
                    <Button
                      onClick={() => router.back()}
                      variant="outline"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleFlip}
                      variant="outline"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Flip
                    </Button>
                  </div>
                </CardContent>
              </UICard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 