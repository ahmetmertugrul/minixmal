export interface AdminUser {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin' | 'moderator';
  permissions: {
    full_access?: boolean;
    pro_features?: boolean;
    unlimited_content?: boolean;
    admin_dashboard?: boolean;
    user_management?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface AdminPermissions {
  full_access: boolean;
  pro_features: boolean;
  unlimited_content: boolean;
  admin_dashboard: boolean;
  user_management: boolean;
}