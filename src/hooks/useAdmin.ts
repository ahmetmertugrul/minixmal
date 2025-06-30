import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { AdminUser, AdminPermissions } from '../types/admin';

export const useAdmin = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setLoading(false);
      setAdminUser(null);
      setIsAdmin(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      // Check if user is admin - use maybeSingle() to avoid PGRST116 error
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setAdminUser(null);
        setIsAdmin(false);
      } else if (adminData) {
        setAdminUser(adminData);
        setIsAdmin(true);
      } else {
        setAdminUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAdminUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions[permission] === true;
  };

  const hasFullAccess = (): boolean => {
    return hasPermission('full_access');
  };

  const hasProFeatures = (): boolean => {
    return hasPermission('pro_features');
  };

  const hasUnlimitedContent = (): boolean => {
    return hasPermission('unlimited_content');
  };

  const createAdminUser = async (email: string, role: AdminUser['role'] = 'admin') => {
    try {
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) {
        throw new Error(`User not found: ${email}`);
      }

      // Create admin user
      const adminData: Partial<AdminUser> = {
        user_id: userData.id,
        role,
        permissions: {
          full_access: true,
          pro_features: true,
          unlimited_content: true,
          admin_dashboard: role === 'super_admin',
          user_management: role === 'super_admin'
        }
      };

      const { data, error } = await supabase
        .from('admin_users')
        .insert(adminData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  };

  return {
    adminUser,
    loading,
    isAdmin,
    hasPermission,
    hasFullAccess,
    hasProFeatures,
    hasUnlimitedContent,
    createAdminUser,
    checkAdminStatus
  };
};