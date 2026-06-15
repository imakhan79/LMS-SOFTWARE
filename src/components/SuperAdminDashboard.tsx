import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, BookOpen, DollarSign, Activity, Terminal, Shield, 
  Settings2, Database, MessageSquare, Plus, Trash, Globe, Laptop, Smartphone
} from "lucide-react";
import { Course, User, AuditLog, Transaction } from "../types";

interface Props {
  stats: any;
  courses: Course[];
  users: User[];
  auditLogs: AuditLog[];
  transactions: Transaction[];
  onAddUser: (u: Partial<User>) => void;
  onAwardXp: (id: string, xp: number, badge: string) => void;
  onSystemBackup: () => void;
}

const systemSettings = {
  whiteLabelDomain: "portal.enterprise-lms.com"
};

export default function SuperAdminDashboard({
  stats, courses, users, auditLogs, transactions, onAddUser, onAwardXp, onSystemBackup
}: Props) {
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" as User["role"] });
  const [activeTab, setActiveTab ] = useState<"overview" | "users" | "security" | "settings">("overview");

  // Multi-Language Support Simulation state
  const [lmsLanguage, setLmsLanguage] = useState("English (US)");

  // Seed chart data
  const revenueTrend = [
    { name: "Jan", revenue: 12000, registrations: 110 },
    { name: "Feb", revenue: 18500, registrations: 140 },
    { name: "Mar", revenue: 24000, registrations: 210 },
    { name: "Apr", revenue: 31000, registrations: 280 },
    { name: "May", revenue: 47000, registrations: 450 },
    { name: "Jun", revenue: 65000, registrations: 620 }
  ];

  const deviceData = [
    { name: "Desktop", value: 5800 },
    { name: "Tablet", value: 1200 },
    { name: "Mobile", value: 3000 }
  ];

  const geographicData = [
    { name: "North America", value: 45 },
    { name: "Europe", value: 25 },
    { name: "Asia-Pacific", value: 20 },
    { name: "South America", value: 10 }
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    onAddUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      xp: 0,
      badges: []
    });
    setNewUser({ name: "", email: "", role: "student" });
    alert("Enterprise tenant/role generated successfully.");
  };

  return (
    <div className="space-y-6" id="superadmin-dashboard">
      {/* Title & Language Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-sans font-semibold text-gray-900 tracking-tight">Super Admin Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Multi-tenant systems control, role allocation, global telemetry, and security rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-600 font-medium">LMS Multi-Language:</span>
          <select 
            value={lmsLanguage} 
            onChange={(e) => setLmsLanguage(e.target.value)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 outline-hidden px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <option value="English (US)">English (US)</option>
            <option value="Español (ES)">Español (ES)</option>
            <option value="Français (FR)">Français (FR)</option>
            <option value="Deutsch (DE)">Deutsch (DE)</option>
            <option value="العربية (AR)">العربية (AR)</option>
          </select>
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-1">
        <button 
          onClick={() => setActiveTab("overview")}
          aria-label="View System Telemetry Overview"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === "overview" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"}`}
        >
          <Activity className="w-4 h-4" /> System Telemetry
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          aria-label="Manage User Roles and Accounts"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === "users" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"}`}
        >
          <Users className="w-4 h-4" /> Role Management
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          aria-label="View Security and Audit Log Entries"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === "security" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"}`}
        >
          <Shield className="w-4 h-4" /> Audit Logs & Security
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          aria-label="Configure Global System Preferences"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === "settings" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"}`}
        >
          <Settings2 className="w-4 h-4" /> Global Settings
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Quick Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
              <div className="flex justify-between items-center text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-sans font-bold text-gray-900">Rs. {stats.totalRevenue || 497}</p>
              <div className="text-xs text-green-600 font-semibold mt-1">↑ 24% vs Last Month</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
              <div className="flex justify-between items-center text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Platform Students</span>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-sans font-bold text-gray-900">{stats.totalStudents || 1}</p>
              <div className="text-xs text-blue-600 font-semibold mt-1">Active multi-tenancies</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
              <div className="flex justify-between items-center text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Courses</span>
                <BookOpen className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-sans font-bold text-gray-900">{stats.totalCourses || 3}</p>
              <div className="text-xs text-purple-600 font-semibold mt-1">2 Unpublished Drafts</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
              <div className="flex justify-between items-center text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Server Health</span>
                <Database className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-sans font-bold text-gray-900">99.98%</p>
              <div className="text-xs text-green-600 font-semibold mt-1">Ingress Proxy Active</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Charts */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
              <h2 className="text-base font-semibold text-gray-900 mb-4">SaaS Platform Sales Analytics</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="colorRevision" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevision)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geographic Representation */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Geographic Registration Share (%)</h2>
              <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-4">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={geographicData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {geographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {geographicData.map((g, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                      <span className="font-semibold text-gray-700">{g.name}:</span>
                      <span className="text-gray-500">{g.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Device usage */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">System Access Metrics by Device Agent</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Laptop className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Desktop Clients</p>
                  <p className="text-sm font-bold text-gray-800">58% (5,800 active sessions)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Smartphone className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Mobile Native PWA</p>
                  <p className="text-sm font-bold text-gray-800">30% (3,000 active sessions)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Globe className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tablets & WebViews</p>
                  <p className="text-sm font-bold text-gray-800">12% (1,200 active sessions)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Create User Form */}
          <form onSubmit={handleCreateUserSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Provision Role / Tenant Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-tight mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="e.g. David Mercer"
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-tight mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="e.g. parent@lms.com"
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-tight mb-1.5">Administrative Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-hidden bg-gray-50 text-gray-700"
                >
                  <option value="student">Student Account</option>
                  <option value="parent">Parent Account</option>
                  <option value="instructor">Instructor Account</option>
                  <option value="corporate">HR / Corporate Manager</option>
                  <option value="admin">Institutional Admin</option>
                  <option value="superadmin">Platform Super Admin</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Generate Account
            </button>
          </form>

          {/* User Directory Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-800">Secure Access Directory ({users.length} Active System Users)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-[#fcfcfd] border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Authorized Role</th>
                    <th className="px-6 py-4">Gamification Metrics (XP)</th>
                    <th className="px-6 py-4">Achievements Block</th>
                    <th className="px-6 py-4">Action Hook</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{usr.name}</div>
                        <div className="text-xs text-gray-400">{usr.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
                          usr.role === "superadmin" ? "bg-red-50 text-red-700" :
                          usr.role === "admin" ? "bg-purple-50 text-purple-700" :
                          usr.role === "instructor" ? "bg-emerald-50 text-emerald-700" :
                          usr.role === "parent" ? "bg-orange-50 text-orange-700" :
                          usr.role === "corporate" ? "bg-indigo-50 text-indigo-700" :
                          "bg-blue-50 text-blue-700"
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-gray-700 text-sm">
                        {usr.xp.toLocaleString()} XP
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {usr.badges.length === 0 ? (
                            <span className="text-xs text-gray-400">None yet</span>
                          ) : (
                            usr.badges.map((b, bIdx) => (
                              <span key={bIdx} className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 text-[10px] font-medium">🏷️ {b}</span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => onAwardXp(usr.id, 100, "Super Admin Award")}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                        >
                          +100 XP Spark
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Zero Trust Rules Info */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
            <Shield className="w-8 h-8 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 leading-tight">Hardened Zero-Trust Firestore Security Architectures</h3>
              <p className="text-xs text-blue-700 mt-1">
                The platform relies on attribute-based access control (ABAC). Writes verify relationships where only courses matched to an verified instructor or a registered corporate HR team are allowed update gates. PII variables are strictly isolated to authenticated profiles.
              </p>
            </div>
          </div>

          {/* Audit Logs Stream */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-gray-600" /> Active System Audit Logs [GMT Timezone]
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Real-time log tracing of multi-tenant administrative changes, purchases, and proctor exams.</p>
              </div>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-100 rounded-lg font-mono text-xs text-gray-700 bg-gray-50 p-4 divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-gray-400">[{log.timestamp.slice(11, 19)}]</span>{" "}
                    <span className="text-blue-600 font-semibold">{log.user}:</span>{" "}
                    <span className="text-gray-800 font-medium">{log.action}</span>
                  </div>
                  <div className="flex gap-3 text-[10px]">
                    <span className="bg-gray-200 text-gray-600 rounded px-1.5">ip: {log.ip}</span>
                    <span className={`rounded px-1.5 ${log.status === "Success" || log.status === "OK" ? "bg-green-100 text-green-700 font-semibold" : "bg-red-100 text-red-700"}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Global SaaS Settings & Multi-Tenant Branding</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Platform Settings</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-tight mb-1.5">SaaS Custom Domain URL</label>
                <input 
                  type="text" 
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 bg-gray-50"
                  defaultValue={systemSettings.whiteLabelDomain}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-tight mb-1.5">SAML/SSO Unified Authentication</label>
                <select className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 bg-gray-50 text-gray-700">
                  <option value="enabled">Active (Okta, Microsoft Azure, Google SSO IDP)</option>
                  <option value="disabled">Basic JWT Protocols Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Platform Backups & Exports</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Take snapshot backups of active PostgreSQL relational tables, student enrollments, exam question banks, and dynamic assets directly to cloud storage endpoints.
              </p>
              <button 
                onClick={onSystemBackup}
                type="button" 
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Database className="w-4 h-4 text-blue-400" /> Export SQLite / Firestore Snapshots (.JSON)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
