import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getLessonLikeSnapshots,
  toggleLessonLikeForUser,
} from "@/lib/lesson-likes";

function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message === "Unauthorized";
}

function normalizeLessonIds(lessonIds: string[]) {
  return Array.from(new Set(lessonIds.map((lessonId) => lessonId.trim()).filter(Boolean)));
}

function getEmptySnapshots(lessonIds: string[]) {
  return normalizeLessonIds(lessonIds).reduce<
    Record<string, { lessonId: string; likeCount: number; liked: boolean }>
  >((accumulator, lessonId) => {
    accumulator[lessonId] = {
      lessonId,
      likeCount: 0,
      liked: false,
    };

    return accumulator;
  }, {});
}

function isLessonLikesStorageMissing(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCode = "code" in error ? error.code : undefined;
  const maybeMessage = "message" in error ? error.message : undefined;
  const message = typeof maybeMessage === "string" ? maybeMessage : "";

  return (
    maybeCode === "42P01" ||
    message.includes("lesson_likes") &&
      (
        message.includes("does not exist") ||
        message.includes("Could not find the table")
      )
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lessonIds = [
    ...url.searchParams.getAll("lessonId"),
    ...(
      url.searchParams
        .get("lessonIds")
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? []
    ),
  ];

  if (!lessonIds.length) {
    return NextResponse.json(
      { error: "At least one lessonId is required." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();

  try {
    const snapshots = await getLessonLikeSnapshots(cookieStore, lessonIds);

    return NextResponse.json(
      { snapshots },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isLessonLikesStorageMissing(error)) {
      return NextResponse.json(
        { snapshots: getEmptySnapshots(lessonIds) },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    console.error("Failed to load lesson likes.", error);

    return NextResponse.json(
      { error: "Failed to load lesson likes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { lessonId?: string }
    | null;

  if (!body?.lessonId) {
    return NextResponse.json(
      { error: "lessonId is required." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();

  try {
    const snapshot = await toggleLessonLikeForUser(cookieStore, body.lessonId);

    return NextResponse.json(
      { snapshot },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isLessonLikesStorageMissing(error)) {
      return NextResponse.json(
        { error: "Lesson likes storage is not available yet." },
        { status: 503 },
      );
    }

    console.error("Failed to toggle lesson like.", error);

    return NextResponse.json(
      { error: "Failed to toggle lesson like." },
      { status: 500 },
    );
  }
}
