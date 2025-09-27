
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserImage } from '@/components/PhotoGallery';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const USER_IMAGES_STORAGE_KEY = 'papas-special-day-user-images';

export function useUserImages() {
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let imagesToLoad: UserImage[] = [];
    try {
      const storedImagesJson = localStorage.getItem(USER_IMAGES_STORAGE_KEY);
      if (storedImagesJson) {
        const storedImages = JSON.parse(storedImagesJson);
        // Ensure the loaded data is an array
        if (Array.isArray(storedImages) && storedImages.length > 0) {
          imagesToLoad = storedImages;
        } else {
           // If storage is corrupted or empty, start with placeholders
          imagesToLoad = PlaceHolderImages;
          localStorage.setItem(USER_IMAGES_STORAGE_KEY, JSON.stringify(imagesToLoad));
        }
      } else {
        // This is for the very first visit when nothing is in storage.
        imagesToLoad = PlaceHolderImages;
        localStorage.setItem(USER_IMAGES_STORAGE_KEY, JSON.stringify(imagesToLoad));
      }
    } catch (error) {
      console.error('Failed to access or parse localStorage:', error);
      // Fallback to placeholders if localStorage fails
      imagesToLoad = PlaceHolderImages;
    }
    
    setUserImages(imagesToLoad);
    setIsInitialized(true);
  }, []);

  const saveImages = (images: UserImage[]) => {
    try {
      const imagesJson = JSON.stringify(images);
      localStorage.setItem(USER_IMAGES_STORAGE_KEY, imagesJson);
    } catch (error) {
      console.error('Failed to save user images to localStorage', error);
    }
  };

  const addUserImage = useCallback((newImage: UserImage) => {
    setUserImages(prevImages => {
      const updatedImages = [...prevImages, newImage];
      saveImages(updatedImages);
      return updatedImages;
    });
  }, []);

  const updateUserImage = useCallback((id: string, updates: Partial<Pick<UserImage, 'imageUrl' | 'description'>>) => {
    setUserImages(prevImages => {
      const updatedImages = prevImages.map(img =>
        img.id === id ? { ...img, ...updates } : img
      );
      saveImages(updatedImages);
      return updatedImages;
    });
  }, []);

  return { userImages, addUserImage, updateUserImage, isInitialized };
}
