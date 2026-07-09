import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getLessonLikeSnapshots,
  toggleLessonLikeForUser,
} from "@/lib/lesson-likes";

function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message === "Unauthorized";
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

    console.error("Failed to toggle lesson like.", error);

    return NextResponse.json(
      { error: "Failed to toggle lesson like." },
      { status: 500 },
    );
  }
}
