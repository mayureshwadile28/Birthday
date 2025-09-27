
"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type UserImage = {
  id: string;
  imageUrl: string;
  description: string;
  imageHint?: string;
};

type PhotoGalleryProps = {
  images: (ImagePlaceholder | UserImage)[];
  setUserImages: React.Dispatch<React.SetStateAction<UserImage[]>>;
};

export function PhotoGallery({ images, setUserImages }: PhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotosClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: UserImage[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newImage: UserImage = {
              id: `user-${Date.now()}-${Math.random()}`,
              imageUrl: e.target.result as string,
              description: file.name,
            };
            newImages.push(newImage);
            if (newImages.length === files.length) {
              setUserImages((prevImages) => [...prevImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full text-center">
      <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-headline text-primary">Cherished Memories</h2>
        <Button onClick={handleAddPhotosClick} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Photos
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>
      <Carousel
        className="w-full max-w-2xl mx-auto"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="flex aspect-video items-center justify-center p-0 relative">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
