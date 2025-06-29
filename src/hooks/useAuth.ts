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
        setUser(session?.user ? {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at
        } : null);
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
      await supabase.auth.signOut();
    } catch (error: any) {
      // Check if this is a refresh token related error
      if (error?.message?.includes('Invalid Refresh Token') || 
          error?.message?.includes('Refresh Token Not Found') ||
          error?.code === 'refresh_token_not_found' ||
          error?.message?.includes('Session from session_id claim in JWT does not exist') || 
          error?.code === 'session_not_found') {
        
        // Clear local storage manually for token-related errors
        try {
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('sb-' + supabase.supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
          
          // Clear any other potential Supabase auth keys
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.includes('supabase') && key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });
        } catch (storageError) {
          console.warn('Error clearing local storage:', storageError);
        }
        
        // User is already effectively logged out
        console.warn('Sign out attempted but session was already invalid - cleared local auth state');
        return;
      }
      
      // For other errors, log as warning but don't throw
      console.warn('Sign out error (session may already be invalid):', error);
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