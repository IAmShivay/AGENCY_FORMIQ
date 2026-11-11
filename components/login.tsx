'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react';
import Wordmark from '@/components/studio/Wordmark';
import EmberField from '@/components/studio/EmberField';
import { STUDIO_FONT_VARS } from '@/lib/studio-fonts';
import { ADMIN_BTN_PRIMARY, ADMIN_EYEBROW, ADMIN_FOCUS, ADMIN_INPUT, ADMIN_LABEL, ADMIN_TONE } from '@/components/admin/admin-ui';

const AUTH_TABS = [
    { id: 'login', label: 'Sign in' },
    { id: 'signup', label: 'Create account' },
] as const;
const ICON_TOGGLE = 'inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground';

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

    const isLogin = activeTab === 'login';
    const passwordToggle = (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 right-1 my-auto ${ICON_TOGGLE} ${ADMIN_FOCUS}`}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
    );
    const submit = (label: string) => (
        <button type="submit" disabled={isLoading} className={`group w-full h-12 ${ADMIN_BTN_PRIMARY}`}>
            {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" aria-label="Loading" /> : (
                <>
                    {label}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
            )}
        </button>
    );

    return (
        <div className={`studio ${STUDIO_FONT_VARS} grid min-h-screen lg:grid-cols-2`}>
            <aside className="tone-ink hero-ember relative isolate hidden overflow-hidden lg:flex lg:flex-col lg:justify-between p-10 xl:p-14">
                <div aria-hidden="true" className="absolute inset-0 -z-10">
                    <EmberField />
                    <div className="grain absolute inset-0" />
                </div>
                <Link href="/" className={`w-fit rounded-sm ${ADMIN_FOCUS}`} aria-label="Formiq home">
                    <Wordmark className="text-[34px]" />
                </Link>
                <div>
                    <p className={ADMIN_EYEBROW}>Studio admin</p>
                    <p className="mt-4 max-w-[14ch] font-display text-5xl xl:text-6xl font-medium leading-[0.95] tracking-[-0.05em] text-foreground">
                        Leads, projects and quotes, <span className="font-serif italic font-normal tracking-[-0.02em]">in one place.</span>
                    </p>
                </div>
            </aside>

            <main className="flex items-center justify-center px-4 py-12 sm:px-8">
                <div className="w-full max-w-sm">
                    <Link href="/" className={`mb-12 inline-block rounded-sm lg:hidden ${ADMIN_FOCUS}`} aria-label="Formiq home">
                        <Wordmark className="text-[30px]" />
                    </Link>

                    <p className={ADMIN_EYEBROW}>{isLogin ? 'Welcome back' : 'New account'}</p>
                    <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] text-foreground">
                        {isLogin ? 'Sign in' : 'Create account'}
                    </h1>

                    {/* Account creation is disabled for now.
                    <div role="tablist" aria-label="Account" className="mt-8 grid grid-cols-2 rounded-full border border-border p-1">
                        {AUTH_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`h-9 rounded-full text-sm font-medium transition-colors ${ADMIN_FOCUS} ${activeTab === tab.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    */}

                    {message.text && (
                        <div role="status" className={`mt-6 flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm ${ADMIN_TONE[message.type === 'error' ? 'negative' : 'positive']}`}>
                            {message.type === 'error' ? <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {isLogin && (
                        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <label htmlFor="login-email" className={ADMIN_LABEL}>Email</label>
                                <input id="login-email" name="email" type="email" autoComplete="email" required value={formState.email} onChange={handleInputChange} className={`${ADMIN_INPUT} h-12`} placeholder="you@company.com" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="login-password" className={ADMIN_LABEL}>Password</label>
                                    <Link href="/forgot-password" className={`rounded-sm text-sm text-muted-foreground hover:text-foreground ${ADMIN_FOCUS}`}>Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formState.password} onChange={handleInputChange} className={`${ADMIN_INPUT} h-12 pr-12`} />
                                    {passwordToggle}
                                </div>
                            </div>
                            {submit('Sign in')}
                        </form>
                    )}
                    {/* Account creation is disabled for now.
                    {!isLogin && (
                        <form className="mt-6 space-y-5" onSubmit={handleSignup}>
                            <div className="space-y-2">
                                <label htmlFor="signup-name" className={ADMIN_LABEL}>Full name</label>
                                <input id="signup-name" name="name" type="text" autoComplete="name" required value={formState.name} onChange={handleInputChange} className={`${ADMIN_INPUT} h-12`} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="signup-email" className={ADMIN_LABEL}>Email</label>
                                <input id="signup-email" name="email" type="email" autoComplete="email" required value={formState.email} onChange={handleInputChange} className={`${ADMIN_INPUT} h-12`} placeholder="you@company.com" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="signup-password" className={ADMIN_LABEL}>Password</label>
                                <div className="relative">
                                    <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formState.password} onChange={handleInputChange} className={`${ADMIN_INPUT} h-12 pr-12`} />
                                    {passwordToggle}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirm-password" className={ADMIN_LABEL}>Confirm password</label>
                                <input id="confirm-password" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formState.confirmPassword} onChange={handleInputChange} className={`${ADMIN_INPUT} h-12`} />
                            </div>
                            {submit('Create account')}
                            <p className="text-xs text-muted-foreground">
                                By creating an account you agree to our{' '}
                                <Link href="/terms" className="text-foreground underline underline-offset-2">Terms</Link> and{' '}
                                <Link href="/privacy" className="text-foreground underline underline-offset-2">Privacy Policy</Link>.
                            </p>
                        </form>
                    )}
                    */}
                </div>
            </main>
        </div>
    );
};

export default AuthForms;