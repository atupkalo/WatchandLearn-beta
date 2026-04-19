import ButtonCustom from "../ui/button";
import Container from "../common/container";
import Logo from "../common/logo";
import RadioLanguages from "../ui/radio-languages";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import Title from "../ui/title";

export default function HeaderMarketing() {
    const t = useTranslations('Header');
  return (
    <header className="bg-[#D6E4E6] text-white p-4">
      <Container>
          <div className="flex flex-row justify-between items-center">
            <Link href="/" className="flex flex-row gap-2">
              <Logo size="lg" />
              <Title tag={"h4"} size={24}><span>Watch and Learn</span></Title>
            </Link>
          <div className="flex flex-row min-w-100 justify-between items-center">
            <RadioLanguages />
            <div className="flex flex-row gap-6 items-center">
              <Link href="/signup">
                  <ButtonCustom size="md"  label={t('btnSignUp')}  variant="accent"/>
              </Link>
                <ButtonCustom size="md" label={t('btnSLogin')}  variant="secondary"/>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}