'use client';

import React, { useEffect, useState, useCallback } from 'react';
import UserContext from './UserContext';
import { getCookie } from '../../helpers/cookieUtils';

function UserState({ children }) {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadFriendRequests, setUnreadFriendRequestNotifications] = useState(0);

  const updateUnreadCount = (count) => setUnreadCount(count);
  const updateUnreadFriendRequestNotifications = (count) => setUnreadFriendRequestNotifications(count);

  const fetchUser = useCallback(async () => {
    const token = getCookie('token');

    if (!token) {
      console.warn('No token found');
      setUser(null); // Clear user state if no token
      return;
    }

    try {
      const response = await fetch('/api/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch user data');
        setUser(null); // Clear user state on error
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null); // Clear user state on error
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Provide refreshUser function to allow manual refresh
  const refreshUser = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{
      user,
      unreadCount,
      updateUnreadCount,
      unreadFriendRequests,
      updateUnreadFriendRequestNotifications,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserState;
