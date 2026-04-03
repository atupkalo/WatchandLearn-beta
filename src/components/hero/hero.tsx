'use client';

import { useTranslations } from 'next-intl';
import ButtonCustom from '../ui/button';
import Title from '../ui/title';


export default function Hero() {
    const t = useTranslations('Hero');
    
  return (
    <section className="relative hero flex flex-col pt-12 items-stretch justify-start overflow-hidden">
      <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  controls={false}
            className="absolute right-0 top-1/2 pointer-events-none -translate-y-1/2 h-[90%] w-auto object-contain"
      >
        <source src="/Bg-animation.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-white/20" />

          <div className="relative z-10 flex flex-col gap-32">
        <div className="w-1/2">
          <Title className="text-center mb-4" weight="font-bold" size={64}>
            <span>{t('description')}</span>
          </Title>

          <h1 className="text-center text-[var(--textBody)] text-3xl">
            {t('h1')}
          </h1>
        </div>

        <div className="flex flex-col w-1/2 justify-center items-center gap-4">
          <h2 className="text-base w-[420px] text-center text-[var(--textBody)]">
            {t('h2')}
          </h2>

          <ButtonCustom
            size="lg"
            label={t('CTA')}
            variant="primary"
            className="p-6 text-xl shadow-[inset_4px_4px_6px_rgba(255,255,255,0.4)]"
          />
        </div>
      </div>
    </section>
  );
}