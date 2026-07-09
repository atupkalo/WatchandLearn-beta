create table if not exists public.lesson_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, lesson_id)
);

create index if not exists lesson_likes_lesson_id_idx
  on public.lesson_likes (lesson_id);

create index if not exists lesson_likes_created_at_idx
  on public.lesson_likes (created_at desc);

alter table public.lesson_likes enable row level security;

create policy "Authenticated users can read lesson likes"
on public.lesson_likes
for select
to authenticated
using (true);

create policy "Users can insert own lesson likes"
on public.lesson_likes
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete own lesson likes"
on public.lesson_likes
for delete
to authenticated
using ((select auth.uid()) = user_id);
