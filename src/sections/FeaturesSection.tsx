import { GlassCard } from "../components/GlassCard";
import { primaryCards } from "../data/content";

export function FeaturesSection() {
  return (
    <section className="panel featuresPanel" id="features">
      {primaryCards.map((card) => (
        <GlassCard key={card.title} title={card.title} body={card.body} className={card.className} />
      ))}
    </section>
  );
}
