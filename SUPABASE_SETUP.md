# Supabase Authentication Setup

This guide will help you set up Supabase authentication for your VortoxAI application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Google Cloud Console project for Google OAuth

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "vortoxai")
5. Enter a database password
6. Choose a region close to your users
7. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL (starts with `https://`)
   - Anon public key (starts with `eyJ`)

## Step 3: Set Up Google OAuth

1. Go to https://console.cloud.google.com
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add your authorized redirect URIs:
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
7. Copy the Client ID and Client Secret

## Step 4: Configure Supabase Authentication

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Enter your Google OAuth Client ID and Client Secret
4. Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

## Step 5: Update Environment Variables

Update your `.env.local` file with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 6: Test the Authentication

1. Start your development server: `npm run dev`
2. Click the "Get Started" button
3. You should be redirected to Google OAuth
4. After successful authentication, you'll be redirected to the dashboard

## Troubleshooting

- Make sure your redirect URLs match exactly in both Google Console and Supabase
- Check that your environment variables are loaded correctly
- Verify that the Google+ API is enabled in your Google Cloud Console
- Ensure your Supabase project is not paused (free tier projects pause after inactivity)

## Next Steps

After authentication is working:
1. Set up row-level security policies in Supabase
2. Create user profiles table if needed
3. Implement user-specific features in your dashboard
4. Deploy to Vercel with environment variables configured 