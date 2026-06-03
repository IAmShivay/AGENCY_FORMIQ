'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    EyeIcon,
    EyeOffIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    EyeOff
} from 'lucide-react';

const AuthForms = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formState, setFormState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    // Clear message after 5 seconds
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const validateSignup = () => {
        if (formState.password !== formState.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return false;
        }
        if (formState.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return false;
        }
        return true;
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formState.email,
                password: formState.password,
            });

            if (error) throw error;

            // Get user profile data with better error handling
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError) {
                console.error('Error getting user:', userError);
                throw new Error('Failed to get user information');
            }

            if (!userData?.user) {
                throw new Error('No user data found');
            }

            // Get user profile with improved error handling and role support
            let profile: { is_admin: boolean; is_employee: boolean; is_manager: boolean; full_name: string } | null = null;
            let profileError: any = null;

            // Use direct Supabase client API call like other working tabs
            for (let attempt = 0; attempt < 3; attempt++) {
                const { data: profileData, error: err } = await supabase
                    .from('users')
                    .select('is_admin, is_employee, is_manager, full_name')
                    .eq('id', userData.user.id)
                    .single();

                if (!err && profileData) {
                    profile = profileData;
                    console.log('User profile loaded successfully:', {
                        email: userData.user.email,
                        is_admin: profile.is_admin,
                        is_employee: profile.is_employee,
                        is_manager: profile.is_manager
                    });
                    break;
                } else if (err) {
                    profileError = err;
                    console.warn(`Profile fetch attempt ${attempt + 1} failed:`, err);

                    // If it's a missing profile, try to create it
                    if (err.code === 'PGRST116' && attempt === 0) {
                        console.log('Profile not found, attempting to create...');
                        const { error: insertError } = await supabase
                            .from('users')
                            .insert([{
                                id: userData.user.id,
                                email: userData.user.email || formState.email,
                                full_name: userData.user.user_metadata?.full_name || '',
                                is_admin: false,
                                is_employee: false,
                                is_manager: false
                            }]);

                        if (insertError) {
                            console.error('Failed to create profile:', insertError);
                        }
                    }

                    // Wait a bit before retrying
                    if (attempt < 2) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }

            if (!profile) {
                console.error('Final profile error:', profileError);
                // Default to regular user if we can't get profile
                profile = { is_admin: false, is_employee: false, is_manager: false, full_name: '' };
            }

            setMessage({ type: 'success', text: 'Login successful!' });

            // Redirect based on user role with proper priority
            setTimeout(() => {
                console.log('Redirecting user based on roles:', profile);
                if (profile?.is_admin) {
                    console.log('Redirecting to admin dashboard');
                    router.push('/admin');
                } else if (profile?.is_manager) {
                    console.log('Redirecting to manager dashboard');
                    router.push('/admin'); // Managers also get admin access but with limited permissions
                } else {
                    console.log('Redirecting to user dashboard');
                    router.push('/user');
                }
            }, 1000);
        } catch (error: any) {
            console.error('Login error:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to login. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: any) => {
        e.preventDefault();
        if (!validateSignup()) return;

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Create the user
            const { data, error } = await supabase.auth.signUp({
                email: formState.email,
                password: formState.password,
                options: {
                    data: {
                        full_name: formState.name,
                    },
                },
            });

            if (error) throw error;

            // Insert user profile data with conflict handling
            if (data.user) {
                // The trigger should handle this, but let's add a fallback
                // Wait a moment for the trigger to execute
                await new Promise(resolve => setTimeout(resolve, 500));

                // Check if profile was created by trigger
                const { data: existingProfile } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', data.user.id)
                    .single();

                // If no profile exists, create one manually
                if (!existingProfile) {
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert([
                            {
                                id: data.user.id,
                                email: formState.email,
                                full_name: formState.name,
                                is_admin: false, // Default to non-admin
                                is_employee: false, // Default to non-employee
                                is_manager: false // Default to non-manager
                            }
                        ]);

                    // Only throw error if it's not a duplicate key error
                    if (profileError && !profileError.message.includes('duplicate key')) {
                        console.error('Profile creation error:', profileError);
                        throw profileError;
                    }
                }
            }

            setMessage({
                type: 'success',
                text: 'Registration successful! Please check your email to verify your account.'
            });

            // Reset form after successful signup
            setFormState({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
            });

            // Switch to login tab after successful signup
            setTimeout(() => setActiveTab('login'), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to create account' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-2 px-4 sm:px-6 lg:px-8  relative overflow-hidden">
            {/* Background elements */}
            {/* <div className="absolute inset-0 from-background via-background to-primary/5">
    <div className="absolute inset-0 opacity-30 mix-blend-soft-light">
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3182ce,transparent)]" />
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[conic-gradient(from_0deg,transparent,#3182ce,transparent)] animate-slow-spin" />
      <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-[conic-gradient(from_180deg,transparent,#3182ce,transparent)] animate-slow-spin" />
    </div>
  </div> */}

            {/* Grid pattern */}
            {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)] opacity-50" /> */}

            {/* Noise texture */}
            {/* <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]" /> */}

            {/* Main container - increased width */}
            <div className="max-w-5xl w-full flex flex-col md:flex-row  rounded-2xl overflow-hidden">
                <div className="w-full md:w-2/5 bg-primary/10 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="w-full h-64 md:h-full rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center">
                        <div className="text-primary text-opacity-70 text-center">
                            <div className="w-full h-full">
                                {/* <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
              <text x="50" y="55" textAnchor="middle" fill="currentColor" fontSize="10">Your SVG</text>
            </svg> */}
                                <p className="mt-4 text-sm">Your animated icon will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container - Right side */}
                <div className="w-full md:w-3/5  backdrop-blur-xl  p-6 md:p-10">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-primary/10 dark:bg-primary/10 border-2 border-primary/30 flex items-center justify-center animate-pulse">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-primary text-opacity-80">
                                    <div className="w-16 h-16 text-primary font-bold text-5xl flex items-center justify-center">
                                        <SparklesIcon className="w-12 h-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70">
                            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            {activeTab === 'login'
                                ? 'Sign in to access your account'
                                : 'Join us and start your journey'}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-300/30 dark:border-gray-700/30 mt-6">
                        <button
                            className={`flex-1 py-2 text-center font-medium text-sm transition-colors duration-300 ${activeTab === 'login'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 py-2 text-center font-medium text-sm transition-colors duration-300 ${activeTab === 'signup'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Message display */}
                    {message.text && (
                        <div
                            className={`flex items-center p-3 rounded-lg text-sm mt-4 ${message.type === 'error'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                }`}
                        >
                            {message.type === 'error' ? (
                                <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                            ) : (
                                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                            )}
                            {message.text}
                        </div>
                    )}

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form className="mt-6 space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email address
                                    </label>
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formState.email}
                                        onChange={handleInputChange}
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition duration-300"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="relative">
                                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="login-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={formState.password}
                                            onChange={handleInputChange}
                                            className="appearance-none relative block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition duration-300"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/50"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                        Remember me
                                    </label>
                                </div>

                                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Sign in
                                            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Signup Form */}
                    {activeTab === 'signup' && (
                        <form className="mt-6 space-y-6" onSubmit={handleSignup}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        id="signup-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={formState.name}
                                        onChange={handleInputChange}
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition duration-300"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email address
                                    </label>
                                    <input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formState.email}
                                        onChange={handleInputChange}
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition duration-300"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="relative">
                                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="signup-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formState.password}
                                            onChange={handleInputChange}
                                            className="appearance-none relative block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition duration-300"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formState.confirmPassword}
                                        onChange={handleInputChange}
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition duration-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                                By signing up, you agree to our{' '}
                                <Link href="/terms" className="text-primary hover:text-primary/80">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-primary hover:text-primary/80">
                                    Privacy Policy
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* Social login options */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300/30 dark:border-gray-700/30"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white/20 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300/30 dark:border-gray-700/30 rounded-md shadow-sm bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors duration-300"
                            >
                                <span className="sr-only">Sign in with Google</span>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.75 16.72 5.86 14.12H2.18V16.98C3.98 20.55 7.7 23 12 23Z" fill="#34A853" />
                                    <path d="M5.86 14.12C5.65 13.49 5.53 12.81 5.53 12.11C5.53 11.41 5.65 10.73 5.86 10.1V7.24H2.18C1.43 8.71 1 10.36 1 12.11C1 13.86 1.43 15.51 2.18 16.98L5.86 14.12Z" fill="#FBBC05" />
                                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.98 3.45 2.18 7.01L5.86 9.87C6.75 7.27 9.14 5.38 12 5.38Z" fill="#EA4335" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300/30 dark:border-gray-700/30 rounded-md shadow-sm bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors duration-300"
                            >
                                <span className="sr-only">Sign in with GitHub</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300/30 dark:border-gray-700/30 rounded-md shadow-sm bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors duration-300"
                            >
                                <span className="sr-only">Sign in with Twitter</span>
                                <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForms;