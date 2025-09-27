
"use client";

import { useState, useTransition, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';

const BirthdayCake = lazy(() => import('./BirthdayCake').then(m => ({ default: m.BirthdayCake })));
const BirthdayApp = lazy(() => import('./birthday-app').then(m => ({ default: m.BirthdayApp })));

type Scene = 'card' | 'cake' | 'main_app';

function LoadingFallback() {
    return (
        <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
    )
}

export function InteractiveOpener() {
  const [scene, setScene] = useState<Scene>('card');
  const [isPending, startTransition] = useTransition();


  const handleCardClick = () => {
    startTransition(() => {
        setScene('cake');
    });
  };

  const handleCandlesBlown = () => {
    startTransition(() => {
        setScene('main_app');
    });
  };

  return (
    <AnimatePresence mode="wait">
      {scene === 'card' && (
        <motion.div
          key="card"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground p-4"
        >
          <motion.div
            onClick={handleCardClick}
            className="relative bg-card shadow-2xl rounded-lg cursor-pointer w-[320px] h-56 sm:w-[400px] sm:h-64 flex items-center justify-center border-2 border-primary/20"
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute w-full h-full overflow-hidden rounded-lg">
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[200px] sm:border-l-[250px] border-r-[200px] sm:border-r-[250px] border-b-[130px] sm:border-b-[160px] border-b-primary/40"
                    style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
                />
                <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[200px] sm:border-l-[250px] border-r-[200px] sm:border-r-[250px] border-t-[130px] sm:border-t-[160px] border-t-primary/60"
                     style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
                />
            </div>

            <div className="z-10 text-center flex flex-col items-center bg-card/80 backdrop-blur-sm p-6 rounded-full aspect-square">
                {isPending ? <Loader2 className="h-16 w-16 text-primary animate-spin" /> : <Mail className="h-16 w-16 text-primary" /> }
            </div>
            <motion.div 
                className="absolute z-20 bottom-5 text-primary font-headline text-lg"
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
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.7 }}
        >
            <Suspense fallback={<LoadingFallback />}>
                <BirthdayCake onCandlesBlown={handleCandlesBlown} />
            </Suspense>
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
                    className="absolute rounded-full bg-accent/20"
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
            <Suspense fallback={<LoadingFallback />}>
                <BirthdayApp />
            </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
