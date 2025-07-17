import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are properly set
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('⚠️  Supabase environment variables are not properly configured!')
  console.warn('Please update your .env.local file with your actual Supabase credentials.')
  console.warn('See SUPABASE_SETUP.md for detailed instructions.')
}

// Use fallback values for development if real credentials aren't available
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MTIsImV4cCI6MTk2MDc2ODgxMn0.placeholder'

export const supabase = createClient(
  supabaseUrl && supabaseUrl !== 'your_supabase_project_url' ? supabaseUrl : fallbackUrl,
  supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key' ? supabaseAnonKey : fallbackKey
)

// Authentication functions
export const signInWithGoogle = async () => {
  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    console.error('❌ Supabase is not configured. Please set up your environment variables.')
    alert('Authentication is not configured yet. Please check the setup instructions.')
    return
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Error signing in with Google:', error.message)
      // If Google OAuth fails, show helpful message
      if (error.message.includes('provider is not enabled')) {
        alert('Google OAuth is not enabled yet. Please enable it in your Supabase dashboard under Authentication → Providers.')
      }
      if (error.message.includes('Client ID is required')) {
        alert('Google OAuth Client ID is required. Please configure it in your Supabase dashboard under Authentication → Providers.')
      }
    }
  } catch (error) {
    console.error('Error signing in:', error)
  }
}

// Test function for email/password authentication
export const signInWithTestEmail = async () => {
  try {
    // Create a test user first
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    })
    
    if (error) {
      console.error('Error creating test user:', error.message)
      return
    }
    
    console.log('Test user created/signed in:', data)
    window.location.href = '/dashboard'
  } catch (error) {
    console.error('Error with test authentication:', error)
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    }
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
} 