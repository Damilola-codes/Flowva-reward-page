# Supabase Setup Guide for Reward Page

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a new account
3. Click "New Project"
4. Fill in the project details:
   - Project name: `flowva-reward-page`
   - Database password: (save this securely)
   - Region: (choose the closest to your location)
5. Wait for the project to be created (5-10 minutes)

## 2. Get Your Credentials

1. In your Supabase dashboard, go to **Project Settings** > **API**
2. Copy:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon public** key → This is your `VITE_SUPABASE_ANON_KEY`
3. Update your `.env.local` file with these values

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL:

### Create Users Profile Table (optional, for storing additional user data)

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Create Rewards Table

```sql
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own rewards"
  ON rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rewards"
  ON rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards"
  ON rewards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rewards"
  ON rewards FOR DELETE
  USING (auth.uid() = user_id);
```

## 4. Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** (should be enabled by default)
3. Optionally, enable other providers like Google, GitHub, etc.

## 5. Update Your App

The project already includes:
- `src/lib/supabaseClient.js` - Supabase client configuration
- `src/contexts/AuthContext.jsx` - Authentication context provider
- `src/hooks/useRewards.js` - Custom hook for rewards operations

### Update your `App.jsx`:

```jsx
import { AuthProvider } from './contexts/AuthContext'
import YourComponent from './YourComponent'

function App() {
  return (
    <AuthProvider>
      <YourComponent />
    </AuthProvider>
  )
}

export default App
```

## 6. Use Authentication and Database in Components

### Using Authentication:

```jsx
import { useAuth } from './contexts/AuthContext'

function LoginComponent() {
  const { signIn, signUp, signOut, user, loading } = useAuth()

  const handleSignUp = async (email, password) => {
    const { data, error } = await signUp(email, password)
    if (error) console.error('Sign up error:', error)
  }

  const handleSignIn = async (email, password) => {
    const { data, error } = await signIn(email, password)
    if (error) console.error('Sign in error:', error)
  }

  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={() => handleSignUp('user@example.com', 'password')}>
            Sign Up
          </button>
          <button onClick={() => handleSignIn('user@example.com', 'password')}>
            Sign In
          </button>
        </div>
      )}
    </div>
  )
}
```

### Using Rewards:

```jsx
import { useRewards } from './hooks/useRewards'

function RewardsComponent() {
  const { rewards, loading, addReward, updateReward, deleteReward } = useRewards()

  const handleAddReward = async () => {
    await addReward({
      title: 'New Reward',
      description: 'This is a new reward',
      points: 100,
    })
  }

  return (
    <div>
      <button onClick={handleAddReward}>Add Reward</button>
      {loading ? <p>Loading rewards...</p> : null}
      <ul>
        {rewards.map((reward) => (
          <li key={reward.id}>
            {reward.title} - {reward.points} points
            <button onClick={() => deleteReward(reward.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## 7. Testing

- Run `npm run dev` to start the development server
- Test the authentication flow
- Test creating, updating, and deleting rewards

## Security Notes

- Never commit `.env.local` to version control (it's already in `.gitignore` if set up)
- The `VITE_SUPABASE_ANON_KEY` is safe to expose (it's designed to be public)
- Row Level Security (RLS) ensures users can only access their own data
- Keep your database password secure

## Troubleshooting

- If you get CORS errors, check your Supabase project URL matches your local dev URL
- If authentication isn't working, verify your `.env.local` variables are set correctly
- Check the browser console and Supabase dashboard logs for error details
