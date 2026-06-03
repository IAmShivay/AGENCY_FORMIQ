// Check data in the portfolio tables
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://ksodprlwmxmitufelmto.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzb2Rwcmx3bXhtaXR1ZmVsbXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjQwMzMsImV4cCI6MjA1ODY0MDAzM30.H8Oytj8i1kSsqoG8sVc8VDTxB1rrHOskUL9wn1JDxOs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('Checking data in portfolio tables...');

  // Check website projects
  const { data: websiteData, error: websiteError } = await supabase
    .from('portfolio_websites')
    .select('*');

  if (websiteError) {
    console.error('Error fetching website data:', websiteError);
  } else {
    console.log(`Found ${websiteData.length} website projects:`, websiteData);
  }

  // Check app projects
  const { data: appData, error: appError } = await supabase
    .from('portfolio_apps')
    .select('*');

  if (appError) {
    console.error('Error fetching app data:', appError);
  } else {
    console.log(`Found ${appData.length} app projects:`, appData);
  }

  // Check design projects
  const { data: designData, error: designError } = await supabase
    .from('portfolio_designs')
    .select('*');

  if (designError) {
    console.error('Error fetching design data:', designError);
  } else {
    console.log(`Found ${designData.length} design projects:`, designData);
  }

  console.log('Data check complete!');
}

// Run the function
checkData()
  .catch(error => {
    console.error('Error:', error);
  });
