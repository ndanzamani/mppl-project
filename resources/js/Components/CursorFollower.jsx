import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function CursorFollower() {
    const shouldReduceMotion = useReducedMotion();
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (shouldReduceMotion) return;

        const updateMouse = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!visible) setVisible(true);
        };

        window.addEventListener('mousemove', updateMouse);
        return () => window.removeEventListener('mousemove', updateMouse);
    }, [shouldReduceMotion]);

    if (shouldReduceMotion || !visible) return null;

    return (
        <motion.div
            className="fixed pointer-events-none z-50 w-8 h-8 rounded-full bg-amber-400/20 blur-md border border-amber-400/30"
            animate={{
                x: mousePosition.x - 16,
                y: mousePosition.y - 16,
            }}
            transition={{
                type: 'spring',
                damping: 25,
                stiffness: 250,
                mass: 0.2,
            }}
        />
    );
}
