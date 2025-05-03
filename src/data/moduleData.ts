
import { Module } from "../types";

export const moduleData: Module[] = [
  {
    id: "module-1",
    title: "C Fundamentals & Control Statements",
    lessons: [
      {
        id: "lesson-1-1",
        title: "C Character Set, Constants, Identifiers, Keywords",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
      {
        id: "lesson-1-2",
        title: "Data Types, Operators, Expressions, Input/Output",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
      {
        id: "lesson-1-3",
        title: "Control Flow: if, switch, loops, break, continue",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
    ],
  },
  {
    id: "module-2",
    title: "Arrays & Strings",
    lessons: [
      {
        id: "lesson-2-1",
        title: "1D & 2D Arrays, Enum, Typedef, Matrix Programs",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
      {
        id: "lesson-2-2",
        title: "Sorting, Searching, String Functions & Matching",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
    ],
  },
  {
    id: "module-3",
    title: "Functions, Structures & Storage Classes",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Functions (Recursive, Parameter Passing, Macros)",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
      {
        id: "lesson-3-2",
        title: "CLI Args, Structures & Unions, Storage Classes",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
    ],
  },
  {
    id: "module-4",
    title: "Pointers & File Handling",
    lessons: [
      {
        id: "lesson-4-1",
        title: "Pointers, Arrays, Strings, Function Pointers",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
      {
        id: "lesson-4-2",
        title: "Dynamic Memory, File Operations: fseek, fread, fwrite",
        status: "not-started",
        startDate: null,
        endDate: null,
        duration: null,
      },
    ],
  },
];

export const scheduledClasses: { id: string; date: string; startTime: string; endTime: string; mode: "online" | "offline" }[] = [
  {
    id: "class-1",
    date: "2025-05-05",
    startTime: "18:00",
    endTime: "20:00",
    mode: "online",
  },
  {
    id: "class-2",
    date: "2025-05-08",
    startTime: "18:00",
    endTime: "20:00",
    mode: "offline",
  },
  {
    id: "class-3",
    date: "2025-05-12",
    startTime: "18:00",
    endTime: "20:00",
    mode: "online",
  },
];

export const materials = [
  {
    id: "material-1",
    moduleId: "module-1",
    title: "C Fundamentals Worksheet",
    description: "Basic exercises for C fundamentals",
    fileUrl: "#",
    uploadDate: "2025-05-01",
  },
  {
    id: "material-2",
    moduleId: "module-2",
    title: "Array Examples",
    description: "Example code for arrays and strings manipulation",
    fileUrl: "#",
    uploadDate: "2025-05-02",
  },
];

export const defaultMeetLink = "https://meet.google.com/qdt-ught-pbf";
