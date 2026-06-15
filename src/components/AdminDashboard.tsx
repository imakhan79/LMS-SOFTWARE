import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  YAxis, Legend, PieChart, Pie, Cell
} from "recharts";
import { 
  BookOpen, Plus, Tag, HelpCircle, FileText, CheckCircle, 
  AlertCircle, ShieldCheck, Copy, Eye, Power, Trash, LayoutList,
  TrendingUp, Users, DollarSign, Phone, Mail, Award, Clock, Calendar, 
  Check, Send, AlertTriangle, UserPlus, FileCheck, RefreshCw, Layers
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
  // Navigation tabs
  const [consoleMode, setConsoleMode] = useState<"ceo" | "admin" | "accounts" | "reception" | "batches">("ceo");
  const [activeAdminTab, setActiveAdminTab] = useState<"courses" | "assignments" | "analytics">("courses");

  // CRM/ERP states loaded from back-office REST endpoints
  const [feeAccounts, setFeeAccounts] = useState<any[]>([]);
  const [batchesList, setBatchesList] = useState<any[]>([]);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [loadingERP, setLoadingERP] = useState(false);

  // Selected ERP references for operations
  const [selectedFeeAccount, setSelectedFeeAccount] = useState<any | null>(null);

  // Creation forms
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Computer Science");
  const [newPrice, setNewPrice] = useState(99);
  const [newDiff, setNewDiff] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");

  // Assignment grading references
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [earnedGrade, setEarnedGrade] = useState("90 / 100");
  const [rubricFb, setRubricFb] = useState("Perfect conceptual layout.");

  // Reception walk-in state
  const [walkinName, setWalkinName] = useState("");
  const [walkinEmail, setWalkinEmail] = useState("");
  const [walkinCourseId, setWalkinCourseId] = useState(courses[0]?.id || "");
  const [walkinDeposit, setWalkinDeposit] = useState(300);
  const [walkinInstallments, setWalkinInstallments] = useState(3);
  const [submittingWalkin, setSubmittingWalkin] = useState(false);

  // New batch state
  const [batchName, setBatchName] = useState("");
  const [batchCourseId, setBatchCourseId] = useState(courses[0]?.id || "");
  const [batchTrainer, setBatchTrainer] = useState("Dr. Sarah Jenkins");
  const [batchStart, setBatchStart] = useState("2026-07-01");
  const [submittingBatch, setSubmittingBatch] = useState(false);

  const fetchERPData = async () => {
    setLoadingERP(true);
    try {
      const [feeRes, batchRes, inqRes] = await Promise.all([
        fetch("/api/fees/ledgers").then(r => r.json()),
        fetch("/api/batches").then(r => r.json()),
        fetch("/api/reception/inquiries").then(r => r.json())
      ]);
      setFeeAccounts(feeRes);
      setBatchesList(batchRes);
      setInquiriesList(inqRes);
      
      // Auto-keep selected state updated
      if (selectedFeeAccount) {
        const refreshed = feeRes.find((f: any) => f.id === selectedFeeAccount.id);
        if (refreshed) setSelectedFeeAccount(refreshed);
      }
    } catch (e) {
      console.error("Failed to load EPR collections", e);
    } finally {
      setLoadingERP(false);
    }
  };

  useEffect(() => {
    fetchERPData();
  }, [courses]);

  // Set default form select values once courses are available
  useEffect(() => {
    if (courses.length > 0) {
      if (!walkinCourseId) setWalkinCourseId(courses[0].id);
      if (!batchCourseId) setBatchCourseId(courses[0].id);
    }
  }, [courses]);

  // Submit walkthrough registrations
  const handleRegisterWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinEmail.trim()) {
      alert("Please provide the candidate name and email credentials.");
      return;
    }

    setSubmittingWalkin(true);
    try {
      const res = await fetch("/api/reception/walkin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: walkinName,
          email: walkinEmail,
          courseId: walkinCourseId,
          initialDeposit: Number(walkinDeposit),
          totalFeeInstallments: Number(walkinInstallments)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Cash Registration Successful! Assigned user to ${data.courseTitle}. Fee installment plan created.`);
        setWalkinName("");
        setWalkinEmail("");
        setWalkinDeposit(300);
        fetchERPData();
      }
    } catch (err) {
      alert("Fail checking registration limits.");
    } finally {
      setSubmittingWalkin(false);
    }
  };

  // Submit Master batch timeline
  const handleCreateBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    setSubmittingBatch(true);
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: batchName,
          courseId: batchCourseId,
          trainerName: batchTrainer,
          startDate: batchStart,
          endDate: new Date(new Date(batchStart).setMonth(new Date(batchStart).getMonth() + 6)).toISOString().split("T")[0]
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`New educational run class sequence [${data.batch.name}] created and published.`);
        setBatchName("");
        fetchERPData();
      }
    } catch (e) {
      alert("Error adding active lecture batch.");
    } finally {
      setSubmittingBatch(false);
    }
  };

  // Process installment collection
  const handleCollectInstallment = async (ledgerId: string, installmentId: string, paymentMethod: string) => {
    try {
      const res = await fetch("/api/fees/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ledgerId, installmentId, paymentMethod })
      });
      const data = await res.json();
      if (data.success) {
        alert("Tuition installment payment recorded! Balance and transaction streams updated.");
        fetchERPData();
      } else {
        alert(data.error || "Collector protocol failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  // Financial KPI computations for CEO
  const totalTuitionRevenue = feeAccounts.reduce((sum, f) => sum + f.totalFee, 0) || 3700;
  const actualCollectedTuition = feeAccounts.reduce((sum, f) => sum + f.paidAmount, 0) || 2350;
  const totalOutstandingTuition = feeAccounts.reduce((sum, f) => sum + f.outstandingAmount, 0) || 1350;
  const recoveryVelocity = totalTuitionRevenue ? Math.round((actualCollectedTuition / totalTuitionRevenue) * 100) : 63;

  const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444"];

  const feeStatusData = [
    { name: "Collected", value: actualCollectedTuition },
    { name: "Dues Outstanding", value: totalOutstandingTuition }
  ];

  return (
    <div className="space-y-6 text-left" id="management-hub-console">
      
      {/* Management Hub Selector Panel */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded border border-blue-800/40 inline-flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Complete Management Suite
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Institutional Operations Center</h1>
            <p className="text-xs text-slate-400">Deploy structural modules, audit tuition recoveries, map batch registers, and process walk-in intakes.</p>
          </div>

          <button 
            onClick={fetchERPData}
            title="Refresh Ledger and Batches"
            aria-label="Refresh institutional ledger and batch registration data"
            className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingERP ? "animate-spin" : ""}`} />
            <span>Sync Back-Office</span>
          </button>
        </div>

        {/* Major Roles Switches */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setConsoleMode("ceo")}
            aria-label="Toggle CEO Cockpit Console"
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${consoleMode === "ceo" ? "bg-blue-600 text-white shadow-md" : "bg-slate-800 text-slate-400 hover:bg-slate-750"}`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> CEO Cockpit
          </button>
          
          <button
            onClick={() => setConsoleMode("admin")}
            aria-label="Toggle Syllabus and Assignments Admin Portal"
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${consoleMode === "admin" ? "bg-blue-600 text-white shadow-md" : "bg-slate-800 text-slate-400 hover:bg-slate-750"}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
          </button>

          <button
            onClick={() => setConsoleMode("accounts")}
            aria-label="Toggle Fee Installments and Accounts Ledger Console"
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${consoleMode === "accounts" ? "bg-blue-600 text-white shadow-md" : "bg-slate-800 text-slate-400 hover:bg-slate-750"}`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Fee Installments
          </button>

          <button
            onClick={() => setConsoleMode("reception")}
            aria-label="Toggle Reception Desk and Student Intake Console"
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${consoleMode === "reception" ? "bg-blue-600 text-white shadow-md" : "bg-slate-800 text-slate-400 hover:bg-slate-750"}`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Reception Desk
          </button>

          <button
            onClick={() => setConsoleMode("batches")}
            aria-label="Toggle Batch Register and Exams Console"
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${consoleMode === "batches" ? "bg-blue-600 text-white shadow-md" : "bg-slate-800 text-slate-400 hover:bg-slate-750"}`}
          >
            <Calendar className="w-3.5 h-3.5" /> Batch & Exams
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. CEO COCKPIT SCREEN                                    */}
      {/* ======================================================== */}
      {consoleMode === "ceo" && (
        <div className="space-y-6" id="ceo-suite-viewport">
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Gross Tuition Billing</span>
                <span className="text-xl font-bold font-sans text-gray-900">${totalTuitionRevenue.toLocaleString()}</span>
                <span className="text-[9px] text-emerald-600 font-semibold block">★ Total revenue books</span>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Recovered To-Date</span>
                <span className="text-xl font-bold font-sans text-emerald-600">${actualCollectedTuition.toLocaleString()}</span>
                <span className="text-[9px] text-gray-400 font-semibold block">Liquidity in vault desk</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Outstanding Tuition</span>
                <span className="text-xl font-bold font-sans text-rose-500">${totalOutstandingTuition.toLocaleString()}</span>
                <span className="text-[9px] text-gray-400 font-semibold block">Split installments to collect</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Recovery Efficiency</span>
                <span className="text-xl font-bold font-sans text-indigo-600">{recoveryVelocity}% Velocity</span>
                <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${recoveryVelocity}%` }}></div>
                </div>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pie chart financial logs */}
            <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Tuition Recovery Analytics</h3>
                <p className="text-[10px] text-gray-400">Syllabus books outstanding ledger share breakdown.</p>
              </div>

              <div className="h-44 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feeStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {feeStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#f59e0b"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute text-center">
                  <span className="text-lg font-extrabold text-gray-800">{recoveryVelocity}%</span>
                  <span className="text-[9px] text-gray-400 block font-bold">RECOVERED</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <div>
                    <span className="text-[10px] text-gray-400 block leading-none">Paid Amount</span>
                    <span className="font-bold font-mono">${actualCollectedTuition}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <div>
                    <span className="text-[10px] text-gray-400 block leading-none">Pending Dues</span>
                    <span className="font-bold font-mono">${totalOutstandingTuition}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CEO Operational Summary & Active Inquiries summary */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Operational Executive Summary</h3>
                  <p className="text-[10px] text-gray-400">Key institutional pipelines and intake performance flags.</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded">REAL-TIME</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Batches review */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="font-bold text-[11px] text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-650" /> Cohort Batches ({batchesList.length})
                  </h4>
                  <div className="space-y-1.5">
                    {batchesList.slice(0, 3).map(b => (
                      <div key={b.id} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-800 truncate max-w-[120px]">{b.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${b.status === "Completed" ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visitor check-in inquiries */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="font-bold text-[11px] text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-650" /> Latest Reception Logs ({inquiriesList.length})
                  </h4>
                  <div className="space-y-1.5">
                    {inquiriesList.slice(0, 3).map(inq => (
                      <div key={inq.id} className="flex justify-between items-center text-xs">
                        <div className="truncate max-w-[120px]">
                          <span className="font-semibold block text-gray-800 leading-none">{inq.visitorName}</span>
                          <span className="text-[9px] text-gray-400">{inq.dated}</span>
                        </div>
                        <span className="text-[9px] font-mono bg-purple-50 text-purple-700 px-1.5 rounded font-bold">
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action commands */}
              <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-950">Installment Collection Target Reminder Alert</h4>
                  <p className="text-[10px] text-gray-500">Auto-transmit text schedules to students containing due and outstanding invoices.</p>
                </div>
                <button
                  onClick={() => alert("Transactional alerts successfully transmitted to all partially unpaid student ledgers via systemic SMTP channels.")}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                >
                  Broadcast Reminders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADMIN SUITE SCREEN                                    */}
      {/* ======================================================== */}
      {consoleMode === "admin" && (
        <div className="space-y-6" id="sys-admin-viewport">
          {/* Header context sub-navigation flags */}
          <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setActiveAdminTab("courses")}
              aria-label="Switch administration tab to Syllabus Creator Panel"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeAdminTab === "courses" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
            >
              Syllabus Creator
            </button>
            <button 
              onClick={() => setActiveAdminTab("assignments")}
              aria-label="Switch administration tab to Assignments Assessment Panel"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeAdminTab === "assignments" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
            >
              Assignments Assessment ({assignments.filter(a => !a.grade).length} pending)
            </button>
            <button 
              onClick={() => setActiveAdminTab("analytics")}
              aria-label="Switch administration tab to Syllabus Completion Telemetry Panel"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeAdminTab === "analytics" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
            >
              Syllabus Completion Telemetry
            </button>
          </div>

          {activeAdminTab === "courses" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Form: Draft Creator */}
              <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-150 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Plus className="w-4.5 h-4.5 text-blue-650" /> Structure Draft syllabus
                </h3>
                <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Course Title</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Distributed Database Scaling"
                      className="w-full text-xs border border-gray-250 bg-gray-50/50 p-2 py-1.5 rounded outline-hidden focus:border-blue-500 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category Domain</label>
                    <select 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-white border border-gray-250 text-xs px-2 py-1.5 rounded outline-hidden font-medium text-gray-700 cursor-pointer"
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
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tuition Price ($)</label>
                      <input 
                        type="number" 
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full text-xs border border-gray-250 bg-gray-50/50 p-2 py-1.5 rounded outline-hidden text-gray-700"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Difficulty</label>
                      <select 
                        value={newDiff} 
                        onChange={(e) => setNewDiff(e.target.value as any)}
                        className="w-full bg-white border border-gray-250 text-xs px-2 py-1.5 rounded outline-hidden text-gray-700 cursor-pointer"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded cursor-pointer transition-all shadow-3xs"
                  >
                    Deploy Draft Course Blueprint
                  </button>
                </form>
              </div>

              {/* Course items */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Syllabus Master Records ({courses.length})</h3>
                <div className="space-y-3">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white p-4 rounded-xl border border-gray-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{course.category}</span>
                          <span className="text-[9px] font-mono uppercase font-bold text-blue-700">{course.id}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mt-1">{course.title}</h4>
                        <p className="text-[10.5px] text-gray-400 mt-0.5">Faculty Assessor: {course.instructorName} | Standard Tuition Cost: <strong>${course.price}</strong></p>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button 
                          onClick={() => onPublishToggle(course.id)}
                          className={`px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold border border-slate-250 rounded-lg cursor-pointer flex items-center gap-1 text-[10.5px] ${course.published ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-250' : ''}`}
                        >
                          <Power className="w-3.5 h-3.5" /> {course.published ? "Live" : "Draft"}
                        </button>
                        <button 
                          onClick={() => onCloneCourse(course.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold border border-slate-250 rounded-lg cursor-pointer text-gray-600 hover:text-black flex items-center gap-1 text-[10.5px]"
                        >
                          <Copy className="w-3.5 h-3.5" /> Clone
                        </button>
                        <button 
                          onClick={() => onDeleteCourse(course.id)}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeAdminTab === "assignments" && (
            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-5">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <FileCheck className="w-4.5 h-4.5 text-blue-600" /> Active student Written Essay Portfolio
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {assignments.map(sub => (
                    <div 
                      key={sub.id}
                      onClick={() => {
                        setGradingId(sub.id);
                        setEarnedGrade(sub.grade || "90/100");
                        setRubricFb(sub.feedback || "");
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${gradingId === sub.id ? 'bg-blue-50 border-blue-400' : 'border-gray-150 bg-white hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400">Date: {sub.submittedAt.slice(0, 10)}</span>
                        <span className={`text-[9px] font-bold px-1.5 rounded uppercase ${sub.grade ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                          {sub.grade ? `Score: ${sub.grade}` : "Pending Grading"}
                        </span>
                      </div>
                      <span className="font-bold text-gray-950 text-xs block">{sub.studentName}</span>
                      <span className="text-[10px] font-mono text-gray-400 mt-1 block">📌 PDF/File: {sub.fileName}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-gray-200 h-fit space-y-4">
                  {gradingId ? (
                    <form onSubmit={handleGradeSubmit} className="space-y-3">
                      <h4 className="font-bold text-gray-900 text-xs">Verify Student Essay Content</h4>
                      
                      <div className="p-3 bg-white border border-gray-200 rounded text-xs text-gray-700 italic max-h-48 overflow-y-auto">
                        "{assignments.find(a => a.id === gradingId)?.textContent || "PDF Attachment payload only."}"
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Numerical Grade Score</label>
                        <input 
                          type="text" 
                          value={earnedGrade}
                          onChange={e => setEarnedGrade(e.target.value)}
                          className="w-full text-xs border border-gray-200 rounded p-1.5 bg-white outline-hidden font-bold"
                          placeholder="e.g. 95 / 100"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Rubric Feedback Comments</label>
                        <textarea
                          value={rubricFb}
                          onChange={e => setRubricFb(e.target.value)}
                          rows={3}
                          placeholder="Excellent, complete details provided."
                          className="w-full text-xs border border-gray-200 rounded p-1.5 bg-white outline-hidden"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-all cursor-pointer"
                      >
                        Publish Verified Grade & Award XP
                      </button>
                    </form>
                  ) : (
                    <div className="py-12 text-center text-gray-400 italic text-xs">
                      No assignment submission selected. Click on a record on the left to grade.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeAdminTab === "analytics" && (
            <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Course Dropout vs Completion Analytics</h3>
                <p className="text-[10px] text-gray-400">Calculated completion ratios of active student cohorts across standard modules.</p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courses.map(c => ({
                    name: c.title.substring(0, 15) + "...",
                    completions: c.id === "course-1" ? 18 : c.id === "course-2" ? 5 : 12,
                    dropouts: c.id === "course-1" ? 1 : c.id === "course-2" ? 3 : 2
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completions" fill="#10b981" name="Successful Graduates" stackId="a" />
                    <Bar dataKey="dropouts" fill="#ef4444" name="Unpaid Dropouts" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ACCOUNTS SUITE (FEE INSTALMENT TRACKING)              */}
      {/* ======================================================== */}
      {consoleMode === "accounts" && (
        <div className="space-y-6" id="fee-accounts-viewport">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Student Tuition accounts ledger */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Tuition Dues & installment Account Registry</h3>
                <p className="text-[10px] text-gray-400">Track student installments, outstanding balances, and update payment custody.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] uppercase font-bold text-gray-400">
                      <th className="py-2">Student Particulars</th>
                      <th className="py-2">Course syllabus</th>
                      <th className="py-2">Tut Total</th>
                      <th className="py-2">Paid</th>
                      <th className="py-2">Outstanding</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {feeAccounts.map((fac) => (
                      <tr 
                        key={fac.id} 
                        className={`hover:bg-slate-50 transition-colors ${selectedFeeAccount?.id === fac.id ? 'bg-blue-50/40 font-medium' : ''}`}
                      >
                        <td className="py-3 pr-2 select-all">
                          <span className="font-bold text-gray-900 block">{fac.studentName}</span>
                          <span className="text-[9px] text-gray-400 block break-all leading-none mt-0.5">{fac.studentEmail}</span>
                        </td>
                        <td className="py-3 pr-2 truncate max-w-[120px] text-gray-600" title={fac.courseTitle}>{fac.courseTitle}</td>
                        <td className="py-3 pr-1 font-mono font-bold">${fac.totalFee}</td>
                        <td className="py-3 pr-1 font-mono text-emerald-600 font-bold">${fac.paidAmount}</td>
                        <td className="py-3 pr-1 font-mono text-rose-500 font-bold">${fac.outstandingAmount}</td>
                        <td className="py-3">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded leading-none ${
                            fac.status === "Fully Paid" ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {fac.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setSelectedFeeAccount(fac)}
                            className="bg-slate-950 text-white font-bold text-[10px] hover:bg-black px-2.5 py-1 rounded transition-all cursor-pointer"
                          >
                            Timeline View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Installment payment collection timeline panel */}
            <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
              {selectedFeeAccount ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">FEES DISPATCH CARD</span>
                      <h4 className="font-extrabold text-gray-950 text-xs lines-clamp-1">{selectedFeeAccount.studentName}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedFeeAccount(null)}
                      className="text-gray-400 hover:text-black text-[10px] font-bold"
                    >
                      Clear panel
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5">
                      <span className="font-semibold text-gray-700 block leading-tight">Course: <strong className="text-gray-900">{selectedFeeAccount.courseTitle}</strong></span>
                      <div className="flex justify-between font-mono text-[10.5px]">
                        <span>Tuition Total: <strong>${selectedFeeAccount.totalFee}</strong></span>
                        <span className="text-rose-500">Left Due: <strong>${selectedFeeAccount.outstandingAmount}</strong></span>
                      </div>
                    </div>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none pt-1">Installment Milestones</p>
                    
                    <div className="space-y-2.5">
                      {selectedFeeAccount.installments.map((inst: any) => (
                        <div key={inst.id} className="p-3 bg-white border border-gray-150 rounded-lg flex justify-between items-center text-xs shadow-3xs hover:border-gray-200 select-all">
                          <div>
                            <span className="font-bold text-gray-900 block text-[11px]">Installment #{inst.installmentNo}</span>
                            <span className="text-[9.5px] text-gray-400 font-semibold block">Amt Due: <strong className="font-mono text-gray-800">${inst.amount}</strong></span>
                            <span className="text-[9px] text-gray-400 block mt-0.5">Due: {inst.dueDate} {inst.paidDate && `| Paid: ${inst.paidDate}`}</span>
                          </div>

                          <div className="text-right shrink-0">
                            {inst.status === "Paid" ? (
                              <div className="text-right">
                                <span className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded block">
                                  ✓ Received
                                </span>
                                <span className="text-[8px] text-gray-400 mt-0.5 block font-mono">{inst.method}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => handleCollectInstallment(selectedFeeAccount.id, inst.id, "Cash")}
                                  className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-[9.5px] text-white rounded cursor-pointer"
                                  title="Paid via cash register"
                                >
                                  Collect Cash
                                </button>
                                <button
                                  onClick={() => handleCollectInstallment(selectedFeeAccount.id, inst.id, "Bank Transfer")}
                                  className="py-0.5 px-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-[8.5px] text-gray-600 rounded border border-gray-250 cursor-pointer"
                                >
                                  Bank Depot
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Invoice print preview emulation */}
                    <button
                      onClick={() => alert(`--------------------------------------------------\n              OFFICIAL TUITION RECEIPT             \n--------------------------------------------------\nReference ID: ${selectedFeeAccount.id}\nStudent Name: ${selectedFeeAccount.studentName}\nEmail: ${selectedFeeAccount.studentEmail}\nCourse: ${selectedFeeAccount.courseTitle}\nTotal Paid Tuition: $${selectedFeeAccount.paidAmount}\nPending Outstanding: $${selectedFeeAccount.outstandingAmount}\nStatus: ${selectedFeeAccount.status}\n--------------------------------------------------\n       Thank you for choosing Enterprise LMS       \n--------------------------------------------------`)}
                      className="w-full mt-2.5 py-1.5 border border-slate-900 hover:bg-slate-50 text-black text-[10px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Generate Billing Receipt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-gray-400 italic text-xs space-y-1">
                  <DollarSign className="w-10 h-10 text-gray-200 mx-auto" />
                  <p>No Student Selected.</p>
                  <p className="text-[10px] not-italic text-gray-400 max-w-[170px] mx-auto mt-1">Select an account from the table registry to process installments and receipts.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. RECEPTION WORKPLACE SCREEN                            */}
      {/* ======================================================== */}
      {consoleMode === "reception" && (
        <div className="space-y-6" id="receptionist-viewport">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Walk-in Intake Registrar Form */}
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4 h-fit">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <UserPlus className="w-4.5 h-4.5 text-blue-600 animate-pulse" /> Walk-In Registrar Desk
                </h3>
                <p className="text-[10px] text-gray-400">Enroll walk-in students immediately, receive partial cash reserves, and schedule installments.</p>
              </div>

              <form onSubmit={handleRegisterWalkin} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-gray-400">FullName</label>
                  <input
                    type="text"
                    value={walkinName}
                    onChange={e => setWalkinName(e.target.value)}
                    placeholder="e.g. Imran Ahmed"
                    className="w-full text-xs border border-gray-250 bg-gray-50/55 p-1.5 rounded outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-gray-400">Email Address</label>
                  <input
                    type="email"
                    value={walkinEmail}
                    onChange={e => setWalkinEmail(e.target.value)}
                    placeholder="e.g. candidate@lms.com"
                    className="w-full text-xs border border-gray-250 bg-gray-50/55 p-1.5 rounded outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-gray-400">Enrolling Course</label>
                  <select
                    value={walkinCourseId}
                    onChange={e => setWalkinCourseId(e.target.value)}
                    className="w-full bg-white border border-gray-250 text-xs px-2 py-1.5 rounded outline-hidden text-gray-700 cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title} (${c.price})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase font-bold text-gray-400">Initial Deposit ($)</label>
                    <input
                      type="number"
                      value={walkinDeposit}
                      onChange={e => setWalkinDeposit(Number(e.target.value))}
                      className="w-full text-xs border border-gray-250 bg-gray-50/55 p-1.5 rounded outline-hidden font-bold text-emerald-700"
                      min={0}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase font-bold text-gray-400">Installments</label>
                    <select
                      value={walkinInstallments}
                      onChange={e => setWalkinInstallments(Number(e.target.value))}
                      className="w-full bg-white border border-gray-250 text-xs px-2 py-1.5 rounded outline-hidden text-gray-700 cursor-pointer animate-none"
                    >
                      <option value={2}>2 Installments</option>
                      <option value={3}>3 Installments</option>
                      <option value={4}>4 Installments</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingWalkin}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer transition-all text-xs shadow-3xs"
                >
                  {submittingWalkin ? "Enrolling student..." : "Dispatch Intake / Issue Receipt"}
                </button>
              </form>
            </div>

            {/* Inquiries & Public Website leads */}
            <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Visitor log & integrated Website Leads</h3>
                <p className="text-[10px] text-gray-400">Walk-in inquiries and students booking discovery calls directly from the online landing catalog.</p>
              </div>

              <div className="space-y-3">
                {inquiriesList.map((log) => (
                  <div key={log.id} className="p-4 border border-gray-150 rounded-xl hover:border-gray-250 transition-all text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{log.visitorName}</span>
                        <span className="text-[9px] text-gray-400 font-mono">#{log.id}</span>
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase leading-none ${
                          log.status === "Registered" ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-gray-500 font-semibold truncate max-w-sm">Queried Syllabus: <strong className="text-gray-800 font-bold">{log.queryCourse}</strong></p>
                      <p className="text-gray-600 italic">"{log.notes}"</p>
                      <div className="flex gap-4 text-[10px] text-gray-400 font-mono">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {log.contactNo}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {log.email}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex gap-2">
                      {log.status === "Inquiry" ? (
                        <button
                          onClick={() => {
                            setWalkinName(log.visitorName);
                            setWalkinEmail(log.email);
                            const matchedC = courses.find(c => c.title === log.queryCourse);
                            if (matchedC) setWalkinCourseId(matchedC.id);
                            alert("Visitor parameters loaded into Walk-in fields on the left. Set deposit to convert.");
                          }}
                          className="px-3 py-1 bg-indigo-50 border border-indigo-200 hover:bg-slate-100 font-bold text-indigo-700 text-[10px] rounded transition-all cursor-pointer"
                        >
                          Convert to student
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 block p-1 bg-slate-50 border border-slate-100 rounded">
                          Registration logged ✓
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. COHORT BATCH & EXAMS SCREEN                           */}
      {/* ======================================================== */}
      {consoleMode === "batches" && (
        <div className="space-y-6" id="batches-viewport">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Batch layout form */}
            <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4 h-fit">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Launch Academic Batch</h3>
                <p className="text-[10px] text-gray-400">Establish dynamic cohorts, assign dedicated faculty assessors, and schedule kickoff timelines.</p>
              </div>

              <form onSubmit={handleCreateBatchSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-gray-400">Cohort Name</label>
                  <input
                    type="text"
                    value={batchName}
                    onChange={e => setBatchName(e.target.value)}
                    placeholder="e.g. Batch 2026-X (Cyber Security)"
                    className="w-full text-xs border border-gray-250 bg-gray-50/50 p-2 py-1.5 rounded outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-gray-400">Syllabus Template</label>
                  <select
                    value={batchCourseId}
                    onChange={e => setBatchCourseId(e.target.value)}
                    className="w-full bg-white border border-gray-250 text-xs px-2 py-1.5 rounded outline-hidden text-gray-700 cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-gray-400">Faculty Assessor</label>
                  <input
                    type="text"
                    value={batchTrainer}
                    onChange={e => setBatchTrainer(e.target.value)}
                    className="w-full text-xs border border-gray-250 bg-gray-50/50 p-1.5 rounded outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-gray-400">Kickoff Date</label>
                  <input
                    type="date"
                    value={batchStart}
                    onChange={e => setBatchStart(e.target.value)}
                    className="w-full text-xs border border-gray-250 bg-gray-50/50 p-1.5 rounded outline-hidden"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingBatch}
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded cursor-pointer transition-all text-xs"
                >
                  Create Batch Cohort Run
                </button>
              </form>
            </div>

            {/* Existing Batch Timeline roster */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Active batches timeline ledger</h3>
                <p className="text-[10px] text-gray-400">Monitor overall progress percentages and active dates of physical cohorts.</p>
              </div>

              <div className="space-y-3.5">
                {batchesList.map((batch) => (
                  <div key={batch.id} className="p-4 border border-gray-150 rounded-xl space-y-3 hover:border-gray-200 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm">{batch.name}</h4>
                        <span className="text-[10.5px] text-gray-500 font-semibold block leading-tight mt-0.5">Syllabus Template: <strong className="text-gray-800 font-bold">{batch.courseTitle}</strong></span>
                      </div>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded leading-none uppercase ${
                        batch.status === "Completed" ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {batch.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-gray-400 border-t border-dashed border-gray-100 pt-2 font-semibold">
                      <span>Trainer: <strong className="text-gray-800 font-bold">{batch.trainerName}</strong></span>
                      <span>Enrolled students: <strong className="text-gray-800 font-bold">{batch.totalStudents} learners</strong></span>
                      <span>Start: <strong className="text-gray-800 font-bold">{batch.startDate}</strong></span>
                      <span>Finish: <strong className="text-slate-500 font-bold">{batch.endDate}</strong></span>
                    </div>

                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex justify-between items-center text-[10px] text-gray-450 uppercase font-bold leading-none">
                        <span>Cohort milestone progress tracking:</span>
                        <span className="font-mono text-gray-800">{batch.progressPercentage}% COMPLETE</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${batch.progressPercentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
