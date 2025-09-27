
"use client";

import { useState } from 'react';
import { useBirthday } from '@/hooks/use-birthday';
import { useUserImages } from '@/hooks/use-user-images';
import { Countdown } from '@/components/Countdown';
import { GreetingCard } from '@/components/GreetingCard';
import { PhotoGallery, type UserImage } from '@/components/PhotoGallery';
import { Settings } from '@/components/Settings';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from './ui/separator';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const INITIAL_MESSAGE = `Happy 45th Birthday, Dad!

Another year older, another year wiser. Thank you for all the love, support, and wisdom you've shared with me throughout the years. You're not just my father, but my hero and best friend.

Wishing you a day filled with joy, laughter, and everything you deserve.

With all my love,
Your Child`;

export function BirthdayApp() {
  const { birthday, updateBirthday, isInitialized: isBirthdayInitialized } = useBirthday();
  const { userImages, addUserImage, updateUserImage, isInitialized: isImagesInitialized } = useUserImages();
  const [message, setMessage] = useState(INITIAL_MESSAGE);

  const isInitialized = isBirthdayInitialized && isImagesInitialized;

  const allImages: (ImagePlaceholder | UserImage)[] = [...PlaceHolderImages, ...userImages];

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl md:text-2xl font-headline text-primary tracking-tight">
            Papa's Special Day
          </h1>
          <Settings 
            birthday={birthday} 
            updateBirthday={updateBirthday} 
            isInitialized={isInitialized} 
          />
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container py-8 md:py-16">
          <div className="flex flex-col items-center gap-12 md:gap-20">
            {isInitialized && birthday ? (
              <Countdown targetDate={birthday} />
            ) : (
              <div className="w-full max-w-2xl text-center">
                  <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                  </div>
              </div>
            )}
            
            <GreetingCard message={message} setMessage={setMessage} />
            
            <Separator className="my-4 max-w-4xl" />
            
            <PhotoGallery 
              images={allImages} 
              addUserImage={addUserImage}
              updateUserImage={updateUserImage}
              isInitialized={isInitialized}
            />
          </div>
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground">
                  Built with love for the best dad in the world.
              </p>
          </div>
      </footer>
    </div>
  );
}
