'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, FileText, Bell, Calendar , Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UserDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Get user profile data
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserData({
          id: user.id,
          email: user.email,
          fullName: profile?.full_name || 'User',
          createdAt: new Date(user.created_at || Date.now()).toLocaleDateString(),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {userData?.fullName}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Here's an overview of your account</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{userData?.fullName}</h2>
              <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
            </div>
          </div>
          <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Member since: {userData?.createdAt}</span>
            </div>
            <Link href="/user/profile" className="text-primary hover:underline flex items-center">
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FileText className="w-6 h-6 text-blue-500 dark:text-blue-300" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-800 dark:text-white">Blog Posts</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Check out our latest blog posts and stay updated with industry trends.</p>
          <Link href="/blog" className="text-primary hover:underline">
            View Blog
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Bell className="w-6 h-6 text-green-500 dark:text-green-300" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-800 dark:text-white">Notifications</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You have no new notifications at this time.</p>
          <span className="text-gray-500 dark:text-gray-400">
            Check back later
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <User className="w-6 h-6 text-purple-500 dark:text-purple-300" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-800 dark:text-white">Account Settings</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Update your profile information and account preferences.</p>
          <Link href="/user/profile" className="text-primary hover:underline">
            Manage Profile
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
