"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserImage } from '@/components/PhotoGallery';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const USER_IMAGES_STORAGE_KEY = 'papas-special-day-user-images';

export function useUserImages() {
  const [userImages, setUserImages] = useState<UserImage[]>(() => {
    if (typeof window === 'undefined') {
      return PlaceHolderImages;
    }
    try {
      const storedImages = localStorage.getItem(USER_IMAGES_STORAGE_KEY);
      return storedImages ? JSON.parse(storedImages) : PlaceHolderImages;
    } catch (error) {
      console.error('Failed to parse user images from localStorage', error);
      return PlaceHolderImages;
    }
  });

  useEffect(() => {
    // We only want to save to localStorage if the images are not the initial placeholders.
    const isUsingPlaceholders = userImages.some(img => !img.id.startsWith('user-'));
    if (isUsingPlaceholders && userImages.length > 0) {
      return;
    }
    try {
      localStorage.setItem(USER_IMAGES_STORAGE_KEY, JSON.stringify(userImages));
    } catch (error) {
      console.error('Failed to save user images to localStorage', error);
    }
  }, [userImages]);

  const addUserImage = useCallback((newImage: UserImage) => {
    setUserImages(prevImages => {
      const isUsingPlaceholders = prevImages.some(img => !img.id.startsWith('user-'));
      return isUsingPlaceholders ? [newImage] : [...prevImages, newImage];
    });
  }, []);

  const updateUserImage = useCallback((id: string, updates: Partial<Pick<UserImage, 'imageUrl' | 'description'>>) => {
    setUserImages(prevImages =>
      prevImages.map(img => (img.id === id ? { ...img, ...updates } : img))
    );
  }, []);

  return { userImages, addUserImage, updateUserImage };
}