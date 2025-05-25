'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isPublicPage = pathname === '/terms' || pathname === '/privacy';
  if (isAuthPage || isPublicPage) {
    return null;
  }
  return <Navbar />;
}
