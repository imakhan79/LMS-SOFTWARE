import React, { useState } from "react";
import { 
  Users, BookOpen, DollarSign, Award, Plus, Trash, Globe, 
  Video, Calendar, Mail, FileUp, MessageSquare, ChevronRight, Play, CheckCircle
} from "lucide-react";
import { Course, DiscussionMessage } from "../types";

interface Props {
  courses: Course[];
  discussions: DiscussionMessage[];
  onAddDiscussion: (msg: Partial<DiscussionMessage>) => void;
  onModifyCourseSyllabus: (courseId: string, updatedModules: any[]) => void;
}

export default function InstructorDashboard({
  courses, discussions, onAddDiscussion, onModifyCourseSyllabus
}: Props) {
  const [activeSubTab, setActiveSubTab] = useState<"builder" | "zoom" | "discussions" | "content">("builder");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [newModuleName, setNewModuleName] = useState("");
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonType, setNewLessonType] = useState<"video" | "doc" | "quiz">("video");
  const [newLessonDuration, setNewLessonDuration] = useState("15 mins");

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
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "builder" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Interactive Course Builder
        </button>
        <button 
          onClick={() => setActiveSubTab("zoom")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "zoom" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <Video className="w-3.5 h-3.5" /> Zoom & Lectures Scheduler
        </button>
        <button 
          onClick={() => setActiveSubTab("discussions")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "discussions" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Forum Discussions
        </button>
        <button 
          onClick={() => setActiveSubTab("content")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeSubTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <FileUp className="w-3.5 h-3.5" /> SCORM & Assets Delivery
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
    </div>
  );
}
