'use client';

import { Label, Radio, RadioGroup } from "@heroui/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function RadioLanguages() {
  const locale = useLocale();
  const router = useRouter();

  function changeLocale(nextLocale: 'en' | 'uk') {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <RadioGroup
      orientation="horizontal"
      value={locale}
      onChange={(value) => changeLocale(String(value) as 'en' | 'uk')}
      name="language"
      className="flex gap-3"
    >
      {/* EN */}
      <Radio value="en" >
        <Radio.Control>
          <Radio.Indicator />
        </Radio.Control>
        <Radio.Content>
          <Label
            className={`cursor-pointer ${
              locale === "en" ? "text-white" : "text-gray-300"
            }`}
          >
            EN
          </Label>
        </Radio.Content>
      </Radio>

      {/* UA */}
      <Radio value="uk" >
        <Radio.Control>
          <Radio.Indicator />
        </Radio.Control>
        <Radio.Content>
          <Label
            className={`cursor-pointer ${
              locale === "uk" ? "text-white" : "text-gray-300"
            }`}
          >
            UA
          </Label>
        </Radio.Content>
      </Radio>
    </RadioGroup>
  );
}