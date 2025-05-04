
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

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

export const QuoteCard: React.FC = () => {
  const [quote, setQuote] = useState("");
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * programmingQuotes.length);
    setQuote(programmingQuotes[randomIndex]);
  }, []);
  
  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <CardContent className="py-6">
        <blockquote className="italic text-gray-800 text-lg text-center">
          "{quote}"
        </blockquote>
      </CardContent>
    </Card>
  );
};
