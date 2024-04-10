import { motion } from "framer-motion";

export default function Reveal({ children, styles }) {
  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1, delay: 0.25 }}
        style={styles}
      >
        {children}
      </motion.div>
    </>
  );
}
