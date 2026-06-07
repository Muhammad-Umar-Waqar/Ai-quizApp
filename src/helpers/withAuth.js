// utils/withAuth.js
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie, deleteCookie } from './cookieUtils';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;

      const verifyToken = async () => {
        const token = getCookie('token');

        if (!token) {
          if (isMounted) {
            deleteCookie('token');
            router.replace('/signup');
          }
          return;
        }

        try {
          const response = await fetch('/api/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            if (isMounted) {
              setIsAuthenticated(true);
              setIsLoading(false);
            }
          } else {
            deleteCookie('token');
            if (isMounted) {
              setIsLoading(false);
              router.replace('/signin');
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data');
          deleteCookie('token');
          if (isMounted) {
            setIsLoading(false);
            router.replace('/signin');
          }
        }
      };

      verifyToken();

      return () => {
        isMounted = false;
      };
    }, [router]);

    if (isLoading) {
      return null;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
