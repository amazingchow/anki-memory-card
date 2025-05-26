import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { auth } from '@/lib/api';
import {
  setToken,
  setUserId,
  removeAllCookies,
} from '@/lib/cookies';

export default function useAuth() {
  const router = useRouter();

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.login(email, password),
    onSuccess: (data) => {
      setToken(data.access_token);
      setUserId(data.user_id);
      router.push('/cards');
    },
  });

  const register = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.register(email, password),
    onSuccess: () => {
      router.push('/login');
    },
  });

  const logout = () => {
    removeAllCookies();
    router.push('/login');
  };

  return {
    login,
    register,
    logout,
  };
} 