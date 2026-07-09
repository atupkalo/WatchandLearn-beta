import { cookies } from "next/headers";
import { createClient, getUserOrNull } from "@/utils/supabase/server";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

interface LessonLikeRow {
  id?: string;
  lesson_id: string;
  user_id: string;
}

export interface LessonLikeSnapshot {
  lessonId: string;
  likeCount: number;
  liked: boolean;
}

export async function getLessonLikeSnapshots(
  cookieStore: CookieStore,
  lessonIds: string[],
) {
  const normalizedLessonIds = Array.from(
    new Set(lessonIds.map((lessonId) => lessonId.trim()).filter(Boolean)),
  );

  if (!normalizedLessonIds.length) {
    return {};
  }

  const user = await getUserOrNull(cookieStore);

  if (!user) {
    throw new Error("Unauthorized");
  }

  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("lesson_likes")
    .select("lesson_id,user_id")
    .in("lesson_id", normalizedLessonIds);

  if (error) {
    throw error;
  }

  const likes = (data ?? []) as LessonLikeRow[];

  return normalizedLessonIds.reduce<Record<string, LessonLikeSnapshot>>(
    (accumulator, lessonId) => {
      const lessonLikes = likes.filter((like) => like.lesson_id === lessonId);

      accumulator[lessonId] = {
        lessonId,
        likeCount: lessonLikes.length,
        liked: lessonLikes.some((like) => like.user_id === user.id),
      };

      return accumulator;
    },
    {},
  );
}

export async function toggleLessonLikeForUser(
  cookieStore: CookieStore,
  lessonId: string,
) {
  const normalizedLessonId = lessonId.trim();

  if (!normalizedLessonId) {
    throw new Error("Lesson id is required");
  }

  const user = await getUserOrNull(cookieStore);

  if (!user) {
    throw new Error("Unauthorized");
  }

  const supabase = createClient(cookieStore);
  const { data: existingRows, error: existingError } = await supabase
    .from("lesson_likes")
    .select("id")
    .eq("lesson_id", normalizedLessonId)
    .eq("user_id", user.id)
    .limit(1);

  if (existingError) {
    throw existingError;
  }

  const isLiked = (existingRows?.length ?? 0) > 0;

  if (isLiked) {
    const { error: deleteError } = await supabase
      .from("lesson_likes")
      .delete()
      .eq("lesson_id", normalizedLessonId)
      .eq("user_id", user.id);

    if (deleteError) {
      throw deleteError;
    }
  } else {
    const { error: insertError } = await supabase.from("lesson_likes").insert({
      lesson_id: normalizedLessonId,
      user_id: user.id,
    });

    if (insertError) {
      throw insertError;
    }
  }

  const { count, error: countError } = await supabase
    .from("lesson_likes")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", normalizedLessonId);

  if (countError) {
    throw countError;
  }

  return {
    lessonId: normalizedLessonId,
    likeCount: count ?? 0,
    liked: !isLiked,
  } satisfies LessonLikeSnapshot;
}
