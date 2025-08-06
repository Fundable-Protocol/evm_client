"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import Textarea from "@/components/ui/textarea";
import { Mail, X, Loader2 } from "lucide-react";

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactSupportModal({ isOpen, onClose }: ContactSupportModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Your message has been sent successfully!');
      setSubject('');
      setMessage('');
      onClose();
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMessage = 'Failed to send message. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">Contact Support</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="w-full"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            {/* <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              className="min-h-[150px]"
              disabled={isSubmitting}
              required
            /> */}
          </div>
          
          {error && (
            <div className="text-sm text-red-500 py-2 px-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClose()}
              className="border-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-fundable-purple-2 hover:bg-fundable-purple-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
