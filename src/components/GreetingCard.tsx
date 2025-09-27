"use client";

import { useState } from 'react';
import { Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SentimentEnhancer } from './SentimentEnhancer';

type GreetingCardProps = {
  message: string;
  setMessage: (message: string) => void;
};

export function GreetingCard({ message, setMessage }: GreetingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleSave = () => {
    setMessage(editedMessage);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedMessage(message);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedMessage(message);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">A Message for You, Dad</CardTitle>
        <CardDescription>A few words to show our love and appreciation.</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            rows={8}
            className="text-base font-body"
            placeholder="Write your heartfelt message here..."
          />
        ) : (
          <p className="text-lg font-body text-foreground whitespace-pre-wrap leading-relaxed">{message}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2">
        {isEditing ? (
          <>
            <SentimentEnhancer message={editedMessage} onEnhance={setEditedMessage} />
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="ghost">Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </>
        ) : (
          <Button onClick={handleEdit} variant="outline" className="ml-auto">
            <Edit className="mr-2 h-4 w-4" />
            Edit Message
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
