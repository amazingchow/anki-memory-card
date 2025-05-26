import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cards } from '@/lib/api';
import type { Card } from '@/lib/api';

export function useCards() {
  const queryClient = useQueryClient();

  const allCards = useQuery({
    queryKey: ['cards'],
    queryFn: cards.getAll,
  });

  const dueCards = useQuery({
    queryKey: ['cards', 'due'],
    queryFn: cards.getDue,
  });

  const getById = async (id: number) => {
    const response = await cards.getById(id);
    return response;
  };

  const createCard = useMutation({
    mutationFn: (data: Omit<Card, 'id' | 'created_at' | 'updated_at' | 'next_review' | 'review_count' | 'status'>) =>
      cards.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  const updateCard = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Card, 'id' | 'created_at' | 'updated_at' | 'next_review' | 'review_count' | 'status'>> }) =>
      cards.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  const reviewCard = useMutation({
    mutationFn: ({ card_id, rating }: { card_id: number; rating: number }) =>
      cards.review(card_id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['cards', 'due'] });
    },
  });

  return {
    allCards,
    dueCards,
    getById,
    createCard,
    updateCard,
    reviewCard,
  };
} 