import { cookies } from "next/headers";
import LessonsListClient from "@/components/lessons-list/lessons-list-client";
import { getLessonsList } from "@/lib/lessons";
import { getUserOrNull } from "@/utils/supabase/server";

export default async function Lessons() {
  const cookieStore = await cookies();
  const user = await getUserOrNull(cookieStore);
  const lessons = await getLessonsList();

  return (
    <section className="flex h-full flex-col gap-6">
      <LessonsListClient lessons={lessons} userId={user?.id ?? null} />
    </section>
  );
}
