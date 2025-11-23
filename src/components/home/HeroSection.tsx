interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="mb-12">
      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 p-8 flex items-end shadow-xl">
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-2 text-white">
            {title}
          </h2>
          <p className="text-lg text-white/90">{subtitle}</p>
        </div>
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </section>
  );
}
