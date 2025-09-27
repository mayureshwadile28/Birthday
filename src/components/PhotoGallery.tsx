
"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { PlusCircle, Image as ImageIcon, Replace, Loader2, Sparkles, Edit, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { generatePhotoCaption } from '@/ai/flows/generate-photo-caption';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';

export type UserImage = {
  id: string;
  imageUrl: string;
  description: string;
  imageHint?: string;
};

type PhotoGalleryProps = {
  images: UserImage[];
  addUserImage: (image: UserImage) => void;
  updateUserImage: (id: string, updates: Partial<Pick<UserImage, 'imageUrl' | 'description'>>) => void;
};


function PhotoCard({ image, onReplace, onDescriptionSave }: { 
    image: UserImage, 
    onReplace: (id: string) => void, 
    onDescriptionSave: (id: string, newDescription: string) => void,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(image.description);

  const handleSave = () => {
    onDescriptionSave(image.id, editedDescription);
    setIsEditing(false);
  };

  return (
    <div className="break-inside-avoid">
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
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
                variant="secondary"
                size="sm"
                className="bg-background/80 hover:bg-background"
                onClick={() => onReplace(image.id)}
            >
                <Replace />
                Replace
            </Button>
          </div>
        </div>
        <CardContent className="p-4 bg-card">
            {isEditing ? (
                 <div className="flex flex-col gap-2">
                    <Textarea 
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={3}
                        className="text-sm"
                    />
                    <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                         <Button size="sm" onClick={handleSave}><Save className="mr-2" /> Save</Button>
                    </div>
                 </div>
            ) : (
                <div className="flex items-start justify-between gap-2">
                    <CardDescription className="text-sm text-foreground/80 font-body italic flex-1">
                        "{image.description}"
                    </CardDescription>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setIsEditing(true)}>
                        <Edit />
                    </Button>
                </div>
            )}

        </CardContent>
      </Card>
    </div>
  );
}


export function PhotoGallery({ images, addUserImage, updateUserImage }: PhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCaptionDialogOpen, setIsCaptionDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImageDataUri, setCurrentImageDataUri] = useState<string | null>(null);
  const [relationship, setRelationship] = useState("Son");
  const { toast } = useToast();

  const handleAddPhotosClick = () => {
    fileInputRef.current?.click();
  };

  const handleReplacePhotoClick = (imageId: string) => {
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.dataset.imageId = imageId;
      replaceFileInputRef.current.click();
    }
  };

  const resizeImage = (dataUrl: string, maxWidth: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }

        const scale = maxWidth / img.width;
        const width = maxWidth;
        const height = img.height * scale;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        // Adjust quality for JPG, otherwise use default PNG
        const mimeType = dataUrl.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
        const quality = mimeType === 'image/jpeg' ? 0.85 : 1.0;

        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = dataUrl;
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            const resizedDataUri = await resizeImage(e.target.result as string, 800);
            setCurrentImageDataUri(resizedDataUri);
            setIsCaptionDialogOpen(true);
          } catch (error) {
            console.error("Image resizing failed:", error);
            toast({
              variant: "destructive",
              title: "Image Error",
              description: "Could not process the image. Please try another one.",
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };
  
  const handleGenerateCaption = async () => {
    if (!currentImageDataUri) return;
    setIsGenerating(true);
    try {
      const result = await generatePhotoCaption({
        photoDataUri: currentImageDataUri,
        relationship: relationship,
      });

      const newImage: UserImage = {
        id: `user-${Date.now()}-${Math.random()}`,
        imageUrl: currentImageDataUri,
        description: result.caption,
      };
      addUserImage(newImage);

    } catch (error) {
      console.error("AI caption generation failed:", error);
      toast({
        variant: "destructive",
        title: "Caption Failed",
        description: "Could not generate a caption. A default one will be used.",
      });
      const newImage: UserImage = {
        id: `user-${Date.now()}-${Math.random()}`,
        imageUrl: currentImageDataUri,
        description: "A cherished memory with Dad.",
      };
      addUserImage(newImage);
    } finally {
      setIsGenerating(false);
      setIsCaptionDialogOpen(false);
      setCurrentImageDataUri(null);
    }
  };


  const handleReplaceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const imageIdToReplace = event.target.dataset.imageId;

    if (file && imageIdToReplace) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
           try {
            const resizedDataUri = await resizeImage(e.target.result as string, 800);
            updateUserImage(imageIdToReplace, { imageUrl: resizedDataUri });
          } catch (error) {
             console.error("Image resizing failed:", error);
             toast({
              variant: "destructive",
              title: "Image Error",
              description: "Could not process the replacement image.",
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ''; 
    if(event.target.dataset) {
      delete event.target.dataset.imageId;
    }
  };

  const handleDescriptionSave = (id: string, newDescription: string) => {
    updateUserImage(id, { description: newDescription });
  };

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
      
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-card border-2 border-dashed border-border rounded-lg p-12 max-w-4xl mx-auto">
            <ImageIcon className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Your photo gallery is empty</h3>
            <p className="mb-4">Click "Add Photos" to start building your collection of memories.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-4xl mx-auto space-y-4">
          {images.map((image) => (
             <PhotoCard 
                key={image.id}
                image={image}
                onReplace={handleReplacePhotoClick}
                onDescriptionSave={handleDescriptionSave}
            />
          ))}
        </div>
      )}
      
      <Dialog open={isCaptionDialogOpen} onOpenChange={setIsCaptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Generate a Caption</DialogTitle>
            <DialogDescription>
              Who is in this photo with your dad? This will help the AI write a more personal message.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentImageDataUri && <Image src={currentImageDataUri} alt="Preview" width={150} height={100} className="rounded-md mx-auto mb-4" />}
            <RadioGroup defaultValue={relationship} onValueChange={setRelationship} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="Son" id="r-son" className="peer sr-only" />
                <Label htmlFor="r-son" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Me (Son)</Label>
              </div>
              <div>
                <RadioGroupItem value="Daughter" id="r-daughter" className="peer sr-only" />
                <Label htmlFor="r-daughter" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">My Sister (Daughter)</Label>
              </div>
              <div>
                <RadioGroupItem value="Wife" id="r-wife" className="peer sr-only" />
                <Label htmlFor="r-wife" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">My Mother (Wife)</Label>
              </div>
              <div>
                <RadioGroupItem value="Family" id="r-family" className="peer sr-only" />
                <Label htmlFor="r-family" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">The Family</Label>
              </div>
               <div>
                <RadioGroupItem value="Just him" id="r-just-him" className="peer sr-only" />
                <Label htmlFor="r-just-him" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Just Him</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCaptionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerateCaption} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
