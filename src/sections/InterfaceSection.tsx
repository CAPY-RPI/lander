import { AnimatedPanel } from "../components/AnimatedPanel";

export function InterfaceSection() {
  return (
    <AnimatedPanel className="panel interfacePanel" staggerIndex={2}>
      <h2>imagine our interface is here</h2>
      <p className="interfaceSub">(and whatever you do, don&apos;t think about ramen)</p>
      <p className="interfaceFoot">jokes aside, come back on May 1st</p>
    </AnimatedPanel>
  );
}
