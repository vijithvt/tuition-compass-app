
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const programmingQuotes = [
  "Code is like humor. When you have to explain it, it's bad. – Cory House",
  "The best way to predict the future is to invent it. – Alan Kay",
  "Clean code always looks like it was written by someone who cares. – Robert C. Martin",
  "Programming isn't about what you know; it's about what you can figure out. – Chris Pine",
  "The most disastrous thing that you can ever learn is your first programming language. – Alan Kay",
  "The computer was born to solve problems that did not exist before. – Bill Gates",
  "First, solve the problem. Then, write the code. – John Johnson",
  "Experience is the name everyone gives to their mistakes. – Oscar Wilde",
  "In programming, the hard part isn't solving problems, but deciding what problems to solve. – Paul Graham",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. – Martin Fowler"
];

interface QuoteCardProps {
  rotateQuotes?: boolean;
  rotationInterval?: number; // in milliseconds
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ 
  rotateQuotes = true,
  rotationInterval = 8000 
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  useEffect(() => {
    // Initial random quote
    const randomIndex = Math.floor(Math.random() * programmingQuotes.length);
    setCurrentQuoteIndex(randomIndex);
    
    // Set up rotation if enabled
    if (rotateQuotes) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => 
          (prevIndex + 1) % programmingQuotes.length
        );
      }, rotationInterval);
      
      return () => clearInterval(interval);
    }
  }, [rotateQuotes, rotationInterval]);
  
  return (
    <Card className="mb-8 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <span className="text-xl">💡</span>
            </div>
            <h3 className="text-white font-semibold">Coding Wisdom</h3>
          </div>
          
          {rotateQuotes ? (
            <Carousel className="w-full">
              <CarouselContent>
                {programmingQuotes.map((quote, index) => (
                  <CarouselItem key={index} className={index === currentQuoteIndex ? 'block' : 'hidden'}>
                    <blockquote className="italic text-white text-lg">
                      "{quote}"
                    </blockquote>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <blockquote className="italic text-white text-lg">
              "{programmingQuotes[currentQuoteIndex]}"
            </blockquote>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
