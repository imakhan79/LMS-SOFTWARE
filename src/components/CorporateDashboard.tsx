import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Award, ShieldCheck, Mail, Send, Check, Settings2, Globe, Sparkles } from "lucide-react";

interface Props {
  onAwardXp: (id: string, amount: number, badge: string) => void;
}

export default function CorporateDashboard({ onAwardXp }: Props) {
  const [bulkEmails, setBulkEmails] = useState("");
  const [selectedComplianceCourse, setSelectedComplianceCourse] = useState("course-2");
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  // White-Label configuration state
  const [customDomain, setCustomDomain] = useState("learn.sterling-aerospace.com");
  const [portalHexCode, setPortalHexCode] = useState("#2563eb");
  const [brandingTitle, setBrandingTitle] = useState("Sterling Aerospace Training");
  const [whiteLabelActive, setWhiteLabelActive] = useState(false);

  // Seed employees data
  const employees = [
    { name: "John Sterling", email: "john_h_corporate@lms.com", dept: "Engineering", trackingStatus: "Active", progress: 75, complianceScore: "95%" },
    { name: "Lana Vance", email: "lana_v@lms.com", dept: "Engineering", trackingStatus: "Active", progress: 40, complianceScore: "Pending" },
    { name: "Robert Chase", email: "robert@lms.com", dept: "Operations", trackingStatus: "Active", progress: 100, complianceScore: "92%" },
    { name: "Tariq Mahmood", email: "tariq@lms.com", dept: "QA Systems", trackingStatus: "In-Active", progress: 0, complianceScore: "In-complete" }
  ];

  // Radar/Bar Skills Gap Analysis data
  const skillsGapData = [
    { skill: "Cyber Defense", companyRequirement: 90, currentEmployeeAverage: 65 },
    { skill: "Neural Math", companyRequirement: 80, currentEmployeeAverage: 45 },
    { skill: "Distributed Dev", companyRequirement: 85, currentEmployeeAverage: 72 },
    { skill: "SLA Ingress Ops", companyRequirement: 95, currentEmployeeAverage: 88 }
  ];

  const handleBulkEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkEmails.trim()) return;
    const arrayCount = bulkEmails.split(",").filter(email => email.trim().length > 0).length;
    setBulkMessage(`Succesfully bulk-provisioned OAuth student profiles & enrolled ${arrayCount} employees in ${selectedComplianceCourse === "course-2" ? "Enterprise Cyber Security Architecture" : "SaaS Systems Scaling"}.`);
    setBulkEmails("");
    alert("Bulk licensing agreements successfully dispatched.");
  };

  const handleToggleWhiteLabelBranding = () => {
    setWhiteLabelActive(!whiteLabelActive);
    alert(whiteLabelActive ? "Custom White-Label configurations deactivated." : "White-label enterprise CSS assets deployed to subdomain registry.");
  };

  return (
    <div className="space-y-6" id="corporate-dashboard">
      {/* Title block */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-gray-900 tracking-tight">Corporate HR Learning Portal</h1>
          <p className="text-sm text-gray-500">Track company learning compliance pathways, evaluate skills gap analytics, and manage portal branding layouts.</p>
        </div>
        <div className="bg-indigo-50 px-3 py-1 text-indigo-700 text-xs font-semibold rounded-lg">
          Company Account: Sterling Aerospace Corp
        </div>
      </div>

      {whiteLabelActive && (
        <div className="p-4 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs border" style={{ backgroundColor: `${portalHexCode}15`, borderColor: portalHexCode, color: portalHexCode }}>
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> White-Label Ingress Active On: {customDomain} | Title: '{brandingTitle}'</span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white border rounded">Deploy Profile</span>
        </div>
      )}

      {/* Top statistical summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs text-left">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Employee Coverage</div>
          <p className="text-2xl font-sans font-bold text-gray-900 mt-1">4 Enrolled</p>
          <div className="text-[10px] text-gray-400">Engineering & Operations Depts</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs text-left">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Overall Compliance Ratio</div>
          <p className="text-2xl font-sans font-bold text-gray-900 mt-1">75.5% Passed</p>
          <div className="text-[10px] text-green-600 font-semibold">Requirement Threshold Clear</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs text-left">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active Skills Gap</div>
          <p className="text-2xl font-sans font-bold text-gray-900 mt-1">-18.4% Delta</p>
          <div className="text-[10px] text-red-600 font-semibold">Critical gap in Neural Mathematics</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Gap recharts bar chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-left space-y-4">
          <h3 className="font-bold text-gray-800 text-sm">Competency Skills Gap Analysis</h3>
          <p className="text-xs text-gray-400">Comparing required corporate skill indices (established by HR team) against actual real-time student aggregate exam results.</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsGapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="skill" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="companyRequirement" fill="#4338ca" name="Company Benchmark Code" />
                <Bar dataKey="currentEmployeeAverage" fill="#f59e0b" name="Employee Aggregate Performance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bulk Enrollment Component */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-left space-y-4 col-span-1">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Mail className="w-4.5 h-4.5 text-indigo-600" /> Bulk Employee Licensing & Ingress
          </h3>

          <form onSubmit={handleBulkEnrollment} className="space-y-4 text-xs font-semibold text-gray-600">
            <div>
              <label className="block mb-1">Target Compliance Curriculum</label>
              <select 
                value={selectedComplianceCourse}
                onChange={(e) => setSelectedComplianceCourse(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 bg-gray-50 rounded text-gray-800 outline-hidden"
              >
                <option value="course-2">Enterprise Cyber Security Architecture</option>
                <option value="course-3">SaaS Systems Scaling & Containers</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Employee Emails (Separate with commas)</label>
              <textarea 
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={3}
                placeholder="bob@company.com, sarah_hr@company.com, tariq@company.com"
                className="w-full text-xs p-2.5 border border-gray-200 bg-gray-50 rounded outline-hidden resize-none font-mono"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded flex items-center justify-center gap-1.5 cursor-pointer leading-relaxed text-xs shadow-xs"
            >
              <Send className="w-4.5 h-4.5" /> Dispatch Licensing
            </button>
          </form>

          {bulkMessage && (
            <div className="bg-green-50 p-3.5 border border-green-100 text-[11px] text-green-800 rounded leading-relaxed">
              ✓ {bulkMessage}
            </div>
          )}
        </div>
      </div>

      {/* White-label settings workspace */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-left space-y-4">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2">
          <Settings2 className="w-4.5 h-4.5 text-gray-600" /> White-Label LMS Branding Engine
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold text-gray-600">
          <div className="space-y-1.5">
            <label className="block">Corporate Custom Domain</label>
            <div className="flex">
              <span className="p-2 bg-gray-100 border border-gray-200 border-r-0 rounded-l text-gray-500 text-[11px]">https://</span>
              <input 
                type="text" 
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="flex-1 p-2 border border-gray-200 bg-gray-50 rounded-r text-gray-800 font-mono focus:border-indigo-500 outline-hidden" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block">Corporate Primary Color Code</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={portalHexCode}
                onChange={(e) => setPortalHexCode(e.target.value)}
                className="h-9 w-12 border border-gray-200 rounded p-0.5 cursor-pointer" 
              />
              <input 
                type="text" 
                value={portalHexCode}
                onChange={(e) => setPortalHexCode(e.target.value)}
                className="flex-1 p-2 border border-gray-200 bg-gray-50 rounded text-gray-800 font-mono focus:indigo-500 outline-hidden" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block">Portal Header Branding Title</label>
            <input 
              type="text" 
              value={brandingTitle}
              onChange={(e) => setBrandingTitle(e.target.value)}
              className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-gray-800 focus:border-indigo-500 outline-hidden" 
            />
          </div>
        </div>

        <button 
          onClick={handleToggleWhiteLabelBranding}
          className="px-6 py-2.5 bg-gray-900 border hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
        >
          {whiteLabelActive ? "Deploy Custom Branding" : "Trigger White-Label Visual Preview"}
        </button>
      </div>

      {/* Employees Directory Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden text-left">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-800">
          Company Employee Learning Directory
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-500">
            <thead className="bg-[#fcfcfd] border-b border-gray-100 uppercase text-[10px] font-bold text-gray-400">
              <tr>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Training Progress</th>
                <th className="px-6 py-4">Passing Rate Verification</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {employees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 font-medium">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{emp.name}</p>
                    <p className="text-gray-400">{emp.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{emp.dept}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 shrink-0 font-bold font-mono text-gray-700">{emp.progress}%</span>
                      <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: `${emp.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-1.5 py-0.5 rounded font-bold text-[10px] ${emp.complianceScore === 'Pending' ? 'bg-yellow-50 text-yellow-700' : emp.complianceScore === 'In-complete' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {emp.complianceScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${emp.trackingStatus === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {emp.trackingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
