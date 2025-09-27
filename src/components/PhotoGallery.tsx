
"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { PlusCircle, Image as ImageIcon, Replace, Loader2 } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type UserImage = {
  id: string;
  imageUrl: string;
  description: string;
  imageHint?: string;
};

type PhotoGalleryProps = {
  images: (ImagePlaceholder | UserImage)[];
  addUserImage: (image: UserImage) => void;
  updateUserImage: (id: string, imageUrl: string) => void;
  isInitialized: boolean;
};

export function PhotoGallery({ images, addUserImage, updateUserImage, isInitialized }: PhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotosClick = () => {
    fileInputRef.current?.click();
  };

  const handleReplacePhotoClick = (imageId: string) => {
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.dataset.imageId = imageId;
      replaceFileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const description = prompt("Enter a short message for this photo:", "A cherished memory.");
            const newImage: UserImage = {
              id: `user-${Date.now()}-${Math.random()}`,
              imageUrl: e.target.result as string,
              description: description || "A new cherished memory.",
            };
            addUserImage(newImage);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleReplaceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const imageIdToReplace = event.target.dataset.imageId;

    if (file && imageIdToReplace) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updateUserImage(imageIdToReplace, e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again
    event.target.value = ''; 
    if(event.target.dataset) {
      delete event.target.dataset.imageId;
    }
  };
  
  const isUserImage = (image: ImagePlaceholder | UserImage): image is UserImage => {
    return image.id.startsWith('user-');
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-headline text-primary">Cherished Memories</h2>
        <Button onClick={handleAddPhotosClick} variant="outline" disabled={!isInitialized}>
          {isInitialized ? <PlusCircle className="mr-2 h-4 w-4" /> : <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        <input
          type="file"
          ref={replaceFileInputRef}
          onChange={handleReplaceFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {!isInitialized ? (
         <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
         </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-card border-2 border-dashed border-border rounded-lg p-12 max-w-4xl mx-auto">
            <ImageIcon className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Your photo gallery is empty</h3>
            <p className="mb-4">Click "Add Photos" to start building your collection of memories.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-4xl mx-auto space-y-4">
          {images.map((image) => (
            <div key={image.id} className="break-inside-avoid">
              <Card className="overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 group">
                <div className="relative aspect-w-16 aspect-h-9 bg-gray-100">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={400}
                    className="object-cover w-full h-auto"
                    data-ai-hint={image.imageHint}
                  />
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUserImage(image) && (
                      <Button
                          variant="outline"
                          size="sm"
                          className="bg-background/80 hover:bg-background"
                          onClick={() => handleReplacePhotoClick(image.id)}
                      >
                          <Replace className="mr-2" />
                          Replace
                      </Button>
                    )}
                   </div>
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
      )}
    </div>
  );
}
