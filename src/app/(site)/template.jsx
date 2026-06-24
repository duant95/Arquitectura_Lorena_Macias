'use client';

import { motion } from 'framer-motion';

// Un template se re-monta en cada navegación, así que esta animación corre
// al cambiar de página: una transición suave y editorial (fade + leve subida).
export default function SiteTemplate({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
