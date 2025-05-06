
import React, { useMemo } from 'react';
import { Module, ClassSession } from '../../types';
import { Progress } from '@/components/ui/progress';
import { differenceInMinutes, parseISO, format } from 'date-fns';

interface ProgressSummaryProps {
  modules: Module[];
  classes: ClassSession[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ modules, classes }) => {
  const { 
    totalLessons, 
    completedLessons, 
    inProgressLessons, 
    notStartedLessons, 
    completedDuration,
    totalEstimatedHours
  } = useMemo(() => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let completedDuration = 0;
    
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        total++;
        
        if (lesson.status === 'completed') {
          completed++;
          if (lesson.duration) {
            completedDuration += lesson.duration;
          }
        } else if (lesson.status === 'in-progress') {
          inProgress++;
        } else {
          notStarted++;
        }
      });
    });
    
    // Default estimated hours - total of 40 hours for the course
    const totalEstimatedHours = 40; // Set a default value
    
    return {
      totalLessons: total,
      completedLessons: completed,
      inProgressLessons: inProgress,
      notStartedLessons: notStarted,
      completedDuration,
      totalEstimatedHours
    };
  }, [modules]);

  // Calculate remaining hours based on percentage of lessons completed
  const remainingEstimatedHours = useMemo(() => {
    if (totalLessons === 0) return totalEstimatedHours;
    const completionPercentage = completedLessons / totalLessons;
    return Math.max(0, Math.round(totalEstimatedHours * (1 - completionPercentage)));
  }, [totalLessons, completedLessons, totalEstimatedHours]);

  // Calculate teaching hours from the completed class sessions
  const teachingHours = useMemo(() => {
    let totalMinutes = 0;
    let plannedMinutes = 0;
    const now = new Date();
    
    classes.forEach(session => {
      const sessionDate = parseISO(`${session.date}T${session.end_time}`);
      const startTime = parseISO(`${session.date}T${session.start_time}`);
      const endTime = parseISO(`${session.date}T${session.end_time}`);
      const sessionMinutes = differenceInMinutes(endTime, startTime);

      // Calculate total planned session time
      plannedMinutes += sessionMinutes;
      
      // Only count sessions that have already ended
      if (sessionDate < now) {
        totalMinutes += sessionMinutes;
      }
    });
    
    return {
      completed: {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60
      },
      planned: {
        hours: Math.floor(plannedMinutes / 60),
        minutes: plannedMinutes % 60
      },
      remaining: {
        hours: Math.floor((plannedMinutes - totalMinutes) / 60),
        minutes: (plannedMinutes - totalMinutes) % 60
      }
    };
  }, [classes]);

  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const hoursProgress = teachingHours.planned.hours > 0 ? 
    Math.round((teachingHours.completed.hours / teachingHours.planned.hours) * 100) : 0;

  return (
    <div className="mb-8 bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Progress Summary</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Overall Progress</h3>
          <div className="flex items-center mb-2">
            <Progress value={overallProgress} className="flex-1 mr-2" />
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{completedLessons}</span> of {totalLessons} lessons completed
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">{remainingEstimatedHours}</span> estimated hours remaining
          </div>
        </div>
        
        <div className="bg-success/10 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Course Completion</h3>
          <p className="text-3xl font-bold">{completedLessons}</p>
          <div className="flex items-center mt-2">
            <Progress value={overallProgress} className="flex-1 mr-2" />
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">of {totalLessons} lessons</p>
        </div>
        
        <div className="bg-warning/10 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">In Progress</h3>
          <p className="text-3xl font-bold">{inProgressLessons}</p>
          <p className="text-sm text-muted-foreground">lessons currently active</p>
          <div className="mt-2 text-sm">
            <span className="font-medium">{notStartedLessons}</span> lessons not started
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Live Teaching Hours</h3>
          <p className="text-3xl font-bold">
            {teachingHours.completed.hours}h {teachingHours.completed.minutes}m
          </p>
          <div className="flex items-center mt-2">
            <Progress value={hoursProgress} className="flex-1 mr-2" />
            <span className="font-medium">{hoursProgress}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {teachingHours.remaining.hours}h {teachingHours.remaining.minutes}m remaining
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
