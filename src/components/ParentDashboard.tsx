import React from "react";
import { Users, Award, BookOpen, Clock, Heart, ArrowUpRight, BarChart } from "lucide-react";
import { Course, Enrollment, ExamSubmission, AssignmentSubmission } from "../types";

interface Props {
  courses: Course[];
  enrollments: Enrollment[];
  exams: ExamSubmission[];
  assignments: AssignmentSubmission[];
}

export default function ParentDashboard({
  courses, enrollments, exams, assignments
}: Props) {
  // Child Student ID: "usr-s1" (Alex Mercer)
  const childEnrollments = enrollments.filter(e => e.studentId === "usr-s1");
  const childExams = exams.filter(e => e.studentId === "usr-s1");
  const childWork = assignments.filter(a => a.studentId === "usr-s1");

  // Simulated Attendance log representation
  const childAttendance = [
    { date: "2026-06-15", status: "Present", topic: "Intro to Backpropagation Cycles" },
    { date: "2026-06-12", status: "Present", topic: "STAT 202: Epoch Foundations" },
    { date: "2026-06-10", status: "Present", topic: "Scalability Limits & Load Balancers" },
    { date: "2026-06-08", status: "Present", topic: "Ethical AI Design Guidelines" }
  ];

  return (
    <div className="space-y-6" id="parent-dashboard">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-gray-900 tracking-tight">Parent Administrative Monitor</h1>
          <p className="text-sm text-gray-500">Authorized Access for: <span className="font-semibold text-gray-800">David Mercer</span> (Parent / Legal Guardian)</p>
        </div>
        <div className="bg-blue-50 px-3 py-1 bg-blue-10/40 text-blue-700 text-xs font-semibold rounded-lg">
          Child Student: Alex Mercer
        </div>
      </div>

      {/* Progress Cards */}
      <h3 className="text-sm font-semibold text-gray-600 block text-left">Active Course Syllabus Progress Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {childEnrollments.map((enr) => {
          const matchedC = courses.find(c => c.id === enr.courseId);
          if (!matchedC) return null;
          return (
            <div key={enr.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-3.5 text-left hover:border-gray-200 transition-all">
              <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{matchedC.category}</span>
              <h4 className="font-bold text-gray-800 text-sm md:text-base leading-snug line-clamp-1">{matchedC.title}</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-gray-400">Class Progress Rate:</span>
                  <span className="text-blue-600">{enr.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${enr.progress}%` }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-gray-50 pt-2 text-gray-500">
                <span>Notes Logged: {enr.notes?.length || 0}</span>
                <span className="font-semibold text-gray-700">Level: {matchedC.difficulty}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Grades & Scorecards column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-left space-y-4">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Award className="w-4.5 h-4.5 text-green-600" /> Graded Exams & Subject Essay Submissions
          </h3>

          <div className="space-y-3 font-medium">
            {childExams.map((ex) => (
              <div key={ex.id} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900">{ex.quizTitle}</p>
                  <p className="text-gray-400 mt-0.5 font-mono">Date verified: {ex.gradedAt.slice(0, 10)}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-green-600">{ex.score}%</span>
                  <p className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 font-bold rounded mt-1">Verified Approved</p>
                </div>
              </div>
            ))}

            {childWork.filter(w => w.grade).map((w) => (
              <div key={w.id} className="p-4 bg-blue-50/20 rounded-lg border border-gray-100 text-xs text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">📝 Assignment: {w.fileName}</span>
                  <span className="font-mono text-blue-600 font-bold">{w.grade}</span>
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed italic">"Teacher Critique: {w.feedback || "Good conceptual layout."}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Logs Column */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-left space-y-4 col-span-1">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Clock className="w-4.5 h-4.5 text-blue-600" /> Lesson Attendance Logs
          </h3>

          <div className="space-y-3 text-xs">
            {childAttendance.map((att, idx) => (
              <div key={idx} className="flex justify-between items-start gap-2 border-b border-gray-100/55 pb-2.5 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-gray-800 line-clamp-1">{att.topic}</p>
                  <p className="text-[10px] text-gray-400">{att.date}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wide">
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructor briefings */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-left space-y-3">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
          <Heart className="w-4.5 h-4.5 text-[#e11d48]" /> Multi-Portal Parental Advisor Feedback
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Dr. Sarah Jenkins: This week Alex demonstrated highly solid focus layouts and managed to complete Module 1 Quiz Reviews inside the AI machine learning course. I highly recommend Alex spends some additional periods this weekend reviewing backpropagation mathematical matrices to prepare for the final high-stake verified proctored test.
        </p>
      </div>
    </div>
  );
}
