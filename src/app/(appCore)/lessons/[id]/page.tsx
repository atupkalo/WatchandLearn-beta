interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  return (
    <section className="flex h-full flex-col items-center justify-between">
      Lesson {id}
    </section>
  );
}
