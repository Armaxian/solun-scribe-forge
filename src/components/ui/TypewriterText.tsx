import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  cursorBlink?: boolean;
  loop?: boolean;
  pauseTime?: number;
}

export function TypewriterText({ 
  text, 
  speed = 100, 
  delay = 500, 
  className,
  onComplete,
  showCursor = true,
  cursorBlink = true,
  loop = false,
  pauseTime = 4000
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasCompletedFirstWord, setHasCompletedFirstWord] = useState(false);
  
  // Handle both string and array inputs
  const words = Array.isArray(text) ? text : [text];
  const currentText = words[currentWordIndex];

  useEffect(() => {
    // Start typing after delay
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    // Handle typing phase
    if (!isDeleting && currentIndex < currentText.length) {
      const randomSpeed = speed + (Math.random() - 0.5) * 20;
      const timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, Math.max(50, randomSpeed));
      return () => clearTimeout(timer);
    }

    // Handle completion of typing
    if (!isDeleting && currentIndex >= currentText.length) {
      // Call onComplete only once after the first word is complete
      if (!hasCompletedFirstWord && onComplete) {
        setHasCompletedFirstWord(true);
        onComplete();
      }
      
      // Start deletion after pause if looping
      if (loop) {
        const pauseTimer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
        return () => clearTimeout(pauseTimer);
      }
      return;
    }

    // Handle deletion phase
    if (isDeleting && currentIndex > 0) {
      const deleteSpeed = speed * 0.5; // Delete faster than typing
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setDisplayedText(currentText.slice(0, currentIndex - 1));
      }, deleteSpeed);
      return () => clearTimeout(timer);
    }

    // Handle completion of deletion - move to next word or restart
    if (isDeleting && currentIndex <= 0) {
      setIsDeleting(false);
      setCurrentIndex(0);
      setDisplayedText('');
      
      // Move to next word if we have multiple words
      if (words.length > 1) {
        setCurrentWordIndex(prev => (prev + 1) % words.length);
      }
    }
  }, [currentIndex, isTyping, isDeleting, currentText, speed, onComplete, hasCompletedFirstWord, loop, pauseTime, words.length]);

  return (
    <span className={cn('typewriter', className)}>
      {displayedText}
      {showCursor && (isTyping || isDeleting) && (
        <span className={cn(
          'typewriter-caret',
          cursorBlink && 'animate-pulse'
        )}>▌</span>
      )}
    </span>
  );
}
