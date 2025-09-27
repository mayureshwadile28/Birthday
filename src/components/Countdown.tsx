"use client";

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate }: { targetDate: Date }) {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set initial value
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    // Render a placeholder on the server to prevent hydration mismatch
    return (
        <div className="w-full max-w-2xl text-center">
            <div className="h-10 w-3/4 mx-auto mb-6 bg-muted rounded-md" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="h-28 w-full bg-muted rounded-lg" />
                <div className="h-28 w-full bg-muted rounded-lg" />
                <div className="h-28 w-full bg-muted rounded-lg" />
                <div className="h-28 w-full bg-muted rounded-lg" />
            </div>
        </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-headline text-accent tracking-tight">Happy Birthday, Dad!</h2>
      </div>
    );
  }

  const timeParts = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="text-center w-full">
      <h2 className="text-3xl font-headline text-primary mb-6">Countdown to the Big Day!</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
        {timeParts.map(({ label, value }) => (
          <div key={label} className="bg-card p-4 rounded-lg shadow-lg border transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl lg:text-5xl font-bold text-accent font-headline">{String(value).padStart(2, '0')}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
