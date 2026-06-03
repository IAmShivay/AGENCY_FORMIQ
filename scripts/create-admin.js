// This script helps create an admin user in Supabase
// Usage: node scripts/create-admin.js your-email@example.com

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in .env.local file');
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Error: Email address is required');
  console.error('Usage: node scripts/create-admin.js your-email@example.com');
  process.exit(1);
}

async function makeUserAdmin(email) {
  try {
    // Check if user exists in users table by email
    const { data: existingUserByEmail, error: emailCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
      console.error('Error checking for user:', emailCheckError.message);
      process.exit(1);
    }

    let userId = existingUserByEmail?.id;

    if (!userId) {
      // User doesn't exist in users table, inform user
      console.error('Error: User not found in the database');
      console.error('Make sure the user has registered through the login page first');
      process.exit(1);

    } else {
      // User exists, update their admin status
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user:', updateError.message);
        process.exit(1);
      }
    }

    console.log(`Success! User ${email} is now an admin`);
  } catch (error) {
    console.error('Unexpected error:', error.message);
    process.exit(1);
  }
}

makeUserAdmin(email);
