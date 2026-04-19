import Hero from "../../components/hero/hero";

export default function Home() {
  return (
    <section className="flex flex-col justify-between">
      <div className="hero-warp">
        <Hero />
      </div>
    </section>
  );
}
