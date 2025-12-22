## Flowva Rewards (React + Supabase)

Recreation of FlowvaHub's Rewards experience with Supabase auth and a responsive, modern UI. Users can sign up/in via Supabase, log wins, toggle completion, and see redeemable perks.

### Stack
- React + Vite
- Supabase (auth, Postgres, RLS)
- react-icons

### Prerequisites
- Node 18+
- Supabase project with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Environment
Create `.env` in the project root:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database setup (SQL)
Run in Supabase SQL editor:

```
-- Rewards table
create table if not exists public.rewards (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references auth.users(id) on delete cascade,
	title text not null,
	description text,
	points integer default 0,
	completed boolean default false,
	icon text default 'star',
	date date default now(),
	created_at timestamptz default now()
);

alter table public.rewards enable row level security;

-- Policies: users can CRUD only their rows
create policy if not exists "rewards-select-own" on public.rewards
	for select using (auth.uid() = user_id);

create policy if not exists "rewards-insert-own" on public.rewards
	for insert with check (auth.uid() = user_id);

create policy if not exists "rewards-update-own" on public.rewards
	for update using (auth.uid() = user_id);

create policy if not exists "rewards-delete-own" on public.rewards
	for delete using (auth.uid() = user_id);

-- Redemptions table
create table if not exists public.redemptions (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references auth.users(id) on delete cascade,
	item_id text not null,
	title text not null,
	cost integer not null,
	status text default 'completed', -- completed | pending | canceled
	created_at timestamptz default now()
);

alter table public.redemptions enable row level security;

create policy if not exists "redemptions-select-own" on public.redemptions
	for select using (auth.uid() = user_id);

create policy if not exists "redemptions-insert-own" on public.redemptions
	for insert with check (auth.uid() = user_id);

create policy if not exists "redemptions-update-own" on public.redemptions
	for update using (auth.uid() = user_id);

create policy if not exists "redemptions-delete-own" on public.redemptions
	for delete using (auth.uid() = user_id);
```

### Run locally
```
npm install
npm run dev
```
Open the printed localhost URL.

### Deployment
- Set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your host (Vercel/Netlify/etc.).
- Build with `npm run build`.

### Notes / assumptions
- Email confirmation must be enabled in Supabase for sign-up flows (or disable confirmations in Supabase settings during testing).
- Empty/error/loading states are handled in the rewards view.
- Icons are stored per reward row as a short key (e.g., `star`, `code`, `fire`).
