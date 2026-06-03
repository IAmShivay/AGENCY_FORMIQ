import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies } as any);
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      // Update existing user to admin
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          is_admin: true,
          role: 'admin',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User'
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user to admin:', updateError);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }

      return NextResponse.json({ 
        message: 'User updated to admin successfully',
        user: updatedUser 
      });
    } else {
      // Create new admin user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
          role: 'admin',
          is_admin: true,
          is_active: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating admin user:', insertError);
        return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
      }

      return NextResponse.json({ 
        message: 'Admin user created successfully',
        user: newUser 
      });
    }
  } catch (error) {
    console.error('Error in POST /api/admin/setup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies } as any);
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return NextResponse.json({ 
      user: profile,
      isAdmin: profile?.is_admin || false,
      needsSetup: !profile
    });
  } catch (error) {
    console.error('Error in GET /api/admin/setup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
