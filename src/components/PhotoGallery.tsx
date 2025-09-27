
"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
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
              description: "A new cherished memory.", // Default description for user-uploaded images
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
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
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
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-4xl mx-auto space-y-4">
        {images.map((image) => (
          <div key={image.id} className="break-inside-avoid">
            <Card className="overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto"
                  data-ai-hint={image.imageHint}
                />
              </div>
              <CardContent className="p-4">
                <CardDescription className="text-sm text-muted-foreground font-body italic">
                  "{image.description}"
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
