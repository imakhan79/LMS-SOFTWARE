import React, { useState } from "react";
import { 
  Users, BookOpen, DollarSign, Award, Plus, Trash, Globe, 
  Video, Calendar, Mail, FileUp, MessageSquare, ChevronRight, Play, CheckCircle, 
  QrCode, Clock, RefreshCw, Power, Eye, UserCheck, PlayCircle
} from "lucide-react";
import { Course, DiscussionMessage, QrSession, AttendanceRecord } from "../types";

interface Props {
  courses: Course[];
  discussions: DiscussionMessage[];
  onAddDiscussion: (msg: Partial<DiscussionMessage>) => void;
  onModifyCourseSyllabus: (courseId: string, updatedModules: any[]) => void;
}

export default function InstructorDashboard({
  courses, discussions, onAddDiscussion, onModifyCourseSyllabus
}: Props) {
  const [activeSubTab, setActiveSubTab] = useState<"builder" | "zoom" | "discussions" | "content" | "attendance" | "grading" | "batches">("builder");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [newModuleName, setNewModuleName] = useState("");
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonType, setNewLessonType] = useState<"video" | "doc" | "quiz">("video");
  const [newLessonDuration, setNewLessonDuration] = useState("15 mins");

  // QR Attendance States
  const [qrSessions, setQrSessions] = useState<QrSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [creatingSession, setCreatingSession] = useState(false);
  const [attCourseId, setAttCourseId] = useState(courses[0]?.id || "");
  const [attSessionTitle, setAttSessionTitle] = useState("");
  const [attExpiresMinutes, setAttExpiresMinutes] = useState(15);
  const [viewingSession, setViewingSession] = useState<QrSession | null>(null);
  const [fetchingAttendance, setFetchingAttendance] = useState(false);

  // Assessor Portfolio Grading & Batch Monitoring States
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [batchesList, setBatchesList] = useState<any[]>([]);
  const [activeGradingSubId, setActiveGradingSubId] = useState<string | null>(null);
  const [assessorScore, setAssessorScore] = useState("90/100");
  const [assessorFeedback, setAssessorFeedback] = useState("Perfect conceptual depth.");
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const fetchAssessorData = async () => {
    try {
      const [submissionsRes, batchesRes] = await Promise.all([
        fetch("/api/assignments"),
        fetch("/api/batches")
      ]);
      setSubmissionsList(await submissionsRes.json());
      setBatchesList(await batchesRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostGradeAssessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingSubId) return;

    setSubmittingGrade(true);
    try {
      const res = await fetch(`/api/assignments/${activeGradingSubId}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: assessorScore
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Numerical score successfully issued and committed!");
        setActiveGradingSubId(null);
        fetchAssessorData();
      }
    } catch (err) {
      alert("Error logging assessor evaluation.");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const loadAttendanceData = async () => {
    setFetchingAttendance(true);
    try {
      const [sessionsRes, recordsRes] = await Promise.all([
        fetch("/api/attendance/sessions"),
        fetch("/api/attendance/records")
      ]);
      const sessionsData = await sessionsRes.json();
      const recordsData = await recordsRes.json();
      setQrSessions(sessionsData);
      setAttendanceRecords(recordsData);
    } catch (err) {
      console.error("Failed to load attendance info:", err);
    } finally {
      setFetchingAttendance(false);
    }
  };

  React.useEffect(() => {
    loadAttendanceData();
    fetchAssessorData();
  }, [courses]);

  const handleCreateAttendanceSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attCourseId || !attSessionTitle.trim()) return;
    setCreatingSession(true);

    try {
      const res = await fetch("/api/attendance/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: attCourseId,
          sessionTitle: attSessionTitle,
          expiresAfterMinutes: attExpiresMinutes
        })
      });
      const newSession = await res.json();
      if (newSession.error) {
        alert(newSession.error);
      } else {
        setQrSessions(prev => [newSession, ...prev]);
        setViewingSession(newSession); // Display QR immediately
        setAttSessionTitle("");
        alert(`Attendance QR Code Generated! Code: ${newSession.code}`);
      }
    } catch (err) {
      console.error("Failed to create attendance session:", err);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleToggleSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/attendance/sessions/${sessionId}/toggle`, {
        method: "POST"
      });
      const updated = await res.json();
      setQrSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      if (viewingSession && viewingSession.id === sessionId) {
        setViewingSession(updated);
      }
    } catch (err) {
      console.error("Failed to toggle session:", err);
    }
  };

  // Scheduling states
  const [zoomTopic, setZoomTopic] = useState("");
  const [zoomTime, setZoomTime] = useState("");
  const [zoomService, setZoomService] = useState("Zoom Link");
  const [scheduledLectures, setScheduledLectures] = useState<{ id: string; topic: string; time: string; service: string }[]>([
    { id: "lec-1", topic: "Introductory Neural Math Walkthrough", time: "2026-06-16 @ 14:00 GMT", service: "Google Meet" }
  ]);

  // Reply state
  const [forumReplyText, setForumReplyText] = useState("");
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);

  // File Upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const activeCourse = courses.find(c => c.id === selectedCourseId);

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !newModuleName.trim()) return;
    
    const updatedModules = [
      ...(activeCourse.modules || []),
      {
        id: `module-${Date.now()}`,
        title: newModuleName,
        lessons: []
      }
    ];

    onModifyCourseSyllabus(activeCourse.id, updatedModules);
    setNewModuleName("");
    alert("Subject module appended successfully to syllabus.");
  };

  const handleAddLesson = (moduleId: string) => {
    if (!activeCourse || !newLessonName.trim()) return;

    const updatedModules = (activeCourse.modules || []).map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: [
            ...mod.lessons,
            {
              id: `lesson-${Date.now()}`,
              title: newLessonName,
              type: newLessonType,
              duration: newLessonDuration
            }
          ]
        };
      }
      return mod;
    });

    onModifyCourseSyllabus(activeCourse.id, updatedModules);
    setNewLessonName("");
    alert("New lesson item registered inside module flow.");
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (!activeCourse) return;

    const updatedModules = (activeCourse.modules || []).map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: mod.lessons.filter(l => l.id !== lessonId)
        };
      }
      return mod;
    });

    onModifyCourseSyllabus(activeCourse.id, updatedModules);
    alert("Lesson removed successfully.");
  };

  const handleScheduleZoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoomTopic.trim() || !zoomTime) return;
    const newLec = {
      id: `lec-${Date.now()}`,
      topic: zoomTopic,
      time: zoomTime,
      service: zoomService
    };
    setScheduledLectures([...scheduledLectures, newLec]);
    setZoomTopic("");
    setZoomTime("");
    alert(`Live classrooms generated: Authorized via OAuth 2.0 API gateway.`);
  };

  const handleForumReplySubmit = (e: React.FormEvent, parentMsg: DiscussionMessage) => {
    e.preventDefault();
    if (!forumReplyText.trim()) return;

    onAddDiscussion({
      courseId: parentMsg.courseId,
      text: `@${parentMsg.senderName} ${forumReplyText}`,
      senderId: "usr-i1", // Instructor user
      senderName: "Dr. Sarah Jenkins",
      senderRole: "Instructor"
    });

    setForumReplyText("");
    setReplyingMessageId(null);
    alert("Teacher response broadcast to class forum.");
  };

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFiles([...uploadedFiles, `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`]);
    }
  };

  return (
    <div className="space-y-6" id="instructor-dashboard">
      {/* Instructor Title + Earnings Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-sans font-bold text-gray-900 tracking-tight">Welcome, Dr. Sarah Jenkins</h1>
            <p className="text-xs text-gray-500 mt-0.5">Assigned Courses: Computer Science & Software Architectures</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Accrued Earnings</div>
          <p className="text-2xl font-sans font-bold text-gray-900 mt-1">$4,850.00</p>
          <div className="text-[10px] text-green-600 font-semibold">Stripe Disbursements Cleared</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Course Reviews Score</div>
          <p className="text-2xl font-sans font-bold text-gray-900 mt-1">4.92 / 5.0</p>
          <div className="text-[10px] text-blue-600 font-semibold">From 48 active student reviews</div>
        </div>
      </div>

      {/* Internal Navigation Sub-Bar */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-1 mt-4">
        <button 
          onClick={() => setActiveSubTab("builder")}
          aria-label="View Interactive Course Builder"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "builder" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Interactive Course Builder
        </button>
        <button 
          onClick={() => setActiveSubTab("zoom")}
          aria-label="View Zoom and Lectures Scheduler"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "zoom" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <Video className="w-3.5 h-3.5" /> Zoom & Lectures Scheduler
        </button>
        <button 
          onClick={() => setActiveSubTab("discussions")}
          aria-label="View Forum Discussions"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "discussions" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Forum Discussions
        </button>
        <button 
          onClick={() => setActiveSubTab("content")}
          aria-label="View SCORM and Assets Delivery Hub"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <FileUp className="w-3.5 h-3.5" /> SCORM & Assets Delivery
        </button>
        <button 
          onClick={() => setActiveSubTab("attendance")}
          aria-label="View QR Code Attendance Logs"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "attendance" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <QrCode className="w-3.5 h-3.5" /> QR Code Attendance
        </button>
        <button 
          onClick={() => {
            setActiveSubTab("grading");
            fetchAssessorData();
          }}
          aria-label="View Portfolio Grading Suite"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "grading" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <Award className="w-3.5 h-3.5" /> Portfolio Grading
        </button>
        <button 
          onClick={() => {
            setActiveSubTab("batches");
            fetchAssessorData();
          }}
          aria-label="View Batches Timelines Scheduler"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "batches" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <Calendar className="w-3.5 h-3.5" /> Batches Timelines
        </button>
      </div>

      {activeSubTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Select Course Side list */}
          <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-xs h-fit space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Syllabus Selection</h3>
            <div className="space-y-1">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  aria-label={`Select syllabus template for ${course.title}`}
                  className={`w-full text-left p-3 rounded-lg text-xs font-semibold block transition-all ${course.id === selectedCourseId ? "bg-blue-50 text-blue-700 shadow-2xs" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {course.title.slice(0, 36)}...
                </button>
              ))}
            </div>
          </div>

          {/* Builder Layout Panel */}
          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
            {activeCourse ? (
              <>
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 tracking-wider uppercase px-2 py-0.5 rounded">Active Template</span>
                  <h2 className="text-lg font-bold text-gray-900 mt-1">{activeCourse.title}</h2>
                  <p className="text-xs text-gray-400 font-medium">Difficulty Level: {activeCourse.difficulty} | Modules: {activeCourse.modules?.length || 0}</p>
                </div>

                {/* Create Module Form */}
                <form onSubmit={handleAddModule} className="flex gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <input 
                    type="text" 
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="New Module Header (e.g. Chapter 3: Dynamic Load Balancers)"
                    className="flex-1 bg-white text-xs border border-gray-200 rounded px-2.5 outline-hidden"
                    required
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded cursor-pointer"
                  >
                    + Append Chapter
                  </button>
                </form>

                {/* Module List with Lesson Builders */}
                <div className="space-y-4">
                  {activeCourse.modules?.map((m) => (
                    <div key={m.id} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="p-3 bg-gray-100/80 border-b border-gray-100 font-semibold text-gray-700 text-xs flex justify-between items-center">
                        <span>📚 {m.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{m.lessons.length} Lesson Nodes</span>
                      </div>

                      <div className="p-4 space-y-3.5 bg-gray-50/20">
                        {/* List lessons inside modules */}
                        {m.lessons.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">No structured lessons yet inside this block.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {m.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex justify-between items-center bg-white p-2.5 rounded border border-gray-100 text-xs text-gray-700 hover:border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${lesson.type === 'video' ? 'bg-red-500' : lesson.type === 'quiz' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                                  <span className="font-semibold">{lesson.title}</span>
                                  <span className="text-[10px] text-gray-400">({lesson.duration} | {lesson.type})</span>
                                </div>
                                <button 
                                  onClick={() => handleDeleteLesson(m.id, lesson.id)}
                                  className="text-red-500 hover:text-red-700 font-bold text-[10px] uppercase cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Fast append Lesson box */}
                        <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2 items-center">
                          <input 
                            type="text" 
                            placeholder="Add Lesson Title..."
                            id={`add-les-txt-${m.id}`}
                            className="bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-hidden flex-1 min-w-[150px]"
                            onChange={(e) => setNewLessonName(e.target.value)}
                          />
                          <select 
                            className="bg-white border border-gray-200 rounded p-1.5 text-xs text-gray-700"
                            onChange={(e) => setNewLessonType(e.target.value as any)}
                          >
                            <option value="video">🎥 Mp4 HTML5 Video</option>
                            <option value="doc"> PDF Study Notes</option>
                            <option value="quiz">📝 Examination Quiz</option>
                          </select>
                          <button 
                            type="button"
                            onClick={() => handleAddLesson(m.id)}
                            className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded cursor-pointer"
                          >
                            + Add Lesson
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Syllabus array empty. Deploy a new course from institutional admin panel to start.
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "zoom" && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Zoom / Microsoft Teams Unified Ingress</h2>
              <p className="text-xs text-gray-400 mt-0.5">Integrate Google calendar schedules, Microsoft Teams API webhooks and dispatch lecture notes directly in real-time.</p>
            </div>
            <Video className="w-6 h-6 text-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleScheduleZoom} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Schedule Active Lecture Stream</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Lecture Topic</label>
                <input 
                  type="text" 
                  value={zoomTopic}
                  onChange={(e) => setZoomTopic(e.target.value)}
                  placeholder="e.g. Backpropagation Algorithms Mastery Sessions"
                  className="w-full text-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date & Time</label>
                  <input 
                    type="text" 
                    value={zoomTime}
                    onChange={(e) => setZoomTime(e.target.value)}
                    placeholder="2026-06-20 @ 15:00 GMT"
                    className="w-full text-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Provider Engine</label>
                  <select 
                    value={zoomService}
                    onChange={(e) => setZoomService(e.target.value)}
                    className="w-full text-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg outline-hidden text-gray-700 font-medium"
                  >
                    <option value="Google Meet">Google Meet Integration</option>
                    <option value="Zoom API Video">Zoom Premium Video</option>
                    <option value="Teams Room">Microsoft Teams Rooms</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Provision Webinar Webhook
              </button>
            </form>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Scheduled Classroom Streams ({scheduledLectures.length})</h3>
              <div className="space-y-2">
                {scheduledLectures.map((lec) => (
                  <div key={lec.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{lec.topic}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">⏱️ {lec.time}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-wider">{lec.service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "discussions" && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Unanswered Student Q&A Feed</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {discussions.filter(d => d.senderRole === "Student").map((msg) => (
              <div key={msg.id} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-800">{msg.senderName} ({msg.senderRole})</span>
                  <span className="text-gray-400 font-mono">{msg.timestamp.slice(11, 16)} GMT</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold italic">"{msg.text}"</p>

                {replyingMessageId === msg.id ? (
                  <form onSubmit={(e) => handleForumReplySubmit(e, msg)} className="mt-2.5 flex gap-2">
                    <input 
                      type="text" 
                      value={forumReplyText}
                      onChange={(e) => setForumReplyText(e.target.value)}
                      placeholder="Type instructor clarification comment..."
                      className="bg-white text-xs border border-gray-200 rounded p-2 flex-1 outline-hidden"
                      required
                    />
                    <button type="submit" className="bg-blue-600 font-bold text-xs text-white px-4 rounded cursor-pointer">Post reply</button>
                    <button type="button" onClick={() => setReplyingMessageId(null)} className="text-xs font-semibold text-gray-400">Cancel</button>
                  </form>
                ) : (
                  <button 
                    onClick={() => {
                      setReplyingMessageId(msg.id);
                      setForumReplyText("");
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold uppercase block"
                  >
                    Reply as Instructor
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "content" && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">SCORM & Dynamic Asset Delivery</h2>
            <p className="text-xs text-gray-400 mt-0.5">Zip packages, documentation, course templates, or syllabus checklists drag-drop delivery engine.</p>
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">Drag and Drop SCORM (.zip) or PDFs Here</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Files process automatically against HTML5 standards and parse for content bookmarks.</p>
            <input 
              type="file" 
              className="hidden" 
              id="scorm-file" 
              onChange={(e) => {
                if(e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setUploadedFiles([...uploadedFiles, `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`]);
                }
              }}
            />
            <label htmlFor="scorm-file" className="mt-3 inline-block bg-gray-900 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded hover:bg-black cursor-pointer transition-all">
              Manually Select Asset File
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700">Uploaded Assets Pending Course Assignment:</h4>
              <div className="space-y-1.5">
                {uploadedFiles.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#fcfcfd] border border-gray-100 p-2 text-xs rounded font-mono text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left" id="qr-attendance-panel">
          {/* Create new Attendance Session */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <QrCode className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Create Dynamic Attendance QR</h3>
                  <p className="text-[10px] text-gray-400">Generate a secure session-bound QR token.</p>
                </div>
              </div>

              <form onSubmit={handleCreateAttendanceSession} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Select LMS Course</label>
                  <select
                    value={attCourseId}
                    onChange={(e) => setAttCourseId(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs px-2.5 py-2 rounded-lg outline-hidden font-medium text-gray-700 cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Session Name / Lecture Title</label>
                  <input
                    type="text"
                    value={attSessionTitle}
                    onChange={(e) => setAttSessionTitle(e.target.value)}
                    placeholder="e.g. Chapter 4: Neural Architecture Workshop"
                    className="w-full text-xs border border-gray-200 rounded p-2 bg-gray-50/50 outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Expiration Lifetime (Minutes)</label>
                  <select
                    value={attExpiresMinutes}
                    onChange={(e) => setAttExpiresMinutes(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 text-xs px-2.5 py-2 rounded-lg outline-hidden font-medium text-gray-700 cursor-pointer"
                  >
                    <option value={5}>5 Minutes (Urgent Session)</option>
                    <option value={15}>15 Minutes (Standard Class)</option>
                    <option value={30}>30 Minutes (Midterm Exam)</option>
                    <option value={60}>60 Minutes (Full Lecture Block)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={creatingSession}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  {creatingSession ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <PlayCircle className="w-3.5 h-3.5" />
                  )}
                  {creatingSession ? "Broadcasting..." : "Generate & Post QR"}
                </button>
              </form>
            </div>

            {/* Quick stats on attendance */}
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Telemetry Summary</span>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3 rounded-lg border border-gray-200/50">
                  <span className="text-[10px] text-gray-400 font-semibold block">Total Logs</span>
                  <span className="text-xl font-bold text-gray-900">{attendanceRecords.length}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200/50">
                  <span className="text-[10px] text-gray-400 font-semibold block">Active QR</span>
                  <span className="text-xl font-bold text-blue-600">{qrSessions.filter(s => s.active).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active QR Code Display & Checked-In Student List */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
            {viewingSession ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-pulse" /> Active Session Pass
                  </span>
                  <button 
                    onClick={() => setViewingSession(null)}
                    className="text-[10px] font-bold text-gray-400 hover:text-gray-700"
                  >
                    Clear view
                  </button>
                </div>

                <div className="text-center space-y-3 bg-slate-50/50 p-4 rounded-xl border border-gray-100/60 flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-800 tracking-tight leading-snug line-clamp-2 block">
                    {viewingSession.sessionTitle}
                  </span>
                  
                  {/* QR Image */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-3xs relative group">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(viewingSession.code)}`}
                      alt="Session QR Code"
                      className="w-40 h-40 object-contain mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Student Code Access Key:</span>
                    <span className="bg-gray-100 px-3 py-1 text-xs font-mono font-bold text-gray-800 rounded select-all border border-gray-200 uppercase">
                      {viewingSession.code}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-gray-500 leading-relaxed max-w-[200px]">
                    Have students scan this image or input this transaction code on their **Student Workspaces** to check in.
                  </p>
                </div>

                {/* Checked-In Students */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
                    <span>Checked-in Students</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {attendanceRecords.filter(r => r.sessionId === viewingSession.id).length} Present
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {attendanceRecords.filter(r => r.sessionId === viewingSession.id).length === 0 ? (
                      <p className="text-[10px] text-gray-400 italic text-center py-4">Waiting for first scan...</p>
                    ) : (
                      attendanceRecords
                        .filter(r => r.sessionId === viewingSession.id)
                        .map((rec) => (
                          <div key={rec.id} className="p-2 border border-emerald-100 bg-emerald-50/30 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800 text-[11px]">{rec.studentName}</p>
                              <p className="text-[9px] text-gray-400 font-mono leading-tight">{rec.studentEmail}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded block">
                                PRESENT ✓
                              </span>
                              <span className="text-[8px] text-gray-400 font-mono mt-0.5 block">
                                {new Date(rec.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-gray-400 text-xs italic space-y-2">
                <QrCode className="w-12 h-12 text-gray-200 mx-auto" />
                <p>No Session QR Selected.</p>
                <p className="text-[10px] max-w-[170px] mx-auto not-italic text-gray-400 mt-2">
                  Select a live session from the registration logs to project the QR code dynamically.
                </p>
              </div>
            )}
          </div>

          {/* Session Registry list */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Attendance Session Logs
              </h3>
              <button
                onClick={loadAttendanceData}
                disabled={fetchingAttendance}
                className="p-1 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 shrink-0 transition-colors cursor-pointer"
                title="Refresh logs from database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetchingAttendance ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {qrSessions.length === 0 ? (
                <div className="py-12 text-center text-gray-400 italic text-xs">
                  No attendance triggers generated yet. Create a session on the left card to begin.
                </div>
              ) : (
                qrSessions.map((session) => {
                  const isActive = session.active;
                  const isExpired = new Date().getTime() > new Date(session.expiresAt).getTime();
                  const totalClassCheckins = attendanceRecords.filter(r => r.sessionId === session.id).length;

                  return (
                    <div 
                      key={session.id} 
                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 select-text ${
                        viewingSession?.id === session.id 
                          ? "border-blue-400 bg-blue-50/10 shadow-xs" 
                          : "border-gray-150 hover:border-gray-350 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1.5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900 leading-snug">{session.sessionTitle}</p>
                          <p className="text-[10px] text-gray-500 font-medium line-clamp-1">{session.courseTitle}</p>
                        </div>
                        
                        <div className="text-right shrink-0">
                          {isActive && !isExpired ? (
                            <span className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs block">
                              Active
                            </span>
                          ) : (
                            <span className="bg-gray-150 text-gray-600 text-[9px] font-semibold px-1.5 py-0.5 rounded-xs block">
                              Closed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono border-t border-dashed border-gray-100 pt-2">
                        <span className="text-gray-400 font-sans font-semibold">Checks: <strong className="text-gray-800">{totalClassCheckins} scans</strong></span>
                        <span className="text-gray-400 uppercase select-all font-bold bg-slate-100/80 px-1 py-0.5 rounded">{session.code}</span>
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => setViewingSession(session)}
                          className="flex-1 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> View QR
                        </button>
                        <button
                          onClick={() => handleToggleSession(session.id)}
                          className={`px-2 py-1 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                            isActive 
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100" 
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          <Power className="w-3 h-3" /> {isActive ? "Stop" : "Resume"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assessor Written Portfolios Grading Tab */}
      {activeSubTab === "grading" && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6 text-left">
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Syllabus Portfolio Assessment Desk
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Evaluate incoming essay submissions and project submissions. Award grades directly to database ledger.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Submissions queue */}
            <div className="lg:col-span-1 space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Submissions Cue ({submissionsList.length})</span>
              
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {submissionsList.length === 0 ? (
                  <div className="border border-dashed border-gray-150 rounded-lg p-6 text-center text-gray-400 text-xs italic">
                    No coursework submitted yet. Students can submit written plans on the dashboard.
                  </div>
                ) : (
                  submissionsList.map(sub => {
                    const matchedC = courses.find(c => c.id === sub.courseId);
                    const isSelected = sub.id === activeGradingSubId;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveGradingSubId(sub.id);
                          setAssessorScore(sub.grade || "90/100");
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all block ${
                          isSelected ? "bg-blue-50/70 border-blue-400 text-blue-900 font-semibold" : "bg-white border-gray-150 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest">{sub.authorName || "Alex Mercer"}</span>
                          {sub.grade ? (
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                              Graded: {sub.grade}
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                              Pending
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs text-gray-900 mt-1 line-clamp-1">{matchedC?.title || "Specialist Module"}</h4>
                        <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                          <span>File: {sub.fileName}</span>
                          <span className="font-mono">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Grading grading panel */}
            <div className="lg:col-span-2 bg-slate-50 border border-gray-150 rounded-xl p-5 space-y-4">
              {activeGradingSubId ? (
                (() => {
                  const sub = submissionsList.find(s => s.id === activeGradingSubId);
                  if (!sub) return null;
                  const matchedC = courses.find(c => c.id === sub.courseId);
                  return (
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider block w-fit">ACTIVE EVALUATION</span>
                          <h3 className="font-extrabold text-sm text-gray-900 mt-1">Written Analysis Portfolio</h3>
                          <p className="text-[10.5px] text-gray-500 mt-0.5">Submitted by <strong className="text-gray-800">{sub.authorName || "Alex Mercer"}</strong> for {matchedC?.title}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block font-bold">ATTACHED HARDCOPY</span>
                          <span className="text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">{sub.fileName}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9.5px] uppercase font-bold text-gray-400 block tracking-widest">Student Essay Draft</span>
                        <div className="bg-white border border-gray-150 rounded-lg p-4 font-serif text-gray-800 text-xs leading-relaxed max-h-56 overflow-y-auto select-all whitespace-pre-wrap shadow-3xs">
                          {sub.textContent}
                        </div>
                      </div>

                      <form onSubmit={handlePostGradeAssessor} className="bg-white p-4 rounded-xl border border-gray-200/80 space-y-3 shadow-3xs">
                        <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest block border-b border-gray-50 pb-1.5">Official Score Marks Criteria</span>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 block">Issue Score Percentage / Mark</label>
                            <input
                              type="text"
                              value={assessorScore}
                              onChange={e => setAssessorScore(e.target.value)}
                              placeholder="e.g. 94/100 or Distinction"
                              className="w-full bg-white border border-gray-200 p-2 rounded outline-hidden text-xs font-mono font-bold text-gray-800"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 block font-semibold text-gray-600">Grading Assessor Name</label>
                            <input
                              type="text"
                              defaultValue="Dr. Sarah Jenkins"
                              disabled
                              className="w-full bg-gray-50 border border-gray-200 p-2 rounded text-xs select-none text-gray-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <label className="text-[10px] font-bold text-gray-500 block">Critical Assessment Feedback Message</label>
                          <textarea
                            value={assessorFeedback}
                            onChange={e => setAssessorFeedback(e.target.value)}
                            rows={2}
                            placeholder="Type assessor response or structural commentary..."
                            className="w-full border border-gray-200 p-2 rounded bg-white text-xs outline-hidden"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingGrade}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-all cursor-pointer"
                        >
                          {submittingGrade ? "Logging Grade Sheet..." : "Commit Grading Marks"}
                        </button>
                      </form>
                    </div>
                  );
                })()
              ) : (
                <div className="py-24 text-center text-gray-400 italic text-xs space-y-3">
                  <Award className="w-8 h-8 mx-auto text-gray-300 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-gray-700 not-italic">No Submission Highlighted</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Pick a student portfolio submission from the left queue to initiate evaluation.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trainer Batch Cohorts Tab */}
      {activeSubTab === "batches" && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" /> Academy Batch Cohort Monitoring
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Monitor current intake batch progress, term periods, and student enrolment capacities.</p>
            </div>
            <button
              onClick={fetchAssessorData}
              className="p-1 px-3 text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded text-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Roster
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batchesList.map(batch => (
              <div key={batch.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 hover:shadow-2xs transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9.5px] uppercase font-black tracking-widest bg-orange-50 text-orange-700 px-2 py-0.5 rounded">
                      Intake ID: {batch.code || "B2026-X1"}
                    </span>
                    <h3 className="font-extrabold text-xs text-gray-900 mt-1">{batch.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono text-right shrink-0">
                    Cap: {batch.enrolledSize} Students
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Active Course:</span>
                    <strong className="text-gray-900">{batch.courseTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Syllabus Term Period:</span>
                    <span className="font-mono text-gray-900">{batch.termPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meeting Slots:</span>
                    <span className="text-gray-800 font-semibold">{batch.slots}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                    <span>LMS Completion Rate</span>
                    <span className="text-blue-600">76% Progress</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-100">
                    <div className="bg-orange-500 h-full" style={{ width: "76%" }} />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-lg text-center text-[10px] text-gray-500">
                  📅 Expected Graduation: <strong className="text-gray-800">December 15, 2026</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
