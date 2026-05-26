'use client'
// app/layout.js
import { useEffect, useState } from 'react';
import '../../src/app/globals.css';
import ToastConfig from './components/ToastConfig';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import 'tailwindcss/tailwind.css';
import UserState from '@/context/userDetails/UserState';



export default function RootLayout({ children }) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [token, setToken] = useState();

const router = useRouter();
const pathname = usePathname();



const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
};

const toggleUserMenu = () => {
  setIsUserMenuOpen(!isUserMenuOpen);
};


const handleSignup = () => {
  router.push("/signup");
};

async function handleLogout() {
  setLoading(true)
  try {
      const response = await fetch('/api/logout', {
          method: 'POST',
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('notificationId');
      if (response.ok) {
          // Handle successful logout (e.g., redirect to sign-in page)
          router.push('/signin');
      } else {
          console.error('Failed to log out');
      }
  } catch (error) {
      console.error('Error during logout:', error);
  } finally {
    setLoading(false);
  }
}


useEffect(()=>{
  setToken(localStorage.getItem("token"));
},[token, pathname])

  return (
    <html lang="en">
      <body>
        <UserState>
        <div className="p-2 w-[100%] h-[100%]">
         <ToastConfig />
          {children}
        </div>
        </UserState>
      </body>
    </html>
  );
}
