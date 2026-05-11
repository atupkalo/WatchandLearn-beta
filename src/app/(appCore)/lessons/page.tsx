import LessonsListClient from "@/components/lessons-list/lessons-list-client";
import { getLessonsList } from "@/lib/lessons";

export default async function Lessons() {
  const lessons = await getLessonsList();

  return (
    <section className="flex h-full flex-col gap-6">
      <LessonsListClient lessons={lessons} />
    </section>
  );
}
