import { useQuery } from '@tanstack/react-query';
import api from '../api';

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response = await api.get('/statistics');
      return response.data;
    },
  });
} 