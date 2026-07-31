import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getLessonById, getLessonListItemById } from "@/lib/lessons";
import { getUserOrNull } from "@/utils/supabase/server";
import LessonPageClient from "./lesson-page-client";

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const cookieStore = await cookies();
  const user = await getUserOrNull(cookieStore);
  const { id } = await params;
  const lesson = await getLessonById(id);
  const lessonListItem = await getLessonListItemById(id);

  if (!lesson || !lessonListItem) {
    notFound();
  }

  return (
    <LessonPageClient
      lessonId={lesson.id}
      lessonSlug={lesson.slug}
      userId={user?.id ?? null}
      title={lesson.title}
      level={lessonListItem.level}
      category={lessonListItem.category}
      duration={lessonListItem.duration}
      type={lessonListItem.type}
      description={lesson.description.en}
      videoSrc={lesson.media?.videoFile ?? ""}
      lines={lesson.lines}
      sayIt={lesson.sayIt ?? []}
      translateIt={lesson.translateIt ?? []}
    />
  );
}
