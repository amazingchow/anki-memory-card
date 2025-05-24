import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../api';
import Cookies from 'js-cookie';

export default function useAuth() {
  const router = useRouter();

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.login(email, password),
    onSuccess: (data) => {
      Cookies.set('token', data.access_token, { expires: 7 }); // 7 days
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
    Cookies.remove('token');
    router.push('/login');
  };

  return {
    login,
    register,
    logout,
  };
} 