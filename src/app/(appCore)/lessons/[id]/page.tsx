import { notFound } from "next/navigation";
import { getLessonById, getLessonListItemById } from "@/lib/lessons";
import LessonPageClient from "./lesson-page-client";

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
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
      title={lesson.title}
      level={lessonListItem.level}
      category={lessonListItem.category}
      duration={lessonListItem.duration}
      type={lessonListItem.type}
      description={lesson.description.en}
      availableModes={lesson.availableModes}
      videoSrc={lesson.media?.videoFile ?? ""}
      lines={lesson.lines}
    />
  );
}
