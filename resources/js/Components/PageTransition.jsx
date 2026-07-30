import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ children }) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
