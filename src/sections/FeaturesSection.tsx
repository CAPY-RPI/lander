import { AnimatedPanel } from "../components/AnimatedPanel";
import { GlassCard } from "../components/GlassCard";
import { primaryCards } from "../data/content";

export function FeaturesSection() {
  return (
    <AnimatedPanel className="panel featuresPanel" id="features" staggerIndex={1}>
      {primaryCards.map((card, index) => (
        <GlassCard
          key={card.title}
          title={card.title}
          body={card.body}
          className={card.className}
          staggerIndex={index}
        />
      ))}
    </AnimatedPanel>
  );
}
