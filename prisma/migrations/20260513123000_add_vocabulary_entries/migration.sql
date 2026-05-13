create table if not exists public.vocabulary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  lesson_slug text not null,
  line_number integer not null,
  token_id text not null,
  word text not null,
  normalized text not null,
  translation_ua text not null,
  translation_ru text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, lesson_id, token_id)
);

create index if not exists vocabulary_entries_user_id_idx
  on public.vocabulary_entries (user_id);

create index if not exists vocabulary_entries_created_at_idx
  on public.vocabulary_entries (created_at desc);

alter table public.vocabulary_entries enable row level security;

create policy "Users can read own vocabulary"
on public.vocabulary_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own vocabulary"
on public.vocabulary_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own vocabulary"
on public.vocabulary_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own vocabulary"
on public.vocabulary_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);
