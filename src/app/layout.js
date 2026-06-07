'use client'
// app/layout.js
import { useEffect, useState, useContext } from 'react';
import '../../src/app/globals.css';
import ToastConfig from './components/ToastConfig';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import 'tailwindcss/tailwind.css';
import UserState from '@/context/userDetails/UserState';
import { getCookie, deleteCookie } from '../helpers/cookieUtils';
import userContext from '@/context/userDetails/UserContext';


function LayoutContent({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [token, setToken] = useState();

const router = useRouter();
const pathname = usePathname();
const context = useContext(userContext);
const { refreshUser } = context || {};



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

      deleteCookie('token');
      deleteCookie('userId');
      localStorage.removeItem('notificationId');

      // Refresh user context to clear user data
      if (refreshUser) {
        await refreshUser();
      }

      if (response.ok) {
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
  setToken(getCookie("token"));
},[pathname])

  return (
        <div className="p-2 w-[100%] h-[100%]">
         <ToastConfig />
          {children}
        </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserState>
          <LayoutContent>{children}</LayoutContent>
        </UserState>
      </body>
    </html>
  );
}
