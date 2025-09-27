
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import { BirthdayApp } from './birthday-app';
import { BirthdayCake } from './BirthdayCake';

type Scene = 'card' | 'cake' | 'main_app';

export function InteractiveOpener() {
  const [scene, setScene] = useState<Scene>('card');

  const handleCardClick = () => {
    setScene('cake');
  };

  const handleCandlesBlown = () => {
    setScene('main_app');
  };

  return (
    <AnimatePresence>
      {scene === 'card' && (
        <motion.div
          key="card"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground"
        >
          <motion.div
            onClick={handleCardClick}
            className="relative bg-card shadow-2xl rounded-lg cursor-pointer w-72 h-48 flex items-center justify-center border-2 border-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute w-full h-full">
              <div
                className="absolute top-0 left-0 w-0 h-0 border-l-[144px] border-r-[144px] border-b-[96px] border-b-primary/40 border-l-transparent border-r-transparent transform"
                style={{ borderLeftWidth: '144px', borderRightWidth: '144px', borderBottomWidth: '96px' }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-0 h-0 border-l-[144px] border-r-[144px] border-t-[96px] border-t-primary/60 border-l-transparent border-r-transparent"
                style={{ borderLeftWidth: '144px', borderRightWidth: '144px', borderTopWidth: '96px' }}
              ></div>
            </div>
            <div className="z-10 text-center bg-card/80 backdrop-blur-sm p-4 rounded-full">
                <Mail className="h-16 w-16 text-primary" />
            </div>
            <motion.div 
                className="absolute z-20 bottom-4 text-primary font-headline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Tap to open
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {scene === 'cake' && (
        <motion.div
          key="cake"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <BirthdayCake onCandlesBlown={handleCandlesBlown} />
        </motion.div>
      )}

      {scene === 'main_app' && (
         <motion.div
            key="main_app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
        >
            <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-primary/20"
                    initial={{
                        x: Math.random() * 100 + 'vw',
                        y: 110 + 'vh',
                        scale: Math.random() * 1.5 + 0.5,
                        opacity: Math.random() * 0.5 + 0.3,
                    }}
                    animate={{ y: -20 + 'vh' }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: Math.random() * 5,
                        ease: 'linear',
                    }}
                    style={{
                        width: `${Math.random() * 100 + 50}px`,
                        height: `${Math.random() * 100 + 50}px`,
                    }}
                />
                ))}
            </div>
            <BirthdayApp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
