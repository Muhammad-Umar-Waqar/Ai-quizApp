// utils/withAuth.js
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const verifyToken = async () => {
        // Get the token from client-side cookies
        const token = getCookie('token');

        if (!token) {
          router.replace('/signup'); // Redirect if token is missing
          return;
        }

        try {
          // Verify token by calling your `/api/me` route
          const response = await fetch('/api/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            throw new Error('Token verification failed');
          }
        } catch (error) {
          console.error(error);
          router.replace('/signin'); // Redirect if verification fails
        }
      };

      verifyToken();
    }, []);

    if (!isAuthenticated) {
      console.log("User is not Authenticated");
      return null; // Render nothing while checking authentication
    }
    if(isAuthenticated){
      return <WrappedComponent {...props} />;
    }

  };
};

export default withAuth;
