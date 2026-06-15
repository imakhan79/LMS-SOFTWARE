import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  YAxis, Legend 
} from "recharts";
import { 
  BookOpen, Plus, Tag, HelpCircle, FileText, CheckCircle, 
  AlertCircle, ShieldCheck, Copy, Eye, Power, Trash, LayoutList
} from "lucide-react";
import { Course, AssignmentSubmission } from "../types";

interface Props {
  courses: Course[];
  assignments: AssignmentSubmission[];
  onCreateCourse: (course: Partial<Course>) => void;
  onCloneCourse: (id: string) => void;
  onPublishToggle: (id: string) => void;
  onDeleteCourse: (id: string) => void;
  onGradeAssignment: (id: string, grade: string, feedback: string) => void;
}

export default function AdminDashboard({
  courses, assignments, onCreateCourse, onCloneCourse, onPublishToggle, onDeleteCourse, onGradeAssignment
}: Props) {
  const [activeTab, setActiveTab] = useState<"courses" | "assignments" | "analytics">("courses");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Computer Science");
  const [newPrice, setNewPrice] = useState(99);
  const [newDiff, setNewDiff] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");

  // Selection states for feedback grading
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [earnedGrade, setEarnedGrade] = useState("90 / 100");
  const [rubricFb, setRubricFb] = useState("Perfect conceptual layout.");

  // Analytics helper data
  const courseCompleters = courses.map(c => ({
    name: c.title.substring(0, 15) + "...",
    completions: c.id === "course-1" ? 18 : c.id === "course-2" ? 5 : 12,
    dropouts: c.id === "course-1" ? 1 : c.id === "course-2" ? 3 : 2
  }));

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateCourse({
      title: newTitle,
      category: newCategory,
      price: newPrice,
      difficulty: newDiff,
      description: `Course concerning fundamental concepts in ${newCategory}. Includes structured lessons, automatic examinations, and certificate triggers.`,
      outcomes: ["Implement industry-standard theories", "Build a high-impact portfolio"],
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
    });
    setNewTitle("");
    alert("New custom course created. Add custom modules inside the Instructor Course Builder.");
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingId) return;
    onGradeAssignment(gradingId, earnedGrade, rubricFb);
    setGradingId(null);
    setEarnedGrade("90/100");
    setRubricFb("");
    alert("Assignment graded and feedback dispatched.");
  };

  return (
    <div className="space-y-6" id="admin-dashboard">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-sans font-semibold text-gray-900 tracking-tight">Institutional Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Edit course models, toggle publish states, manage grading catalogs, and audit syllabus metrics.</p>
        </div>
        
        {/* Rapid Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("courses")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeTab === "courses" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
          >
            Syllabus Manager
          </button>
          <button 
            onClick={() => setActiveTab("assignments")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeTab === "assignments" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
          >
            Written Work ({assignments.filter(a => !a.grade).length} pending)
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeTab === "analytics" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
          >
            Engagement Analytics
          </button>
        </div>
      </div>

      {activeTab === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Course Column */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-xs h-fit space-y-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Create Master Course
            </h2>
            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Database Scaling"
                  className="w-full text-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg outline-hidden focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category Domain</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg outline-hidden text-gray-700"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Compliance & HR">Compliance & HR</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price (USD)</label>
                  <input 
                    type="number" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg outline-hidden text-gray-700"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Difficulty</label>
                  <select 
                    value={newDiff} 
                    onChange={(e) => setNewDiff(e.target.value as any)}
                    className="w-full text-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg outline-hidden text-gray-700"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Provision Syllabus
              </button>
            </form>
          </div>

          {/* Courses List Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5 px-1">
              <LayoutList className="w-4 h-4 text-gray-600" /> Syllabus Directory ({courses.length})
            </h2>

            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-200 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 rounded px-2 py-0.5">{course.category}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        course.difficulty === 'Advanced' ? 'bg-red-50 text-red-700' :
                        course.difficulty === 'Intermediate' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                      }`}>{course.difficulty}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug">{course.title}</h3>
                    <p className="text-xs text-gray-400">Instructor: {course.instructorName} | Cost: ${course.price}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button 
                      onClick={() => onPublishToggle(course.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer flex items-center gap-1 transition-all ${
                        course.published ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <Power className="w-3 h-3" /> {course.published ? "Live" : "Draft"}
                    </button>
                    <button 
                      onClick={() => onCloneCourse(course.id)}
                      className="p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-950 rounded-lg border border-gray-200 transition-all cursor-pointer flex items-center gap-1 text-xs"
                      title="Clone Course"
                    >
                      <Copy className="w-3.5 h-3.5" /> Clone
                    </button>
                    <button 
                      onClick={() => onDeleteCourse(course.id)}
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 rounded-lg border border-red-100 transition-all cursor-pointer"
                      title="Delete Course Table Record"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Student Written Work Submission Ledger</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Recent Assignments ({assignments.length})</h3>
              <div className="space-y-3">
                {assignments.map((sub) => (
                  <div 
                    key={sub.id} 
                    onClick={() => {
                      setGradingId(sub.id);
                      setEarnedGrade(sub.grade || "90 / 100");
                      setRubricFb(sub.feedback || "Good structure.");
                    }}
                    className={`p-4 rounded-lg border border-gray-100 transition-all cursor-pointer text-left ${gradingId === sub.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400 font-mono">Submitted: {sub.submittedAt.slice(0, 10)}</span>
                      <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${sub.grade ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700 animate-pulse"}`}>
                        {sub.grade ? `Graded: ${sub.grade}` : "Pending Evaluation"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{sub.studentName}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">📂 {sub.fileName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading Form Pane */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit space-y-4">
              {gradingId ? (
                <>
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-600" /> Grade Academic Submission
                  </h3>
                  {(() => {
                    const activeSub = assignments.find(a => a.id === gradingId);
                    if (!activeSub) return null;
                    return (
                      <div className="space-y-4 text-xs">
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="font-semibold text-gray-800">Student Essay Content Summary:</p>
                          <p className="text-gray-600 italic mt-1.5 leading-relaxed">"{activeSub.textContent || "No text payload. PDF Attachment."}"</p>
                        </div>

                        <form onSubmit={handleGradeSubmit} className="space-y-3">
                          <div>
                            <label className="block font-semibold text-gray-600 mb-1">Assign Numerical Score / Grade</label>
                            <input 
                              type="text" 
                              value={earnedGrade}
                              onChange={(e) => setEarnedGrade(e.target.value)}
                              className="w-full border border-gray-200 rounded p-2 bg-white"
                              placeholder="e.g. 95 / 100"
                              required
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-600 mb-1">Custom Rubrics & Critique</label>
                            <textarea 
                              value={rubricFb}
                              onChange={(e) => setRubricFb(e.target.value)}
                              rows={4}
                              className="w-full border border-gray-200 rounded p-2 bg-white outline-hidden focus:border-blue-500 leading-relaxed"
                              required
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
                          >
                            Submit Assessment Grade
                          </button>
                        </form>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400 text-xs">
                  <FileText className="w-8 h-8 mb-2" />
                  Select an assignment submission to inspect content and post grades.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Course Dropout vs Completion Analytics</h2>
          <p className="text-xs text-gray-400">Interactive telemetry comparing active module completers with verified drop-offs, useful for targeted risk intervention and study reminders.</p>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCompleters}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completions" fill="#10b981" name="Successful Completions" stackId="a" />
                <Bar dataKey="dropouts" fill="#ef4444" name="Targeted Dropouts / Non-Active" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
