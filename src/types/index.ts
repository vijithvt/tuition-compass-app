
export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export interface Lesson {
  id: string;
  title: string;
  status: LessonStatus;
  startDate: string | null;
  endDate: string | null;
  duration: number | null; // in minutes
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ClassSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: 'online' | 'offline';
  meetLink?: string;
}

export interface Material {
  id: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  description?: string;
  fileUrl: string;
  uploadDate: string;
}

export interface User {
  id: string;
  email: string;
  isTutor: boolean;
}
