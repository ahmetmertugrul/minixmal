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
      
      // Check if we have a valid session before attempting to sign out
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('useAuth: No active session found, skipping Supabase sign out');
        // Clear any remaining local storage items
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
        console.log('useAuth: Sign out completed successfully (no session)');
        return;
      }
      
      // Sign out from Supabase only if we have a valid session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Handle session-not-found errors gracefully - these are expected when the session is already invalid
        if (error.message?.includes('Auth session missing!') || 
            error.message?.includes('Session from session_id claim in JWT does not exist') ||
            error.message?.includes('session_not_found') ||
            error.code === 'session_not_found') {
          console.warn('useAuth: Session already invalid during sign out:', error.message);
        } else {
          console.error('useAuth: Supabase sign out error:', error);
        }
        // Continue with cleanup even if Supabase signOut fails
      } else {
        console.log('useAuth: Supabase sign out successful');
      }
      
      // Clear any remaining local storage items
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
      
      console.log('useAuth: Sign out completed successfully');
      
    } catch (error: any) {
      // Handle session-not-found errors gracefully at the top level too
      if (error.message?.includes('Auth session missing!') || 
          error.message?.includes('Session from session_id claim in JWT does not exist') ||
          error.message?.includes('session_not_found') ||
          error.code === 'session_not_found') {
        console.warn('useAuth: Session already invalid during sign out:', error.message);
      } else {
        console.error('useAuth: Sign out error:', error);
      }
      // Even if there's an error, clear local state
      setUser(null);
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