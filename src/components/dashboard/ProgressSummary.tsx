
import React, { useMemo } from 'react';
import { Module, ClassSession } from '../../types';
import { Progress } from '@/components/ui/progress';
import { differenceInMinutes, parseISO } from 'date-fns';

interface ProgressSummaryProps {
  modules: Module[];
  classes: ClassSession[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ modules, classes }) => {
  const { totalLessons, completedLessons, inProgressLessons, notStartedLessons, totalDuration } = useMemo(() => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let duration = 0;
    
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        total++;
        
        if (lesson.status === 'completed') {
          completed++;
          if (lesson.duration) {
            duration += lesson.duration;
          }
        } else if (lesson.status === 'in-progress') {
          inProgress++;
        } else {
          notStarted++;
        }
      });
    });
    
    return {
      totalLessons: total,
      completedLessons: completed,
      inProgressLessons: inProgress,
      notStartedLessons: notStarted,
      totalDuration: duration
    };
  }, [modules]);

  // Calculate teaching hours from the completed class sessions
  const teachingHours = useMemo(() => {
    let totalMinutes = 0;
    const now = new Date();
    
    classes.forEach(session => {
      const sessionDate = parseISO(`${session.date}T${session.end_time}`);
      
      // Only count sessions that have already ended
      if (sessionDate < now) {
        const startTime = parseISO(`${session.date}T${session.start_time}`);
        const endTime = parseISO(`${session.date}T${session.end_time}`);
        const sessionMinutes = differenceInMinutes(endTime, startTime);
        totalMinutes += sessionMinutes;
      }
    });
    
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  }, [classes]);

  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="mb-8 bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Progress Summary</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Overall Progress</h3>
          <div className="flex items-center">
            <Progress value={overallProgress} className="flex-1 mr-2" />
            <span className="font-medium">{overallProgress}%</span>
          </div>
        </div>
        
        <div className="bg-success/10 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Completed</h3>
          <p className="text-3xl font-bold">{completedLessons}</p>
          <p className="text-sm text-muted-foreground">out of {totalLessons} lessons</p>
        </div>
        
        <div className="bg-warning/10 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">In Progress</h3>
          <p className="text-3xl font-bold">{inProgressLessons}</p>
          <p className="text-sm text-muted-foreground">lessons currently active</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Total Teaching Time</h3>
          <p className="text-3xl font-bold">{teachingHours.hours}h {teachingHours.minutes}m</p>
          <p className="text-sm text-muted-foreground">completed hours</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
