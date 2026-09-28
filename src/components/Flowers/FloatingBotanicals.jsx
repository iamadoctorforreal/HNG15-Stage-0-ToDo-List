import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LavenderFlower, RoseFlower, DaffodilFlower } from './BotanicalSVGs';
import { sounds } from '../../utils/soundEffects';

// Floating flower configuration with positions, scales, rotation, and animation delays
const BOTANICAL_NODES = [
  { id: 'f1', type: 'rose', top: '8%', left: '4%', scale: 0.9, rotate: -8, duration: 16, delay: 0 },
  { id: 'f2', type: 'lavender', top: '15%', right: '6%', scale: 0.85, rotate: 12, duration: 18, delay: 2 },
  { id: 'f3', type: 'daffodil', top: '48%', left: '3%', scale: 0.8, rotate: 6, duration: 20, delay: 1 },
  { id: 'f4', type: 'lavender', top: '55%', right: '4%', scale: 0.95, rotate: -15, duration: 17, delay: 3 },
  { id: 'f5', type: 'rose', bottom: '6%', left: '8%', scale: 0.85, rotate: 10, duration: 19, delay: 1.5 },
  { id: 'f6', type: 'daffodil', bottom: '8%', right: '8%', scale: 0.9, rotate: -6, duration: 21, delay: 2.5 },
  // Subtle middle background items
  { id: 'f7', type: 'lavender', top: '32%', left: '14%', scale: 0.55, rotate: 20, duration: 24, delay: 4, subtle: true },
  { id: 'f8', type: 'rose', top: '28%', right: '16%', scale: 0.5, rotate: -22, duration: 22, delay: 5, subtle: true },
  { id: 'f9', type: 'daffodil', bottom: '26%', left: '16%', scale: 0.55, rotate: 15, duration: 25, delay: 3.5, subtle: true },
];

export const FloatingBotanicals = () => {
  const [ripples, setRipples] = useState({});

  const handleFlowerHover = (nodeId) => {
    // Play leaf rustle sound
    sounds.playRustle();

    // Trigger ripple pulse
    setRipples(prev => ({
      ...prev,
      [nodeId]: (prev[nodeId] || 0) + 1
    }));
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {BOTANICAL_NODES.map((node) => {
        const FlowerComp =
          node.type === 'rose'
            ? RoseFlower
            : node.type === 'daffodil'
            ? DaffodilFlower
            : LavenderFlower;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              top: node.top,
              left: node.left,
              right: node.right,
              bottom: node.bottom,
            }}
            className="flex items-center justify-center"
          >
            {/* Interactive & Animated Flower Wrapper */}
            <motion.div
              className={`relative cursor-pointer pointer-events-auto transition-opacity duration-700 ${
                node.subtle
                  ? 'opacity-25 dark:opacity-15 hover:opacity-70 dark:hover:opacity-60'
                  : 'opacity-40 dark:opacity-30 hover:opacity-95 dark:hover:opacity-85'
              }`}
              style={{
                scale: node.scale,
                rotate: node.rotate,
              }}
              animate={{
                y: [0, -18, 4, 0],
                x: [0, 8, -6, 0],
                rotate: [node.rotate, node.rotate + 4, node.rotate - 4, node.rotate],
              }}
              transition={{
                duration: node.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: node.delay,
              }}
              whileHover={{
                scale: node.scale * 1.14,
                transition: { type: 'spring', stiffness: 350, damping: 18 },
              }}
              onMouseEnter={() => handleFlowerHover(node.id)}
            >
              {/* Expanding Ripple waves on hover */}
              <AnimatePresence>
                {ripples[node.id] && (
                  <motion.div
                    key={ripples[node.id]}
                    initial={{ scale: 0.6, opacity: 0.8 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="absolute inset-0 m-auto w-24 h-24 rounded-full border-2 border-pink-400/40 dark:border-purple-400/30 bg-pink-300/10 dark:bg-purple-500/10 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Flower SVG */}
              <div className="filter drop-shadow-sm hover:drop-shadow-md transition-all duration-300">
                <FlowerComp />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
