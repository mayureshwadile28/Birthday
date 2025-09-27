
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Mic, Wind } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type BirthdayCakeProps = {
  onCandlesBlown: () => void;
};

const cakeImage = PlaceHolderImages.find(img => img.id === 'birthday-cake');
const DUMMY_CAKE_IMAGE = cakeImage?.imageUrl || 'https://picsum.photos/seed/birthday-cake/600/400';

export function BirthdayCake({ onCandlesBlown }: BirthdayCakeProps) {
  const [listening, setListening] = useState(false);
  const [blewOut, setBlewOut] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if(animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission('granted');
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      setListening(true);
      detectBlow();

    } catch (err) {
      console.error('Mic access denied:', err);
      setMicPermission('denied');
    }
  };

  const detectBlow = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const check = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      // Simple check for "white noise" like sound (wind)
      const avg = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

      if (avg > 30) { // Threshold - may need tweaking
        console.log("Blow detected!", avg);
        setBlewOut(true);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        setListening(false);
        setTimeout(onCandlesBlown, 2000); // Wait for animation
      } else {
        animationFrameRef.current = requestAnimationFrame(check);
      }
    };
    animationFrameRef.current = requestAnimationFrame(check);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-headline text-primary">Make a Wish!</h2>
        <p className="text-muted-foreground mt-2">Click the button and blow into your mic to blow out the candles.</p>
      </motion.div>

      <div className="relative w-full max-w-md">
        <Image src={DUMMY_CAKE_IMAGE} alt="Birthday cake with candles" width={600} height={400} className="rounded-lg shadow-2xl" />
        <AnimatePresence>
        {!blewOut && (
            <motion.div
                key="flames" 
                className="absolute inset-0 flex justify-center items-start pt-16 sm:pt-20 gap-2.5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1.5 } }}
            >
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2.5 h-10 bg-amber-400 rounded-t-full" style={{
                    boxShadow: '0 0 12px 5px rgba(251, 191, 36, 0.7), 0 0 22px 9px rgba(251, 191, 36, 0.5)',
                }} />
            ))}
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-center">
        {!listening && !blewOut && (
          <Button onClick={startListening} size="lg" disabled={micPermission === 'denied'}>
            <Mic className="mr-2" />
            Start Listening
          </Button>
        )}
        {listening && !blewOut && (
            <div className="flex items-center gap-2 text-lg text-primary animate-pulse">
                <Wind />
                <span>Listening for your wish...</span>
            </div>
        )}
        {blewOut && (
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-2xl font-headline text-accent"
            >
                Wish granted!
            </motion.p>
        )}
        {micPermission === 'denied' && (
            <p className="text-destructive mt-2 text-sm">Microphone access was denied. Please enable it in your browser settings to continue.</p>
        )}
      </div>
    </div>
  );
}
