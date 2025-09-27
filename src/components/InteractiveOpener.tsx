
"use client";

import { useState, useTransition, Suspense, lazy, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';

const BirthdayCake = lazy(() => import('./BirthdayCake').then(m => ({ default: m.BirthdayCake })));
const BirthdayApp = lazy(() => import('./birthday-app').then(m => ({ default: m.BirthdayApp })));

type Scene = 'card' | 'cake' | 'main_app';

const INTRO_COMPLETED_KEY = 'papas-special-day-intro-completed';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasCompleted = sessionStorage.getItem(INTRO_COMPLETED_KEY);
      if (hasCompleted === 'true') {
        startTransition(() => {
            setScene('main_app');
        });
      }
    }
  }, []);


  const handleCardClick = () => {
    startTransition(() => {
        setScene('cake');
    });
  };

  const handleCandlesBlown = () => {
    startTransition(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(INTRO_COMPLETED_KEY, 'true');
        }
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
            className="relative bg-card shadow-2xl rounded-lg cursor-pointer w-[320px] h-56 sm:w-[400px] sm:h-64 flex items-center justify-center border-2 border-primary/10"
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg">
                <div 
                    className="absolute -top-1/2 left-0 w-full h-full bg-primary/5"
                    style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
                    }}
                />
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-[calc(100%+4px)] bg-accent/30"
                />
                 <div 
                    className="absolute top-0 left-0 w-full h-1/2 border-b-2 border-accent/20"
                />
            </div>
            
            <div className="relative w-4/5 h-4/5 bg-card/90 backdrop-blur-sm rounded-md flex flex-col items-center justify-center text-center p-4 border border-border/50">
                 {isPending ? (
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                 ) : (
                    <>
                        <Mail className="h-12 w-12 text-primary" />
                        <p className="mt-4 font-headline text-xl text-primary">A Special Message</p>
                        <p className="text-sm text-muted-foreground mt-1">Tap to open</p>
                    </>
                 )}
            </div>

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
