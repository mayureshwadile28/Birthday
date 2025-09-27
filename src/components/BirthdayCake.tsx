
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import Image from 'next/image';
import { Mic, Wind, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type BirthdayCakeProps = {
  onCandlesBlown: () => void;
};

// A simple, stylized SVG flame component
const Flame = ({ i, style }: { i: number, style: React.CSSProperties }) => (
  <motion.div
    className="absolute"
    style={style}
    initial={{ scaleY: 1, opacity: 1 }}
    animate={{
      scaleY: [1, 1.05, 1, 0.95, 1],
      opacity: [1, 0.9, 1, 0.95, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "mirror",
        delay: i * 0.2,
      },
    }}
    exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.3, delay: i * 0.05 } }}
  >
    <div className="w-4 h-6 bg-amber-400 rounded-t-full rounded-b-sm" style={{ clipPath: 'ellipse(50% 50% at 50% 50%)' }} />
  </motion.div>
);


export function BirthdayCake({ onCandlesBlown }: BirthdayCakeProps) {
  const [blewOut, setBlewOut] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const hasRequestedMic = useRef(false);

  useEffect(() => {
    // Automatically request microphone access when the component mounts.
    if (!hasRequestedMic.current) {
      startListening();
      hasRequestedMic.current = true;
    }

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Media devices are not supported in this browser.");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission('granted');
      setIsListening(true);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      detectBlow();

    } catch (err) {
      console.error('Mic access denied:', err);
      setMicPermission('denied');
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please enable microphone access in your browser settings to blow out the candles.",
      });
    }
  };

  const detectBlow = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const check = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

      // Increased threshold for more robust detection
      if (avg > 40 && !blewOut) { 
        console.log("Blow detected!", avg);
        setBlewOut(true);
        setIsListening(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setTimeout(onCandlesBlown, 2000); // Wait for animation
      } else {
        if (!blewOut) {
          animationFrameRef.current = requestAnimationFrame(check);
        }
      }
    };
    if (!blewOut) {
      animationFrameRef.current = requestAnimationFrame(check);
    }
  };

  const candlePositions = [
    { top: '23%', left: '33%' },
    { top: '16%', left: '40.5%' },
    { top: '23%', left: '48%' },
    { top: '10%', left: '55.5%' },
    { top: '19%', left: '63%' },
    { top: '8%', left: '70.5%' },
    { top: '19%', left: '78%' },
    { top: '12%', left: '85.5%' },
  ];


  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-headline text-primary">Make a Wish!</h2>
        {micPermission === 'granted' && isListening && !blewOut && (
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2 animate-pulse">
            <Wind className="h-5 w-5" /> Blow into your mic to make your wish...
          </p>
        )}
        {micPermission === 'prompt' && !blewOut &&(
          <p className="text-muted-foreground mt-2">
            Waiting for microphone permission...
          </p>
        )}
      </motion.div>

      <div className="relative w-full max-w-sm aspect-[4/3]">
        <Image
          src="https://storage.googleapis.com/project-1-12862837332/uploads/2024-08-28/3d22c9a9-3c77-4c70-9831-50e505a74e50.png"
          alt="Birthday cake with candles"
          fill
          priority
          className="object-contain"
        />
        
        {/* Candles Flames */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {!blewOut &&
              candlePositions.map((style, i) => (
                <Flame key={i} i={i} style={style} />
              ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 text-center h-20">
        <AnimatePresence>
        {blewOut && (
            <motion.p 
                key="wish-granted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-2xl font-headline text-accent"
            >
                Wish granted!
            </motion.p>
        )}
        </AnimatePresence>
        {micPermission === 'denied' && (
          <Alert variant="destructive" className="max-w-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Microphone Required</AlertTitle>
            <AlertDescription>
              Please enable microphone access in your browser to blow out the candles.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
