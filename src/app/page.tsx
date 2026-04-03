import { useTranslations } from 'next-intl';
import Hero from '../components/hero/hero';
import Container from '@/components/common/container';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <main className="flex flex-col justify-between">
      <div className="hero-warp">
        <Container >
          <Hero />
        </Container>
      </div>
    </main>
  );
}