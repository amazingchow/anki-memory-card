'use client';

import { usePathname } from 'next/navigation';

import Navbar from '@/components/navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' 
    || pathname === '/register';
  const isPublicPage = pathname === '/terms' 
    || pathname === '/privacy'
    || pathname === '/registered' 
    || pathname === '/activate'
    || pathname === '/forgot-password'
    || pathname === '/reset-password';  
  if (isAuthPage || isPublicPage) {
    return null;
  }
  return <Navbar />;
}