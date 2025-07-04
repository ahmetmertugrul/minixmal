import React from 'react';
import { LogOut, User, Settings, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserProfileProps {
  onSignOut: () => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSignOut }) => {
  const { user } = useAuth();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('UserProfile: Sign out button clicked');
      console.log('UserProfile: Current user:', user?.email);
      
      // Call the parent sign out function
      await onSignOut();
      
      console.log('UserProfile: Sign out completed');
    } catch (error) {
      console.error('UserProfile: Sign out error:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 min-w-[250px]">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user.email}</h3>
          <p className="text-sm text-gray-600">Minimalism Explorer</p>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Award className="w-4 h-4" />
          <span className="text-sm font-medium">Achievements</span>
        </button>
        
        <hr className="border-gray-200 my-2" />
        
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;