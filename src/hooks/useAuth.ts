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
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at
      } : null);
      setLoading(false);
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
      // Check if this is the specific "session not found" error from Supabase
      if (error?.message?.includes('Session from session_id claim in JWT does not exist') || 
          error?.code === 'session_not_found') {
        // User is already effectively logged out, just log as warning
        console.warn('Sign out attempted but session was already invalid - user is already logged out');
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