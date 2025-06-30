import React, { useState } from 'react';
import { Shield, Users, Settings, Crown, Check, X } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { adminUser, hasPermission, createAdminUser } = useAdmin();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setCreating(true);
    setMessage('');

    try {
      await createAdminUser(newAdminEmail, 'admin');
      setMessage(`Successfully created admin user: ${newAdminEmail}`);
      setNewAdminEmail('');
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCreating(false);
    }
  };

  if (!adminUser) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Status */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-bold">Administrator Panel</h2>
            <p className="text-purple-100">Role: {adminUser.role}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              {hasPermission('full_access') ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p className="text-sm">Full Access</p>
          </div>
          
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              {hasPermission('pro_features') ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p className="text-sm">Pro Features</p>
          </div>
          
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              {hasPermission('unlimited_content') ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p className="text-sm">Unlimited Content</p>
          </div>
          
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              {hasPermission('admin_dashboard') ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p className="text-sm">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Current User Info */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-indigo-600" />
          Current User
        </h3>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Admin Role:</strong> {adminUser.role}</p>
          <p><strong>Created:</strong> {new Date(adminUser.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Create New Admin */}
      {hasPermission('user_management') && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-indigo-600" />
            Create New Admin
          </h3>
          
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="adminEmail"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Admin User'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-3 rounded-xl ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}

      {/* Admin Instructions */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Admin Instructions</h3>
        <div className="space-y-2 text-blue-800 text-sm">
          <p>• As an admin, you have unlimited access to all Pro features</p>
          <p>• You can access all tasks and articles without restrictions</p>
          <p>• AI Room Designer is fully available to you</p>
          <p>• Your admin status bypasses all subscription limitations</p>
          <p>• Use the form above to grant admin access to other users</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;