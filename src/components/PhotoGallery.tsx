import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function PhotoGallery() {
  if (!PlaceHolderImages || PlaceHolderImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full text-center">
       <h2 className="text-3xl font-headline text-primary mb-6">Cherished Memories</h2>
      <Carousel 
        className="w-full max-w-2xl mx-auto"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {PlaceHolderImages.map((image) => (
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
