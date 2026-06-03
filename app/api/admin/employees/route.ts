import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies } as any);

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Failed to verify admin status' }, { status: 500 });
    }

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Try to fetch employees from users table, return empty array if table doesn't exist
    try {
      const { data: employees, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        if (error.message.includes('relation "users" does not exist')) {
          console.log('Users table does not exist, returning empty employees list');
          return NextResponse.json({ employees: [] });
        }
        console.error('Error fetching employees:', error);
        return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
      }

      return NextResponse.json({ employees: employees || [] });
    } catch (error) {
      console.error('Unexpected error fetching employees:', error);
      return NextResponse.json({ employees: [] });
    }
  } catch (error) {
    console.error('Error in GET /api/admin/employees:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies } as any);

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Failed to verify admin status' }, { status: 500 });
    }

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      full_name,
      email,
      phone,
      role,
      department,
      position,
      address,
      date_of_birth,
      hire_date,
      salary,
      employee_id,
      emergency_contact_name,
      emergency_contact_phone,
      skills,
      bio,
      is_admin
    } = body;

    // Generate employee ID if not provided
    const generatedEmployeeId = employee_id || `EMP${Date.now()}`;

    // Try to insert employee, handle case where users table doesn't exist
    try {
      const { data: employee, error } = await supabase
        .from('users')
        .upsert({
          id: id || undefined, // Let Supabase generate if not provided
          full_name,
          email,
          phone,
          role,
          department,
          position,
          address,
          date_of_birth,
          hire_date,
          salary,
          employee_id: generatedEmployeeId,
          emergency_contact_name,
          emergency_contact_phone,
          skills,
          bio,
          is_admin: is_admin || false,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('relation "users" does not exist')) {
          return NextResponse.json({
            error: 'Users table not found. Please set up the database first.'
          }, { status: 400 });
        }
        console.error('Error updating employee:', error);
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
      }

      return NextResponse.json({ employee });
    } catch (error) {
      console.error('Unexpected error updating employee:', error);
      return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST /api/admin/employees:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
