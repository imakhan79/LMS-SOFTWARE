import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, BookOpen, Star, Award, Shield, UserCheck, Heart, 
  Settings, ShoppingBag, LogOut, ChevronRight, Menu, X, ArrowUpRight, 
  Zap, Compass, User, RefreshCw, Layers, Database
} from "lucide-react";
import { Course, User as LmsUser, Enrollment, DiscussionMessage, ExamSubmission, AssignmentSubmission, AuditLog, Transaction } from "./types";

// Import Portals
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import AdminDashboard from "./components/AdminDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import ParentDashboard from "./components/ParentDashboard";
import CorporateDashboard from "./components/CorporateDashboard";
import Marketplace from "./components/Marketplace";
import AcademicDashboard from "./components/AcademicDashboard";

export default function App() {
  // State definitions matching types.ts
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<LmsUser[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionMessage[]>([]);
  const [exams, setExams] = useState<ExamSubmission[]>([]);
  const [assignments, setAssignments] = useState<AssignmentSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>({ totalRevenue: 497, totalStudents: 1, totalInstructors: 2, totalCourses: 3, activeUsers: 3 });

  // Routing and Role Navigation States
  const [activeRole, setActiveRole] = useState<LmsUser["role"] | "guest" | "academic">("academic");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load and refresh core data from express backend API
  const refreshAllData = async () => {
    try {
      const [coursesRes, usersRes, enrollmentsRes, discussionsRes, examsRes, assignmentsRes, auditLogsRes, transactionsRes, statsRes] = await Promise.all([
        fetch("/api/courses").then(r => r.json()),
        fetch("/api/users").then(r => r.json()),
        fetch("/api/enrollments").then(r => r.json()),
        fetch("/api/discussions").then(r => r.json()),
        fetch("/api/exams").then(r => r.json()),
        fetch("/api/assignments").then(r => r.json()),
        fetch("/api/audit-logs").then(r => r.json()),
        fetch("/api/transactions").then(r => r.json()),
        fetch("/api/dashboard/stats").then(r => r.json())
      ]);

      setCourses(coursesRes);
      setUsers(usersRes);
      setEnrollments(enrollmentsRes);
      setDiscussions(discussionsRes);
      setExams(examsRes);
      setAssignments(assignmentsRes);
      setAuditLogs(auditLogsRes);
      setTransactions(transactionsRes);
      setStats(statsRes);
    } catch (err) {
      console.error("Backend offline or lagging. Using fully optimized client-side fallbacks.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Gamification calculations for the designated Student profile (Alex Mercer - usr-s1)
  const activeStudentProfile = users.find(u => u.id === "usr-s1") || {
    name: "Alex Mercer",
    role: "student",
    xp: 1250,
    badges: ["First Lesson Completed", "Quiz Ace"]
  };

  // Central State Controllers (Synchronized with backend REST endpoints)
  const handleAddUser = async (newUser: Partial<LmsUser>) => {
    const defaultUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name || "Unnamed Profile",
      email: newUser.email || "email@lms.com",
      role: newUser.role || "student",
      xp: 0,
      badges: []
    };
    
    // Simulate updating in-memory or make mock adjustments
    setUsers(prev => [...prev, defaultUser as LmsUser]);
    
    // Log trace audit actions
    await handleCreateAuditLog(`SaaS Provisioner: Created user ${defaultUser.name} with privileges [${defaultUser.role}]`);
  };

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentId: "usr-s1" })
      });
      await res.json();
      await handleCreateAuditLog(`Student Gateway: Enrolled student usr-s1 inside Course: ${courseId}`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProgress = async (enrId: string, progress: number) => {
    try {
      const res = await fetch(`/api/enrollments/${enrId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress })
      });
      await res.json();
      await handleCreateAuditLog(`Student Progress: Completed lesson nodes, child progress adjusted to ${progress}%`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (enrId: string, lessonId: string, content: string) => {
    try {
      const res = await fetch(`/api/enrollments/${enrId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, content })
      });
      await res.json();
      await handleCreateAuditLog(`Bookmark Engine: Student usr-s1 added lecture note trace on lesson ${lessonId}`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDiscussion = async (msg: Partial<DiscussionMessage>) => {
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg)
      });
      await res.json();
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitExam = async (exam: Partial<ExamSubmission>) => {
    try {
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exam)
      });
      await res.json();
      await handleCreateAuditLog(`Examination Proctor: Submitted verified test for Course ${exam.courseId}. Score: ${exam.score}%`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAwardXp = async (userId: string, amount: number, badgeName: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/award-xp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, badge: badgeName })
      });
      await res.json();
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (courseFields: Partial<Course>) => {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseFields)
      });
      await res.json();
      await handleCreateAuditLog(`Syllabus Builder: Created new draft course record '${courseFields.title}'`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloneCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/clone/${id}`, {
        method: "POST"
      });
      await res.json();
      await handleCreateAuditLog(`Syllabus Builder: Cloned course reference ${id}`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}/publish`, {
        method: "PATCH"
      });
      await res.json();
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" });
      await handleCreateAuditLog(`Syllabus Builder: Purged course record ${id} from database ledger`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeAssignmentSubmit = async (id: string, grade: string, feedback: string) => {
    try {
      const res = await fetch(`/api/assignments/${id}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, feedback })
      });
      await res.json();
      await handleCreateAuditLog(`Grading Ledger: Graded student assignment submission [id: ${id}] with score ${grade}`);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAuditLog = async (action: string) => {
    try {
      await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: activeRole === "guest" ? "Guest / Learner" : `Alex Mercer Context (${activeRole})`,
          action,
          ip: "192.168.1.12",
          status: "Success"
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleModifyCourseSyllabus = async (courseId: string, updatedModules: any[]) => {
    // In-memory update callback simulating database modification of course blueprint
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, modules: updatedModules };
      }
      return c;
    }));
    await handleCreateAuditLog(`Syllabus Builder: Updated course modules/chapters structure for Course ${courseId}`);
  };

  // Database Backup Generator Action: packages all in-memory structured data to a physical .json downloadable schema!
  const handleSystemBackupAction = () => {
    const backupPayload = {
      platform: "Enterprise LMS Portal",
      timestamp: new Date().toISOString(),
      entities: {
        courses,
        users,
        enrollments,
        discussions,
        exams,
        assignments,
        transactions,
        auditLogs
      }
    };

    const str = JSON.stringify(backupPayload, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(str);
    
    const element = document.createElement("a");
    element.setAttribute("href", dataUri);
    element.setAttribute("download", `enterprise_lms_db_export_${Date.now()}.json`);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert("Enterprise Schema backup package successfully aggregated and downloaded.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
        <h3 className="text-sm font-semibold text-gray-700">Booting SaaS LMS Multi-Portal Database...</h3>
      </div>
    );
  }

  // Active Role Description Ticker
  const roleNameMap: Record<string, string> = {
    superadmin: "Platform Founder | Sophia Sinclair",
    admin: "Institutional Admin | Claire Redfield",
    instructor: "Academic Instructor | Dr. Sarah Jenkins",
    student: "Student Learner | Alex Mercer",
    parent: "Parent Monitor | David Mercer",
    corporate: "Corporate HR | John Sterling",
    guest: "Unverified Guest / Course Marketplace",
    academic: "Academic Dean & Curriculum Manager"
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans" id="lms-application">
      
      {/* Platform Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-2xs">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation Sidebar"
            className="md:hidden p-1 bg-gray-50 text-gray-500 rounded hover:bg-gray-100 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white tracking-widest text-base shadow-xs">
              M
            </div>
            <div>
              <span className="text-xs font-bold text-blue-650 tracking-wider block uppercase font-mono">Enterprise LMS</span>
              <span className="text-sm font-bold text-gray-950 leading-none">Multi-Portal Console</span>
            </div>
          </div>
        </div>

        {/* Level and XP Meter for Gamification inside page margins */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 bg-[#f1f5f9] px-3.5 py-1.5 rounded-xl border border-gray-100">
            <Zap className="w-4.5 h-4.5 text-amber-500 fill-amber-500 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-gray-400 block uppercase leading-none">Alex Mercer</span>
              <span className="text-xs font-extrabold text-blue-900 leading-none">Level {Math.floor(activeStudentProfile.xp / 1000) + 1} ({activeStudentProfile.xp} XP)</span>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider leading-none">Active Role Context</span>
            <span className="font-semibold text-gray-900 leading-none mt-1 inline-block">{roleNameMap[activeRole]}</span>
          </div>
        </div>
      </header>

      {/* Main Structural Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Modular Access Switcher Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 p-5 transform transition-transform duration-200 mt-16 md:mt-0 md:translate-x-0 md:static shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Access Portal Roles</h3>
              
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => { setActiveRole("superadmin"); setSidebarOpen(false); }}
                  aria-label="Switch to Super Admin Portal"
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "superadmin" ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <span className="flex items-center gap-2">🛡️ Super Admin Portal</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("admin"); setSidebarOpen(false); }}
                  aria-label="Switch to Institutional Admin Portal"
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "admin" ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <span className="flex items-center gap-2">💼 Institutional Admin</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("instructor"); setSidebarOpen(false); }}
                  aria-label="Switch to Faculty Instructor Portal"
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "instructor" ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <span className="flex items-center gap-2">👨‍🏫 Faculty Instructor</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("student"); setSidebarOpen(false); }}
                  aria-label="Switch to Student Learning Hub Portal"
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "student" ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <span className="flex items-center gap-2">🎓 Student Learning Hub</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("parent"); setSidebarOpen(false); }}
                  aria-label="Switch to Parent Monitor Portal"
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "parent" ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <span className="flex items-center gap-2">🏡 Parent Monitor</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("corporate"); setSidebarOpen(false); }}
                  aria-label="Switch to Corporate HR Portal"
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "corporate" ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <span className="flex items-center gap-2">🏢 Corporate HR Portal</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole("academic"); setSidebarOpen(false); }}
                  aria-label="Switch to Academic Management System"
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "academic" ? "bg-[#4f46e5] text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <span className="flex items-center gap-2">🏛️ Academic Management</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Marketplace</h3>
              <button
                type="button"
                onClick={() => { setActiveRole("guest"); setSidebarOpen(false); }}
                aria-label="Navigate to Course Marketplace"
                className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${activeRole === "guest" ? "bg-indigo-650 text-white font-bold" : "hover:bg-slate-800 text-slate-400"}`}
              >
                <span className="flex items-center gap-2">🛒 Course Marketplace</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            {/* Quick backup button in sidebar */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <span className="text-[9.5px] uppercase font-bold text-slate-600 block tracking-wider px-2">Data Operations</span>
              <button 
                onClick={handleSystemBackupAction}
                type="button" 
                aria-label="Export platform schema as JSON backup"
                className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-[#38bdf8] text-[10.5px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" /> Full Schema Export
              </button>
            </div>
          </div>
        </aside>

        {/* Core content viewframe */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="max-w-7xl mx-auto">
            {activeRole === "superadmin" && (
              <SuperAdminDashboard 
                stats={stats} 
                courses={courses} 
                users={users} 
                auditLogs={auditLogs} 
                transactions={transactions}
                onAddUser={handleAddUser}
                onAwardXp={handleAwardXp}
                onSystemBackup={handleSystemBackupAction}
              />
            )}

            {activeRole === "admin" && (
              <AdminDashboard 
                courses={courses}
                assignments={assignments}
                onCreateCourse={handleCreateCourse}
                onCloneCourse={handleCloneCourse}
                onPublishToggle={handlePublishToggle}
                onDeleteCourse={handleDeleteCourse}
                onGradeAssignment={handleGradeAssignmentSubmit}
              />
            )}

            {activeRole === "instructor" && (
              <InstructorDashboard 
                courses={courses}
                discussions={discussions}
                onAddDiscussion={handleAddDiscussion}
                onModifyCourseSyllabus={handleModifyCourseSyllabus}
              />
            )}

            {activeRole === "student" && (
              <StudentDashboard 
                courses={courses}
                enrollments={enrollments}
                discussions={discussions}
                exams={exams}
                onEnrollCourse={handleEnrollCourse}
                onUpdateProgress={handleUpdateProgress}
                onAddNote={handleAddNote}
                onAddDiscussion={handleAddDiscussion}
                onSubmitExam={handleSubmitExam}
              />
            )}

            {activeRole === "parent" && (
              <ParentDashboard 
                courses={courses}
                enrollments={enrollments}
                exams={exams}
                assignments={assignments}
              />
            )}

            {activeRole === "corporate" && (
              <CorporateDashboard 
                onAwardXp={handleAwardXp}
              />
            )}

            {activeRole === "guest" && (
              <Marketplace 
                courses={courses}
                enrolledCourseIds={enrollments.map(e => e.courseId)}
                onEnrollCourse={handleEnrollCourse}
                onRefreshEnrollments={refreshAllData}
              />
            )}

            {activeRole === "academic" && (
              <AcademicDashboard />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
