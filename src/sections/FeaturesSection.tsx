import { AnimatedPanel } from "../components/AnimatedPanel";
import { GlassCard } from "../components/GlassCard";
import { primaryCards } from "../data/content";

const cardPositions = ["card-col1-row1", "card-col2-row1", "card-col2-row2", "card-col1-row2-span2", "card-col2-row3"];

export function FeaturesSection() {
  return (
    <AnimatedPanel className="panel featuresPanel" id="features" staggerIndex={1}>
      {primaryCards.map((card, index) => (
        <GlassCard
          key={card.title}
          title={card.title}
          body={card.body}
          className={cardPositions[index] || ""}
          staggerIndex={index}
        />
      ))}
    </AnimatedPanel>
  );
}
