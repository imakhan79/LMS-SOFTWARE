import React, { useState, useEffect } from "react";
import { 
  BookOpen, Video, Award, RefreshCw, MessageSquare, Plus, Save, Play, ChevronRight,
  Shield, Camera, CheckSquare, Sparkles, BookMarked, Printer, AlertTriangle, Eye, RefreshCcw, QrCode
} from "lucide-react";
import { Course, Enrollment, DiscussionMessage, ExamSubmission, CourseNote } from "../types";

interface Props {
  courses: Course[];
  enrollments: Enrollment[];
  discussions: DiscussionMessage[];
  exams: ExamSubmission[];
  onEnrollCourse: (courseId: string) => void;
  onUpdateProgress: (enrId: string, progress: number) => void;
  onAddNote: (enrId: string, lessonId: string, content: string) => void;
  onAddDiscussion: (msg: Partial<DiscussionMessage>) => void;
  onSubmitExam: (exam: Partial<ExamSubmission>) => void;
}

export default function StudentDashboard({
  courses, enrollments, discussions, exams, onEnrollCourse, onUpdateProgress, onAddNote, onAddDiscussion, onSubmitExam
}: Props) {
  const [selectedEnrId, setSelectedEnrId] = useState<string>(enrollments[0]?.id || "");
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [noteContent, setNoteContent] = useState("");
  const [forumText, setForumText] = useState("");

  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiHistory, setAiHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! I am your AI Study Companion. How can I help clarify any course concepts or generate sample exercises for you today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // AI Quiz Generator states
  const [aiQuizTopic, setAiQuizTopic] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState<{ quizTitle: string; questions: any[] } | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Proctor Exam Mode
  const [proctorExamActive, setProctorExamActive] = useState(false);
  const [proctorTimer, setProctorTimer] = useState(60); // 60s quiz
  const [cameraOn, setCameraOn] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [cheatLogs, setCheatLogs] = useState<string[]>([]);
  const [proctorScore, setProctorScore] = useState<number | null>(null);
  const [proctorQuizAnswers, setProctorQuizAnswers] = useState<Record<string, string>>({});

  // Classroom QR Check-In States
  const [attendanceCode, setAttendanceCode] = useState("");
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [scanningActive, setScanningActive] = useState(false);
  const [scanStatus, setScanStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [scannedSession, setScannedSession] = useState<any | null>(null);

  const fetchStudentAttendanceRecords = async () => {
    try {
      const res = await fetch("/api/attendance/records?studentId=usr-s1");
      const data = await res.json();
      setAttendanceLogs(data);
    } catch (err) {
      console.error("Failed to load student attendance logs:", err);
    }
  };

  useEffect(() => {
    fetchStudentAttendanceRecords();
  }, []);

  const handleVerifyAttendanceCode = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setVerificationLoading(true);
    setScanStatus(null);
    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "usr-s1",
          code: codeToVerify.trim()
        })
      });
      const data = await res.json();
      if (data.error) {
        setScanStatus({ success: false, message: data.error });
      } else {
        setScanStatus({ success: true, message: `Successfully verified! Welcome to class session. You've been awarded +50 XP!` });
        setAttendanceCode("");
        fetchStudentAttendanceRecords();
      }
    } catch (err) {
      setScanStatus({ success: false, message: "Server connection failed. Could not verify attendance." });
    } finally {
      setVerificationLoading(false);
    }
  };

  // AI Course Recommendations states
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Artificial Intelligence", "Information Technology"]);
  const [customInterestInput, setCustomInterestInput] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [personalizedPath, setPersonalizedPath] = useState<any>(null);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsTopic, setRecsTopic] = useState("");

  const defaultInterestTags = [
    "Artificial Intelligence",
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Cybersecurity",
    "Cloud Computing",
    "Data Science",
    "Microservices"
  ];

  const fetchAiRecommendations = async () => {
    setRecsLoading(true);
    try {
      const res = await fetch("/api/ai/recommend-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "usr-s1",
          interests: selectedInterests
        })
      });
      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
      if (data.personalizedPath) {
        setPersonalizedPath(data.personalizedPath);
      }
      if (data.personalizedTopic) {
        setRecsTopic(data.personalizedTopic);
      }
    } catch (err) {
      console.error("Failed to load AI course recommendations:", err);
    } finally {
      setRecsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiRecommendations();
  }, [selectedInterests]);

  const handleToggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedInterests(prev => [...prev, tag]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInterestInput.trim()) return;
    const item = customInterestInput.trim();
    if (!selectedInterests.includes(item)) {
      setSelectedInterests(prev => [...prev, item]);
    }
    setCustomInterestInput("");
  };

  const activeEnrollment = enrollments.find(e => e.id === selectedEnrId);
  const activeCourse = activeEnrollment ? courses.find(c => c.id === activeEnrollment.courseId) : null;

  // Set initial lesson when active course shifts
  useEffect(() => {
    if (activeCourse && activeCourse.modules?.[0]?.lessons?.[0]) {
      setActiveLessonId(activeCourse.modules[0].lessons[0].id);
    }
  }, [selectedEnrId, activeCourse]);

  // Proctor count down timer
  useEffect(() => {
    let interval: any;
    if (proctorExamActive && proctorTimer > 0) {
      interval = setInterval(() => {
        setProctorTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmitProctor();
            return 0;
          }
          return prev - 1;
        });

        // Simulate anti-cheating face triggers periodically
        if (Math.random() < 0.1) {
          setFaceDetected(false);
          setCheatLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ALERT: No face detected in frame. Webcam monitored.`]);
        } else if (Math.random() < 0.05) {
          setCheatLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] WARNING: Secondary screen or browser focus change detected!`]);
        } else {
          setFaceDetected(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [proctorExamActive, proctorTimer]);

  const handleTriggerAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiPrompt("");
    setAiHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setAiLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: aiHistory,
          context: activeCourse ? activeCourse.title : "Corporate Training Curriculums"
        })
      });
      const data = await response.json();
      setAiHistory(prev => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      setAiHistory(prev => [...prev, { sender: "ai", text: "Fallback AI clarification: The backpropagation cycles adjust neuron parameters using gradients derived from the structural cost function." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAiQuiz = async () => {
    if (!activeCourse) return;
    setQuizLoading(true);
    setQuizScore(null);
    setQuizAnswers({});
    const topic = activeCourse.title;

    try {
      const res = await fetch("/api/ai/quiz-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setGeneratedQuiz(data);
    } catch (err) {
      // Fallback
      setGeneratedQuiz({
        quizTitle: `Rapid Review on ${topic}`,
        questions: [
          { id: "q_x1", question: "In horizontal scaling architectures, redundancy is usually achieved via:", options: ["Single powerful master nodes", "A stateless server fleet with load balancers", "Client side offline storage", "Upgrading container RAM configurations"], correctIdx: 1, explanation: "Statelessness allows spin-up of multiple containers that balance user connections easily." }
        ]
      });
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGradeGeneratedQuiz = () => {
    if (!generatedQuiz) return;
    let correct = 0;
    generatedQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[q.id] === q.correctIdx) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / generatedQuiz.questions.length) * 100);
    setQuizScore(finalScore);
    alert(`Quiz completed. Your score: ${finalScore}%`);
  };

  const handleStartProctorExam = () => {
    setProctorExamActive(true);
    setProctorTimer(60);
    setCameraOn(true);
    setFaceDetected(true);
    setCheatLogs([`[${new Date().toLocaleTimeString()}] Secure AI Proctoring initialized. Web micro-check activated.`]);
    setProctorQuizAnswers({});
    setProctorScore(null);
  };

  const handleAutoSubmitProctor = () => {
    setProctorExamActive(false);
    setCameraOn(false);

    // Score calculations
    let scoreVal = 100;
    if (cheatLogs.length > 2) {
      scoreVal -= 30; // penalty for cheating alerts
    }
    setProctorScore(scoreVal);

    onSubmitExam({
      courseId: activeCourse?.id || "course-1",
      quizTitle: "Unified Performance Verification Assessment",
      score: scoreVal,
      passed: scoreVal >= 60,
      answers: proctorQuizAnswers,
      faceVerified: true
    });
  };

  const handleAddCourseNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnrollment || !noteContent.trim()) return;
    onAddNote(activeEnrollment.id, activeLessonId, noteContent);
    setNoteContent("");
    alert("Lecture bookmark saved.");
  };

  const handleTriggerForumMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !forumText.trim()) return;
    onAddDiscussion({
      courseId: activeCourse.id,
      text: forumText,
      senderId: "usr-s1",
      senderName: "Alex Mercer",
      senderRole: "Student"
    });
    setForumText("");
    alert("Message cast to course thread.");
  };

  const handleCompleteCurrentLesson = () => {
    if (!activeEnrollment || !activeCourse) return;
    const currentProgress = activeEnrollment.progress;
    const added = Math.min(100, currentProgress + 15);
    onUpdateProgress(activeEnrollment.id, added);
    alert(`Lesson Completed! Platform progress increased to: ${added}%`);
  };

  return (
    <div className="space-y-6" id="student-dashboard">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-gray-900 tracking-tight">Active Student Learning Hub</h1>
          <p className="text-sm text-gray-500">Track active enrollments, resume lessons, trigger exams, and leverage real Gemini AI study aids.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enrollments / Course switcher Sidebar list */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Enrolled Courses</h3>
          <div className="space-y-1.5">
            {enrollments.map((enr) => {
              const matchedC = courses.find(c => c.id === enr.courseId);
              if (!matchedC) return null;
              return (
                <button
                  key={enr.id}
                  onClick={() => setSelectedEnrId(enr.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all block ${enr.id === selectedEnrId ? "bg-blue-50 border-blue-200 text-blue-700 font-bold" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
                >
                  <p className="line-clamp-1">{matchedC.title}</p>
                  <div className="mt-2 text-[10px] text-gray-400 flex justify-between items-center">
                    <span>Progress:</span>
                    <span className="font-semibold text-gray-700">{enr.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${enr.progress}%` }}></div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Classroom QR Code Attendance Check-In */}
          <div className="border-t border-gray-150 pt-4 space-y-3" id="student-qr-attendance">
            <div className="flex items-center gap-1.5 px-1">
              <QrCode className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Classroom Check-In</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-gray-150 space-y-3">
              {scanStatus && (
                <div className={`p-2 rounded-lg text-[10.5px] leading-relaxed font-semibold transition-all ${scanStatus.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-250"}`}>
                  <p>{scanStatus.message}</p>
                </div>
              )}

              {/* Toggle Manual input vs Simulated Camera Lens */}
              {!scanningActive ? (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Enter Session Token</span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={attendanceCode}
                        onChange={(e) => setAttendanceCode(e.target.value.toUpperCase())}
                        placeholder="e.g. ATT-MATH-511"
                        className="flex-1 bg-white border border-gray-200 text-xs px-2 py-1 rounded outline-hidden uppercase font-mono font-bold"
                      />
                      <button
                        onClick={() => handleVerifyAttendanceCode(attendanceCode)}
                        disabled={verificationLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 rounded-md transition-all cursor-pointer shadow-3xs"
                      >
                        {verificationLoading ? "..." : "Verify"}
                      </button>
                    </div>
                  </div>

                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-2 text-[9px] text-gray-400 font-bold uppercase">or scan</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <button
                    onClick={async () => {
                      setScanningActive(true);
                      setScanStatus(null);
                      try {
                        const sRes = await fetch("/api/attendance/sessions");
                        const sData = await sRes.json();
                        const activeOne = sData.find((s: any) => s.active);
                        if (activeOne) {
                          setScannedSession(activeOne);
                        } else {
                          setScannedSession(null);
                        }
                      } catch(e) {}
                    }}
                    className="w-full py-1.5 bg-gray-950 text-white font-bold text-[10px] rounded hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                    Open Live Scan Lens
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-black px-2 py-1 rounded text-[9px] text-gray-400 font-mono">
                    <span className="text-emerald-400 animate-pulse">● LIVE SCAN EYE</span>
                    <button 
                      onClick={() => setScanningActive(false)} 
                      className="text-gray-300 hover:text-white font-semibold uppercase"
                    >
                      Close [x]
                    </button>
                  </div>

                  {/* Simulated Camera Viewfinder Frame */}
                  <div className="bg-gray-950 aspect-square rounded-lg border border-gray-800 relative overflow-hidden flex flex-col items-center justify-center text-center p-3">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500/80 animate-bounce shadow-[0_0_10px_#22c55e] z-10"></div>
                    
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>

                    {scannedSession ? (
                      <div className="text-white space-y-2 z-5">
                        <span className="text-[9px] font-bold text-green-400 bg-green-950/60 border border-green-500 px-2 py-0.5 rounded-full inline-block animate-pulse">
                          QR code detected!
                        </span>
                        <p className="text-[10.5px] font-bold leading-tight line-clamp-2 px-1 text-gray-200">
                          {scannedSession.sessionTitle}
                        </p>
                        <p className="text-[9px] text-gray-400 font-mono">Code: {scannedSession.code}</p>

                        <button
                          onClick={() => {
                            handleVerifyAttendanceCode(scannedSession.code);
                            setScanningActive(false);
                          }}
                          className="mt-2 text-[10px] font-bold bg-green-500 text-black px-3 py-1.5 rounded hover:bg-green-400 transition-all cursor-pointer w-full uppercase"
                        >
                          Mark Present ✓
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-400 space-y-2 z-5">
                        <Camera className="w-8 h-8 text-gray-600 mx-auto animate-pulse" />
                        <p className="text-[10px] leading-snug max-w-[130px] font-medium">Looking for active classroom QR keys...</p>
                        <button
                          onClick={async () => {
                            try {
                              const sRes = await fetch("/api/attendance/sessions");
                              const sData = await sRes.json();
                              const activeOne = sData.find((s: any) => s.active);
                              if (activeOne) {
                                setScannedSession(activeOne);
                              } else {
                                alert("No active class sessions found on the system. Produce one on the Instructor Portal first.");
                              }
                            } catch(e){}
                          }}
                          className="mt-1 text-[9px] font-bold text-blue-400 border border-blue-400/40 hover:bg-blue-400/10 px-2 py-1 rounded cursor-pointer"
                        >
                          Check active channels
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* History index */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex justify-between items-center text-[9px] uppercase font-bold text-gray-400">
                  <span>Check-In History</span>
                  <span className="font-mono">{attendanceLogs.length} records</span>
                </div>

                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {attendanceLogs.length === 0 ? (
                    <p className="text-[9px] text-gray-400 italic py-2 text-center bg-white rounded">No checks logged yet.</p>
                  ) : (
                    attendanceLogs.map((log) => (
                      <div key={log.id} className="p-1.5 border border-gray-100 bg-white rounded text-[10px] flex justify-between items-center">
                        <div className="truncate pr-1">
                          <span className="font-bold text-gray-700 block truncate leading-tight">{log.sessionTitle}</span>
                          <span className="text-[8px] text-gray-400 block truncate leading-tight">{log.courseTitle}</span>
                        </div>
                        <span className="shrink-0 text-[8px] text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-100 uppercase tracking-wider font-semibold font-sans">
                          Present ✓
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Core Study, Note pad, and Media Player Section */}
        <div className="lg:col-span-3 space-y-6 text-left">
          {activeCourse && activeEnrollment ? (
            <>
              {/* Media viewer and Micro-learning Progress panel */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="aspect-video bg-gray-950 flex flex-col justify-between p-4 relative text-white">
                  <div className="bg-black/60 px-3 py-1.5 rounded text-xs w-fit text-blue-300 font-mono font-bold uppercase tracking-wider">
                    🎥 Interactive Micro-Learning Player
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 text-center text-white/50 space-y-4">
                    <Play className="w-14 h-14 text-white hover:text-blue-500 hover:scale-115 cursor-pointer transition-all shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-white">Active Lesson ID: {activeLessonId}</p>
                      <p className="text-xs text-gray-400 mt-1">Full-resolution MP4 Streaming Media (Simulated Host)</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-black/60 p-3 rounded-lg text-xs">
                    <span className="text-gray-300 font-medium">Auto-Bookmarking triggers active</span>
                    <button 
                      onClick={handleCompleteCurrentLesson}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer transition-all"
                    >
                      ✓ Finalize Lesson Node
                    </button>
                  </div>
                </div>

                <div className="p-5 flex justify-between items-center gap-4 border-t border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base leading-snug">{activeCourse.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Author Academic: {activeCourse.instructorName}</p>
                  </div>
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-semibold shrink-0">
                    Syllabus Level: {activeCourse.difficulty}
                  </span>
                </div>
              </div>

              {/* PDF Certification & Sharing Pane - ONLY triggers if progress === 100% */}
              {activeEnrollment.progress === 100 && (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl space-y-4 shadow-2xs">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-emerald-900 font-bold text-base flex items-center gap-1.5">
                        <Award className="w-5.5 h-5.5 text-emerald-600" /> Dynamic Certification Achieved!
                      </h3>
                      <p className="text-xs text-emerald-700 mt-1">
                        Congratulations! You have obtained 100% completion in {activeCourse.title}. You are eligible for professional accreditation.
                      </p>
                    </div>
                    {/* Simulated Verification QR Code */}
                    <div className="bg-white p-1.5 border border-emerald-200 rounded shrink-0">
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center font-bold text-[8px] text-gray-400 text-center leading-tight">
                        [VERIFIED QR CODE]
                      </div>
                    </div>
                  </div>

                  {/* HTML Dynamic Template for Print Preview */}
                  <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-xs max-w-xl mx-auto text-center font-serif space-y-4">
                    <div className="border-4 border-double border-yellow-600 p-4 space-y-4">
                      <p className="text-xs tracking-widest text-yellow-800 uppercase font-sans font-bold">LMS Verified Certification</p>
                      <h4 className="text-xl text-gray-800 font-bold">Alex Mercer</h4>
                      <p className="text-[10.5px] italic text-gray-600">has successfully mastered all curriculum requirements, timed assessments, and code challenges for</p>
                      <h5 className="text-sm font-sans font-bold text-gray-900 mt-2">{activeCourse.title}</h5>
                      <div className="flex justify-between text-[9px] text-gray-500 font-sans border-t border-gray-100 pt-3">
                        <div>
                          <p className="font-semibold text-gray-700">QR: SECURE_7A39</p>
                          <p>MD5 Hash Verification</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">{activeCourse.instructorName}</p>
                          <p>Platform Faculty Sponsor</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-emerald-700 text-white rounded text-xs font-bold hover:bg-emerald-800 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Download Certified PDF
                    </button>
                  </div>
                </div>
              )}

              {/* AI Proctor Timed Exam Panel */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-red-500 animate-pulse" /> Timed Academy Examination & AI Proctoring Screen
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Secure browser lockdown simulation, continuous webcam monitoring, and automated validation.</p>
                  </div>
                  {!proctorExamActive && (
                    <button 
                      onClick={handleStartProctorExam}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Initiate Proctor Exam
                    </button>
                  )}
                </div>

                {proctorExamActive && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4 text-xs font-semibold">
                      <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg text-red-800">
                        <span>⏳ Time Remaining: {proctorTimer} seconds</span>
                        <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded">WEB LOCKDOWN MODEL ACTIVE</span>
                      </div>

                      {/* Mock Question Body */}
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-100">
                        <p className="text-gray-800">Question 1: What is the primary operational consequence of a replication lag inside cluster databases?</p>
                        <div className="space-y-2 font-medium">
                          <label className="flex items-center gap-2 bg-white p-2.5 rounded border border-gray-100 cursor-pointer hover:bg-gray-100/50">
                            <input 
                              type="radio" 
                              name="pq1" 
                              value="A" 
                              onChange={(e) => setProctorQuizAnswers({...proctorQuizAnswers, q1: e.target.value})}
                            />
                            <span>A) Absolute network socket timeout</span>
                          </label>
                          <label className="flex items-center gap-2 bg-white p-2.5 rounded border border-gray-100 cursor-pointer hover:bg-gray-100/50">
                            <input 
                              type="radio" 
                              name="pq1" 
                              value="B" 
                              onChange={(e) => setProctorQuizAnswers({...proctorQuizAnswers, q1: e.target.value})}
                            />
                            <span>B) Read-replicas may return stale or non-consistent data momentarily</span>
                          </label>
                          <label className="flex items-center gap-2 bg-white p-2.5 rounded border border-gray-100 cursor-pointer hover:bg-gray-100/50">
                            <input 
                              type="radio" 
                              name="pq1" 
                              value="C" 
                              onChange={(e) => setProctorQuizAnswers({...proctorQuizAnswers, q1: e.target.value})}
                            />
                            <span>C) Disk corruption across the horizontal storage nodes</span>
                          </label>
                        </div>
                      </div>

                      <button 
                        onClick={handleAutoSubmitProctor}
                        className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer transition-all text-xs"
                      >
                        Submit Final Examination
                      </button>
                    </div>

                    {/* Camera simulation panel */}
                    <div className="bg-gray-900 rounded-lg p-4 text-white flex flex-col justify-between h-fit space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Webcam Stream</span>
                          <span className={`inline-block h-2 w-2 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>

                        <div className="aspect-video bg-gray-950 border border-gray-800 rounded flex flex-col items-center justify-center relative overflow-hidden text-center text-xs text-gray-500">
                          {faceDetected ? (
                            <div className="text-green-400 font-semibold text-[10px] space-y-1">
                              <div>🟢 FACEME FRAME VERIFIED 98.4%</div>
                              <div className="text-[8px] text-gray-500">Continuous ID Matching</div>
                            </div>
                          ) : (
                            <div className="text-red-400 font-bold text-[10px] space-y-1 animate-pulse">
                              <span>⚠️ NO FACE DETECTED!</span>
                              <p className="text-[8px] text-gray-400">Avoid looking outside current workspace window.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-[9px] font-mono text-yellow-400 leading-tight space-y-1 border-t border-gray-800 pt-2 h-20 overflow-y-auto">
                        <p className="font-semibold text-gray-400 text-[10px] uppercase">Telemetry Proctor Logs:</p>
                        {cheatLogs.map((l, i) => <p key={i}>{l}</p>)}
                      </div>
                    </div>
                  </div>
                )}

                {proctorScore !== null && (
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 text-xs border border-gray-200">
                    <CheckSquare className="w-6 h-6 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">Exam submitted successfully.</p>
                      <p className="text-gray-500 mt-0.5">Automated Score Achieved: <span className="font-bold text-gray-900">{proctorScore}%</span>. Transcripts stored securely.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic AI Study Tutor & Dynamic AI Quiz panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* AI Tutor Chat */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" /> AI Classroom Study Tutor
                    </h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Gemini 3.5</span>
                  </div>

                  <div className="h-56 overflow-y-auto space-y-3 select-text pr-1.5 text-xs">
                    {aiHistory.map((item, idx) => (
                      <div key={idx} className={`p-3 rounded-lg text-left ${item.sender === "ai" ? "bg-blue-50/50 text-gray-700" : "bg-gray-100 text-gray-900 font-semibold"}`}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{item.sender === "ai" ? "AI Tutor" : "Alex Mercer"}</p>
                        <p className="leading-relaxed whitespace-pre-wrap">{item.text}</p>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="text-left text-gray-400 italic text-[11px] animate-pulse">
                        Thinking using Gemini AI model assets...
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleTriggerAiChat} className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask the AI Tutor e.g. What is Backpropagation?"
                      className="bg-gray-50 text-xs border border-gray-200 rounded p-2 flex-1 outline-hidden"
                      required
                    />
                    <button type="submit" className="bg-blue-600 font-bold text-xs text-white px-4 rounded cursor-pointer leading-7">Ask</button>
                  </form>
                </div>

                {/* AI Quiz Generator */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> Dynamic AI Flash-Quiz Generator
                    </h3>
                    <p className="text-[10px] text-gray-400 leading-tight">Generate custom micro-examinations dynamically tailored to your current active course topic utilizing verified Gemini API structured schemas.</p>
                  </div>

                  {!generatedQuiz ? (
                    <button 
                      onClick={handleGenerateAiQuiz}
                      disabled={quizLoading}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {quizLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Generate Chapter Flash Quiz"}
                    </button>
                  ) : (
                    <div className="space-y-3 text-xs overflow-y-auto max-h-56 text-left">
                      <div className="font-bold text-gray-800 border-b border-gray-100 pb-1.5">{generatedQuiz.quizTitle}</div>
                      
                      {generatedQuiz.questions.map((q, qIndex) => (
                        <div key={q.id || qIndex} className="space-y-1.5">
                          <p className="font-semibold text-gray-700">{qIndex + 1}. {q.question}</p>
                          <div className="grid grid-cols-1 gap-1">
                            {q.options.map((opt: string, optIdx: number) => (
                              <label key={optIdx} className="flex items-center gap-2 p-1.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-100 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={`req-gq-${q.id}`} 
                                  value={optIdx}
                                  checked={quizAnswers[q.id] === optIdx}
                                  onChange={() => setQuizAnswers({...quizAnswers, [q.id]: optIdx})}
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                          {quizScore !== null && q.explanation && (
                            <p className="text-[10.5px] text-emerald-700 italic leading-relaxed">💡 Explanation: {q.explanation}</p>
                          )}
                        </div>
                      ))}

                      {quizScore === null ? (
                        <button 
                          onClick={handleGradeGeneratedQuiz}
                          className="w-full py-1.5 bg-purple-600 text-white font-bold rounded text-xs"
                        >
                          Submit For Grading
                        </button>
                      ) : (
                        <button 
                          onClick={() => setGeneratedQuiz(null)}
                          className="w-full py-1.5 bg-gray-300 text-gray-700 font-bold rounded text-xs"
                        >
                          Try Another Topic
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Dynamic Note pads & Submissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Note Pad */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
                  <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-gray-600" /> Active Lecture Notes Notepad
                  </h3>
                  
                  <form onSubmit={handleAddCourseNote} className="space-y-2">
                    <textarea 
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Jot down active key formulas or reference definitions for your study guide..."
                      rows={3}
                      className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-xs font-serif leading-relaxed"
                      required
                    />
                    <button type="submit" className="bg-gray-800 text-white font-semibold text-xs py-1.5 px-4 rounded hover:bg-black cursor-pointer">Post Bookmark</button>
                  </form>

                  {/* Notes review */}
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {activeEnrollment.notes && activeEnrollment.notes.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">No notes created yet for this course.</p>
                    ) : (
                      activeEnrollment.notes?.map((n) => (
                        <div key={n.id} className="p-2.5 bg-gray-50 rounded border border-gray-100 text-xs">
                          <p className="font-serif text-gray-700 italic">"{n.content}"</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">Saved on: {n.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Course Discussions Forum inside Courses */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
                  <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-500" /> Classroom Discussions Board
                  </h3>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
                    {discussions.filter(d => d.courseId === activeCourse.id).map((m) => (
                      <div key={m.id} className="p-2 bg-gray-50 rounded text-left">
                        <div className="flex justify-between items-center text-[10px] mb-0.5">
                          <span className={`font-semibold ${m.senderRole === 'Instructor' ? 'text-emerald-700' : 'text-gray-700'}`}>
                            {m.senderName} ({m.senderRole})
                          </span>
                          <span className="text-gray-400">{m.timestamp.slice(11, 16)} gmt</span>
                        </div>
                        <p className="text-[11px] text-gray-600">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleTriggerForumMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={forumText}
                      onChange={(e) => setForumText(e.target.value)}
                      placeholder="Comment or ask a course question..."
                      className="bg-gray-50 text-xs border border-gray-200 rounded p-1.5 flex-1 outline-hidden"
                      required
                    />
                    <button type="submit" className="bg-blue-600 font-bold text-xs text-white px-3.5 rounded cursor-pointer">Post</button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl text-center border text-gray-400 text-xs shadow-xs">
              No active course enrollment selected. Navigate to the marketplace portal to secure enrollments.
            </div>
          )}
        </div>
      </div>

      {/* AI-Powered Course Recommendation Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6" id="ai-recs-panel">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-150 pb-4">
          <div>
            <h2 className="text-base font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> AI Course Recommendation Engine
            </h2>
            <p className="text-xs text-gray-500 mt-1">Get custom-tailored course offerings and synthesized learning tracks based on interests, completed modules, and active progress.</p>
          </div>
          <button 
            onClick={fetchAiRecommendations}
            disabled={recsLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            {recsLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="w-3.5 h-3.5" />
            )}
            Refresh Telemetry
          </button>
        </div>

        {/* Interests Config */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <div className="text-xs font-bold text-gray-600 select-none">Select or custom-tailor your interest matrices:</div>
          <div className="flex flex-wrap gap-1.5">
            {defaultInterestTags.map(tag => {
              const active = selectedInterests.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleToggleInterest(tag)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border cursor-pointer ${
                    active 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold" 
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-150"
                  }`}
                >
                  {tag} {active && "✓"}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddCustomInterest} className="flex gap-2 max-w-md pt-1.5">
            <input 
              type="text" 
              value={customInterestInput}
              onChange={(e) => setCustomInterestInput(e.target.value)}
              placeholder="Type custom specialization topic (e.g. Postgres, NextJS)..."
              className="bg-white text-xs border border-gray-200 rounded-lg p-2 flex-1 outline-hidden"
            />
            <button 
              type="submit" 
              className="bg-gray-800 hover:bg-black text-white px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Interest
            </button>
          </form>
        </div>

        {recsLoading ? (
          <div className="py-12 text-center text-gray-400 italic text-xs animate-pulse flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <span>Consulting academy counselor and indexing available syllabuses using Gemini...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Catalog Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Catalog Matches
              </h3>

              {recommendations.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 text-gray-400 text-xs text-center p-8 rounded-xl leading-relaxed">
                  No matches remaining inside catalog. You are already enrolled in all tailored specializations! Update interests to explore more niches.
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => {
                    // Decide badge color based on matchScore
                    let scoreBg = "bg-rose-50 text-rose-700 border-rose-250";
                    if (rec.matchScore >= 90) {
                      scoreBg = "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
                    } else if (rec.matchScore >= 75) {
                      scoreBg = "bg-blue-50 text-blue-700 border-blue-200 font-bold";
                    } else if (rec.matchScore >= 60) {
                      scoreBg = "bg-indigo-50 text-indigo-700 border-indigo-200";
                    }

                    return (
                      <div key={rec.courseId} className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs hover:border-indigo-200 transition-all text-xs text-left flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm leading-tight">{rec.title}</h4>
                              <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                                {rec.category} • Level: {rec.difficulty}
                              </p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] border shrink-0 uppercase tracking-wider ${scoreBg}`}>
                              🎯 {rec.matchScore}% Match
                            </span>
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed bg-indigo-50/20 p-3 rounded-lg text-[11px] italic">
                            " {rec.reason} "
                          </p>

                          {rec.suggestedNextSteps && rec.suggestedNextSteps.length > 0 && (
                            <div className="space-y-1 pt-1.5">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Next study recommendation milestones:</p>
                              <ul className="list-disc list-inside space-y-1 pr-1 pl-1 text-[11px] text-gray-600 font-medium">
                                {rec.suggestedNextSteps.map((step: string, sIdx: number) => (
                                  <li key={sIdx}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center gap-4">
                          <span className="text-[10.5px] text-gray-400 font-medium font-mono">ID: {rec.courseId}</span>
                          <button
                            onClick={() => {
                              onEnrollCourse(rec.courseId);
                              alert(`Enrolled inside course: ${rec.title}. Resume from learning switcher!`);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer text-[11px] flex items-center gap-1 transition-all"
                          >
                            Enroll & Study Now <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Personalized Path output */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-500" /> Synthesized Pathway
              </h3>

              {personalizedPath ? (
                <div className="bg-linear-to-br from-indigo-50/40 to-purple-50/30 p-6 rounded-xl border border-indigo-100 shadow-2xs text-left text-xs space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase font-mono">Specialized Goal</span>
                      <span className="text-[8.5px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded uppercase font-mono">100% Custom</span>
                    </div>
                    <h4 className="font-sans font-bold text-gray-900 text-sm md:text-base tracking-tight leading-snug">{personalizedPath.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{personalizedPath.description}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dynamic Syllabus Architecture:</p>
                    <div className="relative border-l border-indigo-200 ml-2.5 pl-4.5 space-y-4">
                      {personalizedPath.modules?.map((m: any, mIdx: number) => (
                        <div key={mIdx} className="relative">
                          <span className="absolute -left-7 top-0.5 bg-indigo-600 text-white text-[9px] font-mono h-4 w-4 rounded-full flex items-center justify-center font-bold font-sans">
                            {mIdx + 1}
                          </span>
                          <h5 className="font-bold text-gray-800 text-[11px] md:text-xs leading-none">{m.title}</h5>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {m.topics?.map((topic: string, tIdx: number) => (
                              <span key={tIdx} className="text-[10px] bg-white text-gray-650 border border-gray-150 px-2 py-0.5 rounded-md font-medium">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-lg text-emerald-800 leading-relaxed text-[10.5px]">
                    <span className="font-semibold block mb-0.5 text-emerald-900 flex items-center gap-1">
                      💡 Advisor Commentary:
                    </span>
                    This track is auto-calibrated to synergize with your {recsTopic ? recsTopic : 'active study blocks'}. Try asking the AI Study Tutor for specific homework reviews!
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 text-gray-400 text-xs text-center p-8 rounded-xl leading-relaxed">
                  Select interests to dynamically build a personalized academic pathway document.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
