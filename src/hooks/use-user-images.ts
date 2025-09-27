
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserImage } from '@/components/PhotoGallery';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const USER_IMAGES_STORAGE_KEY = 'papas-special-day-user-images';

export function useUserImages() {
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedImages = localStorage.getItem(USER_IMAGES_STORAGE_KEY);
      if (storedImages) {
        setUserImages(JSON.parse(storedImages));
      } else {
        // If no images are in storage, initialize with placeholder images and save them.
        setUserImages(PlaceHolderImages);
        localStorage.setItem(USER_IMAGES_STORAGE_KEY, JSON.stringify(PlaceHolderImages));
      }
    } catch (error) {
      console.error('Failed to parse user images from localStorage', error);
      // Fallback to placeholder images on error
      setUserImages(PlaceHolderImages);
    }
    setIsInitialized(true);
  }, []);

  const saveImages = (images: UserImage[]) => {
    try {
      localStorage.setItem(USER_IMAGES_STORAGE_KEY, JSON.stringify(images));
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
