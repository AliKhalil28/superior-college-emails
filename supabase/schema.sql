-- ==============================================================================
-- Superior Mail: Database Schema for Supabase & Hostinger Integration
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/ycitjeymccngunjnvsgl/sql)
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Mailboxes / Staff Profiles Table
create table if not exists public.mailboxes (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  display_name text not null,
  role text default 'Staff Member',
  department text default 'Academics',
  initials varchar(5) not null,
  avatar_color text default 'bg-emerald-700',
  aliases text[] default '{}',
  default_from text,
  signature text,
  vacation_enabled boolean default false,
  vacation_message text default 'Thank you for your email. I am currently away and will reply on my return.',
  storage_used_bytes bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Cached / Synced Emails Table (synchronized with Hostinger IMAP)
create table if not exists public.emails (
  id text primary key, -- Uses IMAP Message-ID or generated UUID
  mailbox_id uuid references public.mailboxes(id) on delete cascade not null,
  folder text not null check (folder in ('inbox', 'starred', 'sent', 'drafts', 'archive', 'spam', 'trash')),
  from_name text not null,
  from_email text not null,
  from_initials varchar(5),
  from_color text default 'bg-emerald-700',
  to_address text not null,
  cc_address text,
  bcc_address text,
  subject text not null default '(no subject)',
  snippet text,
  body text[], -- Body paragraphs or split text
  body_html text,
  unread boolean default true,
  starred boolean default false,
  has_attachment boolean default false,
  attachments jsonb default '[]'::jsonb,
  labels text[] default '{}',
  category text default 'primary' check (category in ('primary', 'promotions', 'social')),
  date_label text default 'Today',
  time_label text,
  received_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 4. Custom Labels Table
create table if not exists public.labels (
  id uuid primary key default uuid_generate_v4(),
  mailbox_id uuid references public.mailboxes(id) on delete cascade not null,
  name text not null,
  color text not null,
  created_at timestamptz default now(),
  unique(mailbox_id, name)
);

-- 5. Indexes for High-Performance Queries & Search
create index if not exists idx_emails_mailbox_folder on public.emails(mailbox_id, folder);
create index if not exists idx_emails_received_at on public.emails(received_at desc);
create index if not exists idx_emails_search on public.emails using gin (to_tsvector('english', subject || ' ' || coalesce(snippet, '')));

-- 6. Enable Row Level Security (RLS)
alter table public.mailboxes enable row level security;
alter table public.emails enable row level security;
alter table public.labels enable row level security;

-- Permissive policy for authenticated staff (or service role)
create policy "Allow read mailboxes" on public.mailboxes for select using (true);
create policy "Allow read emails" on public.emails for select using (true);
create policy "Allow insert emails" on public.emails for insert with check (true);
create policy "Allow update emails" on public.emails for update using (true);
create policy "Allow delete emails" on public.emails for delete using (true);
create policy "Allow all on labels" on public.labels for all using (true);

-- 7. Seed Initial Staff Mailboxes (Matches mock data & Hostinger accounts)
insert into public.mailboxes (email, display_name, role, department, initials, avatar_color, aliases, default_from, signature)
values
  (
    'ali.khalil@superiorcollegemc.com',
    'Ali Khalil',
    'IT Incharge',
    'Information Technology',
    'AK',
    'bg-[#0b3d2a]',
    array['ali.khalil@superiorcollegemc.com', 'it@superiorcollegemc.com', 'info@superiorcollegemc.com'],
    'ali.khalil@superiorcollegemc.com',
    E'\n\n--\nAli Khalil\nIT Incharge\nSuperior College Mian Channu'
  ),
  (
    'principal@superiorcollegemc.com',
    'Principal Office',
    'Principal',
    'Administration',
    'PO',
    'bg-emerald-700',
    array['principal@superiorcollegemc.com'],
    'principal@superiorcollegemc.com',
    E'\n\n--\nOffice of the Principal\nSuperior College Mian Channu'
  )
on conflict (email) do nothing;
