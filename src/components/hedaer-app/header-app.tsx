import AvatarCustom from "@/components/ui/avatar-custom";
import Logo from "../common/logo";
import AdBanner from "@/components/ad-banner/ad-banner";
import RadioLanguages from "../ui/radio-languages";
import Link from "next/link";

export default function HeaderApp() {
  return (
    <header className="header-app w-full pl-8 pr-8 bg-[var(--primary200)] flex items-center justify-between px-4">
      
      <Link href="/home"> <Logo size="md" /></Link>

      <div className="flex-1 max-w-150 mx-4">
        <AdBanner />
      </div>

      <div className="flex w-50 flex-row justify-between items-center">
              <RadioLanguages />
              <div className="cursor-pointer">
              <AvatarCustom
                    size="sm"
                    shape="circle"
                    initials="AA"
                    src="https://i.pravatar.cc/150?img=3"
                    alt="User Avatar"
                />
              </div>
      </div>
    </header>
  );
}
