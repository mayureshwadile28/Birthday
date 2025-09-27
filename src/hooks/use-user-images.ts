
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserImage } from '@/components/PhotoGallery';

const USER_IMAGES_STORAGE_KEY = 'papas-special-day-user-images';

export function useUserImages() {
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedImages = localStorage.getItem(USER_IMAGES_STORAGE_KEY);
      if (storedImages) {
        setUserImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Failed to parse user images from localStorage', error);
      setUserImages([]);
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

  const updateUserImage = useCallback((id: string, newImageUrl: string, newDescription?: string) => {
    setUserImages(prevImages => {
      const updatedImages = prevImages.map(img =>
        img.id === id ? { ...img, imageUrl: newImageUrl, description: newDescription || img.description } : img
      );
      saveImages(updatedImages);
      return updatedImages;
    });
  }, []);

  return { userImages, addUserImage, updateUserImage, isInitialized };
}
