import { motion } from "framer-motion";

export function InterfaceSection() {
  return (
    <motion.section
      className="panel interfacePanel"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.4, once: true }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2>imagine our interface is here</h2>
      <p className="interfaceSub">(and whatever you do, don&apos;t think about ramen)</p>
      <p className="interfaceFoot">jokes aside, come back on May 1st</p>
    </motion.section>
  );
}
