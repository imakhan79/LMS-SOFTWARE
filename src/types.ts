export interface Course {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  published: boolean;
  instructorId: string;
  instructorName: string;
  description: string;
  outcomes: string[];
  thumbnail: string;
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      type: "video" | "doc" | "quiz";
      duration: string;
      contentUrl?: string;
      scormSupport?: boolean;
    }[];
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "instructor" | "student" | "parent" | "corporate";
  parentOf?: string;
  department?: string;
  xp: number;
  badges: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  notes: CourseNote[];
  completed: boolean;
}

export interface CourseNote {
  id: string;
  lessonId: string;
  content: string;
  timestamp: string;
}

export interface ExamSubmission {
  id: string;
  studentId: string;
  courseId: string;
  quizTitle: string;
  score: number;
  passed: boolean;
  gradedAt: string;
  answers: Record<string, string>;
  faceVerified?: boolean;
}

export interface AssignmentSubmission {
  id: string;
  courseId: string;
  lessonId: string;
  studentId: string;
  studentName: string;
  fileName: string;
  textContent?: string;
  grade?: string;
  feedback?: string;
  submittedAt: string;
}

export interface DiscussionMessage {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  ip: string;
  status: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  status: string;
  gateway: string;
  date: string;
}

export interface QrSession {
  id: string;
  courseId: string;
  courseTitle: string;
  sessionTitle: string;
  instructorId: string;
  instructorName: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  active: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  sessionId: string;
  sessionTitle: string;
  markedAt: string;
  status: "Present";
  verifiedVia: "QR Scan";
}

// === ACADEMIC MANAGEMENT SYSTEM TYPES ===

export interface University {
  id: string;
  name: string;
  code: string;
  location: string;
  colleges: College[];
}

export interface College {
  id: string;
  name: string;
  code: string;
  schools: School[];
}

export interface School {
  id: string;
  name: string;
  code: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  faculties: Faculty[];
  programs: Program[];
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  designation: string;
  specialization: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  degreeId: string;
  plos: ProgramLearningOutcome[];
  semesters: SemesterNode[];
}

export interface Degree {
  id: string;
  name: string; // e.g., Bachelor of Science, Master of Engineering
  durationYears: number;
}

export interface SemesterNode {
  id: string;
  name: string; // e.g., Semester 1, Semester 2, Term A
  batches: BatchNode[];
  courses: CurriculumCourseMapping[];
}

export interface BatchNode {
  id: string;
  name: string; // e.g., Batch 2026-A
  sections: SectionNode[];
}

export interface SectionNode {
  id: string;
  name: string; // e.g., Section Alpha
  groups: GroupNode[];
}

export interface GroupNode {
  id: string;
  name: string; // e.g., Group Lambda-1
}

// === CURRICULUM & OBE / BLOOM TAXONOMY ===

export interface ProgramLearningOutcome {
  id: string;
  code: string; // e.g., PLO-1
  title: string;
  description: string;
  accreditationDomain: "Knowledge" | "Skills" | "Attitude" | "Ethical";
}

export interface CourseLearningOutcome {
  id: string;
  code: string; // e.g., CLO-1
  description: string;
  bloomLevel: "C1" | "C2" | "C3" | "C4" | "C5" | "C6"; // Bloom levels (Remember, Understand, Apply, Analyze, Evaluate, Create)
  weight: number; // e.g., percentage or points mapping to PLOs
  mappedPloId: string; // linked PLO
}

export interface CurriculumCourseMapping {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  creditHours: number; // e.g., 3 Cr. Hr., 4 Cr. Hr.
  lectureHours: number;
  labHours: number;
  clos: CourseLearningOutcome[];
  preRequisiteIds: string[];
}


