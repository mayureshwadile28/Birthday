
"use client";

import { useState } from 'react';
import { useBirthday } from '@/hooks/use-birthday';
import { useUserImages } from '@/hooks/use-user-images';
import { GreetingCard } from '@/components/GreetingCard';
import { PhotoGallery, type UserImage } from '@/components/PhotoGallery';
import { Settings } from '@/components/Settings';
import { Separator } from './ui/separator';

const INITIAL_MESSAGE = `प्रिय बाबा,

वाढदिवसाच्या खूप खूप शुभेच्छा!

तुम्ही फक्त आमचे वडील नाही, तर आमचे हिरो आणि सर्वात चांगले मित्र आहात. तुमचे प्रेम, पाठिंबा आणि शहाणपणाने आमचे आयुष्य घडवले आहे.

तुमचा हा खास दिवस आनंद, हास्य आणि प्रेम यांनी भरलेला जावो, हीच आमची इच्छा.

तुमचा लाडका मुलगा,
मयुरेश`;

export function BirthdayApp() {
  const { birthday, updateBirthday, isInitialized: isBirthdayInitialized } = useBirthday();
  const { userImages, addUserImage, updateUserImage, isInitialized: isImagesInitialized } = useUserImages();
  const [message, setMessage] = useState(INITIAL_MESSAGE);

  const isInitialized = isBirthdayInitialized && isImagesInitialized;

  return (
    <div className="flex flex-col min-h-dvh bg-transparent text-foreground font-body">
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
            
            <GreetingCard message={message} setMessage={setMessage} />
            
            <Separator className="my-4 max-w-4xl" />
            
            <PhotoGallery 
              images={userImages} 
              addUserImage={addUserImage}
              updateUserImage={updateUserImage}
              isInitialized={isInitialized}
            />
          </div>
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t bg-background/95">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground">
                  Built with love for the best dad in the world.
              </p>
          </div>
      </footer>
    </div>
  );
}
