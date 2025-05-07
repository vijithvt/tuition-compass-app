
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ExamCountdownProps {
  examDate: Date;
  examTitle?: string;
}

const ExamCountdown: React.FC<ExamCountdownProps> = ({
  examDate,
  examTitle = "Final Exam"
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExamDay, setIsExamDay] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = examDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExamDay(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [examDate]);

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  const formattedDate = examDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-md hover:shadow-lg transition-all animate-fade-in">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-center mb-1">📝 Exam Countdown</h3>
        <p className="text-xs text-center text-gray-500 mb-3">{formattedDate}</p>
        
        {isExamDay ? (
          <div className="flex justify-center items-center py-3">
            <div className="text-xl font-bold text-green-600 animate-pulse">🟢 Exam Day!</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="flex flex-col">
                <div className="bg-white rounded-lg shadow-sm p-2 mb-1 hover:shadow-md transition-all">
                  <span className="text-2xl font-bold">{formatNumber(timeLeft.days)}</span>
                </div>
                <span className="text-xs text-gray-600">Days</span>
              </div>
              <div className="flex flex-col">
                <div className="bg-white rounded-lg shadow-sm p-2 mb-1 hover:shadow-md transition-all">
                  <span className="text-2xl font-bold">{formatNumber(timeLeft.hours)}</span>
                </div>
                <span className="text-xs text-gray-600">Hours</span>
              </div>
              <div className="flex flex-col">
                <div className="bg-white rounded-lg shadow-sm p-2 mb-1 hover:shadow-md transition-all">
                  <span className="text-2xl font-bold">{formatNumber(timeLeft.minutes)}</span>
                </div>
                <span className="text-xs text-gray-600">Minutes</span>
              </div>
              <div className="flex flex-col">
                <div className="bg-white rounded-lg shadow-sm p-2 mb-1 hover:shadow-md transition-all">
                  <span className="text-2xl font-bold">{formatNumber(timeLeft.seconds)}</span>
                </div>
                <span className="text-xs text-gray-600">Seconds</span>
              </div>
            </div>
            {examTitle && (
              <p className="text-xs text-center text-gray-500 mt-2">{examTitle}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamCountdown;
