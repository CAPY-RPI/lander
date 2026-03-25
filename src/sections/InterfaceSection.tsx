import { AnimatedPanel } from "../components/AnimatedPanel";
import { StaggerWords } from "../components/StaggerWords";

export function InterfaceSection() {
  return (
    <AnimatedPanel className="panel interfacePanel" staggerIndex={2}>
      <div className="interfaceContent">
        <h2>
          <StaggerWords text="imagine our interface is here" baseDelay={0.1} />
        </h2>
        <p className="interfaceSub">
          <StaggerWords text="(and whatever you do, don't think about ramen)" baseDelay={0.24} />
        </p>
        <p className="interfaceFoot">
          <StaggerWords text="jokes aside, come back on May 1st" baseDelay={0.36} />
        </p>
      </div>
    </AnimatedPanel>
  );
}
