"use client";

import { useEffect, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Skeleton } from './ui/skeleton';

type SettingsProps = {
  birthday: Date | null;
  updateBirthday: (date: Date | null) => void;
  isInitialized: boolean;
};

export function Settings({ birthday, updateBirthday, isInitialized }: SettingsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (birthday && isInitialized) {
      setSelectedDate(birthday);
    }
  }, [birthday, isInitialized, isOpen]);

  const handleSave = () => {
    if (selectedDate) {
      updateBirthday(selectedDate);
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open settings">
          <SettingsIcon className="h-5 w-5 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-headline">App Settings</SheetTitle>
          <SheetDescription>
            Customize the birthday details here. Your changes will be saved locally.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="font-body">Papa's Birthday</Label>
            {isInitialized ? (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            ) : (
              <Skeleton className="h-[298px] w-full rounded-md" />
            )}
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedDate}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
