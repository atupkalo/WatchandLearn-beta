import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getUserDisplayName } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const t = await getTranslations("Misc");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex h-full min-h-0 flex-col">
      <h1 className="text-2xl font-semibold text-[var(--textBody)]">
        {t("homePgaeTitle")} {getUserDisplayName(user)}
      </h1>
    </section>
  );
}
