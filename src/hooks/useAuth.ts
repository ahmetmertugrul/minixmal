import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types/auth';

export const useAuth = (): AuthState & {
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // If there's a refresh token error, clear the session
        if (error && (error.message?.includes('Invalid Refresh Token') || 
                     error.message?.includes('Refresh Token Not Found') ||
                     error.code === 'refresh_token_not_found')) {
          await supabase.auth.signOut();
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser(session?.user ? {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at
        } : null);
        setLoading(false);
      } catch (error: any) {
        // Handle any other errors during session retrieval
        console.warn('Error getting session:', error);
        setUser(null);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
        } else if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at
          });
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('useAuth: Starting sign out process...');
      console.log('useAuth: Current user before sign out:', user?.email);
      
      // Clear local state immediately for better UX
      setUser(null);
      
      // Clear local storage items first to prevent any stale session data
      const clearLocalStorage = () => {
        try {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.includes('supabase') && key.includes('auth')) {
              localStorage.removeItem(key);
              console.log('useAuth: Cleared localStorage key:', key);
            }
          });
        } catch (storageError) {
          console.warn('useAuth: Error clearing local storage:', storageError);
        }
      };
      
      // Check if we have a valid session before attempting to sign out
      let hasValidSession = false;
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('useAuth: Session check failed:', error.message);
          clearLocalStorage();
          console.log('useAuth: Sign out completed successfully (session check failed)');
          return;
        }
        
        hasValidSession = !!session;
        
        if (!hasValidSession) {
          console.log('useAuth: No active session found, skipping Supabase sign out');
          clearLocalStorage();
          console.log('useAuth: Sign out completed successfully (no session)');
          return;
        }
      } catch (sessionError: any) {
        console.warn('useAuth: Error checking session:', sessionError);
        clearLocalStorage();
        console.log('useAuth: Sign out completed successfully (session check error)');
        return;
      }
      
      // Only attempt Supabase sign out if we have a valid session
      if (hasValidSession) {
        try {
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            console.error('useAuth: Supabase sign out error:', error);
            // Continue with cleanup even if Supabase signOut fails
          } else {
            console.log('useAuth: Supabase sign out successful');
          }
        } catch (signOutError: any) {
          console.error('useAuth: Sign out network error:', signOutError);
        }
      }
      
      // Clear local storage after attempting sign out
      clearLocalStorage();
      
      console.log('useAuth: Sign out completed successfully');
      
    } catch (error: any) {
      // Handle any unexpected errors at the top level
      console.error('useAuth: Unexpected sign out error:', error);
      
      // Even if there's an error, clear local state and storage
      setUser(null);
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') && key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.warn('useAuth: Error clearing local storage in catch block:', storageError);
      }
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};