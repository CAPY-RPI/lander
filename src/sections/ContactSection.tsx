import { motion } from "framer-motion";

export function ContactSection() {
  return (
    <motion.section
      className="panel contactPanel"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35, once: true }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2>say hello</h2>
      <p className="contactLead">we&apos;re capy to hear from you</p>
      <a className="emailPill" href="mailto:hello@capyrpi.org">
        hello@capyrpi.org
      </a>
      <p className="contactMeta">we&apos;re also reachable via discord</p>
    </motion.section>
  );
}
