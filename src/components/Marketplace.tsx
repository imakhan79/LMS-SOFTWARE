import React, { useState, useEffect } from "react";
import { BookOpen, ShoppingCart, Tag, Check, ArrowRight, ShieldCheck, HelpCircle, Star, Sparkles, Search, Briefcase, Target, Award, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Course } from "../types";

interface Props {
  courses: Course[];
  enrolledCourseIds: string[];
  onEnrollCourse: (courseId: string) => void;
  onRefreshEnrollments: () => void;
}

export default function Marketplace({
  courses, enrolledCourseIds, onEnrollCourse, onRefreshEnrollments
}: Props) {
  const [cartCourse, setCartCourse] = useState<Course | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [selectedGateway, setSelectedGateway] = useState<"Stripe" | "PayPal" | "Direct Bank">("Stripe");
  const [checkoutEmail, setCheckoutEmail] = useState("student@lms.com");
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Semantic search and filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  
  const [semanticResults, setSemanticResults] = useState<Record<string, {
    matchScore: number;
    careerFitReason: string;
    targetedSkills: string[];
    suitabilityRating: string;
  }>>({});
  const [overallAnalysis, setOverallAnalysis] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const presetQueries = [
    { label: "Become Full-Stack Architect", query: "Become a Full-Stack developer with cloud and database query optimization knowledge" },
    { label: "AI & LLM Developer", query: "Acquire Deep Learning & Prompt Engineering skills for building AI products" },
    { label: "SecOps Security Analyst", query: "Master penetration testing, SAML authentication, and threat modeling" },
    { label: "DevOps Cloud Lead", query: "Transition from monolithic applications to containerized microservice ingress systems" }
  ];

  // Dynamic lists
  const categoriesList = ["All", ...Array.from(new Set(courses.map(c => c.category)))];
  const difficultiesList = ["All", "Beginner", "Intermediate", "Advanced"];

  const handleSemanticSearch = async (queryParam?: string, catParam?: string, diffParam?: string) => {
    setSearchLoading(true);
    const activeQuery = queryParam !== undefined ? queryParam : searchQuery;
    const activeCat = catParam !== undefined ? catParam : selectedCategory;
    const activeDiff = diffParam !== undefined ? diffParam : selectedDifficulty;

    try {
      const res = await fetch("/api/ai/marketplace-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeQuery,
          category: activeCat,
          difficulty: activeDiff
        })
      });
      const data = await res.json();
      if (data.results) {
        const resultsMap: Record<string, any> = {};
        data.results.forEach((r: any) => {
          resultsMap[r.courseId] = {
            matchScore: r.matchScore,
            careerFitReason: r.careerFitReason,
            targetedSkills: r.targetedSkills,
            suitabilityRating: r.suitabilityRating
          };
        });
        setSemanticResults(resultsMap);
        setHasSearched(true);
      }
      if (data.overallAnalysis) {
        setOverallAnalysis(data.overallAnalysis);
      }
    } catch (err) {
      console.error("Semantic search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    handleSemanticSearch(searchQuery, selectedCategory, selectedDifficulty);
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSemanticSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    handleSemanticSearch("", selectedCategory, selectedDifficulty);
  };

  // Hardcoded subscription configurations
  const membershipPlans = [
    { title: "Standard Monthly Access", price: 29, description: "Unlimited entry to Beginner category courses" },
    { title: "Ultimate Enterprise Licensing", price: 199, description: "Full multi-portal certification access, live Zooms under dr Sarah Jenkins" }
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = couponCode.toUpperCase();
    if (normalized === "SUMMER50") {
      setAppliedDiscount(50);
      alert("Discount 'SUMMER50' applied: 50% discount registered.");
    } else if (normalized === "AI_REVOLUTION_75") {
      setAppliedDiscount(75);
      alert("Discount 'AI_REVOLUTION_75' applied: 75% discount registered.");
    } else {
      alert("Coupon invalid or expired catalog parameters.");
      setAppliedDiscount(0);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartCourse) return;

    const baseAmount = cartCourse.price;
    const finalAmount = appliedDiscount > 0 ? baseAmount - (baseAmount * appliedDiscount) / 100 : baseAmount;

    try {
      // Create Transaction
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: checkoutEmail,
          amount: finalAmount,
          courseTitle: cartCourse.title,
          gateway: selectedGateway,
          couponCode: appliedDiscount > 0 ? couponCode : undefined
        })
      });

      // Create Enrollment
      onEnrollCourse(cartCourse.id);
      
      setCheckoutComplete(true);
      setTimeout(() => {
        setCartCourse(null);
        setCheckoutComplete(false);
        setCouponCode("");
        setAppliedDiscount(0);
        onRefreshEnrollments();
      }, 3000);

    } catch (err) {
      alert("Payment processing timed out. Please retry connections.");
    }
  };

  // Filter & Rank active course list
  const activeCatalogCourses = courses
    .filter(course => course.published)
    .filter(course => {
      if (selectedCategory !== "All" && course.category !== selectedCategory) return false;
      if (selectedDifficulty !== "All" && course.difficulty !== selectedDifficulty) return false;
      return true;
    })
    .map(course => {
      const match = semanticResults[course.id];
      return {
        ...course,
        matchScore: match ? match.matchScore : 100,
        careerFitReason: match ? match.careerFitReason : "",
        targetedSkills: match ? match.targetedSkills : [],
        suitabilityRating: match ? match.suitabilityRating : "High"
      };
    })
    // Sort courses by matchScore descending (putting highest relevance at the top)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-6" id="marketplace">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h1 className="text-xl font-sans font-bold text-gray-900 tracking-tight">Dynamic Course Marketplace & Subscriptions</h1>
          <p className="text-sm text-gray-500">Purchase standalone courses with verified Stripe gateways or activate monthly unlimited developer plans.</p>
        </div>
      </div>

      {/* AI-Powered Semantic Discovery & Core Filtering Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs text-left space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              AI-Powered Semantic Matcher & Discoverer
            </h2>
            <p className="text-xs text-gray-500">Describe your career objective or specific technical skill gap, and Gemini will instantly highlight and rank the best-fit courses.</p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type career paths or skill gaps (e.g. 'I want to become a Cloud Ingress architect but have a skill gap in container security')..."
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-lg pl-9 pr-8 py-3 text-xs text-gray-800 font-normal outline-hidden transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-3.5 p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-700 text-xs transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-lg text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
            >
              {searchLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              {searchLoading ? "Analyzing..." : "Discover Match"}
            </button>
          </div>

          {/* Quick Query Recommendations / Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block select-none">Or select one of our curated career blueprints:</span>
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(p.query);
                    handleSemanticSearch(p.query, selectedCategory, selectedDifficulty);
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-800 rounded-lg text-[10.5px] transition-all cursor-pointer font-semibold flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Traditional Filters */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold select-none">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" /> Filter Criteria:
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">LMS Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-200 hover:border-gray-400 text-xs px-2.5 py-1.5 rounded-lg outline-hidden font-medium text-gray-700 cursor-pointer min-w-[130px]"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Difficulty Index:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-gray-200 hover:border-gray-400 text-xs px-2.5 py-1.5 rounded-lg outline-hidden font-medium text-gray-700 cursor-pointer min-w-[110px]"
              >
                {difficultiesList.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Gemini Overall Evaluation Analysis Panel */}
        {overallAnalysis && !searchLoading && (
          <div className="bg-linear-to-r from-indigo-50/40 via-purple-50/20 to-emerald-50/20 border border-indigo-100/60 p-4 rounded-xl flex items-start gap-3 shadow-xs">
            <Target className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded">
                AI Career Advisor Summary
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                {overallAnalysis}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Marketplace Catalog list */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center pb-1">
            <h2 className="text-base font-bold text-gray-800 text-left flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Catalog Matches ({activeCatalogCourses.length})
            </h2>
            {searchQuery && (
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold font-sans uppercase">
                Ranked by Relevancy
              </span>
            )}
          </div>
          
          {searchLoading ? (
            <div className="py-20 text-center text-gray-400 italic text-xs animate-pulse flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-gray-100">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <span>Analyzing catalog competencies and matching skill gaps with Gemini...</span>
            </div>
          ) : activeCatalogCourses.length === 0 ? (
            <div className="bg-white border border-gray-150 text-gray-400 text-xs text-center p-12 rounded-xl leading-relaxed">
              No courses matched your active filter criteria. Try broader keywords or change filters!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCatalogCourses.map((course) => {
                const alreadyBought = enrolledCourseIds.includes(course.id);
                
                // Color configuration of relevance badge
                let suitabilityColor = "bg-rose-50 text-rose-700 border-rose-200/60";
                if (course.matchScore >= 80) {
                  suitabilityColor = "bg-emerald-50 text-emerald-850 border-emerald-250 font-bold";
                } else if (course.matchScore >= 60) {
                  suitabilityColor = "bg-indigo-50 text-indigo-850 border-indigo-250 font-bold";
                }

                return (
                  <div key={course.id} className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-2xs hover:border-indigo-350 hover:shadow-xs transition-all flex flex-col justify-between text-left">
                    <div className="relative">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-40 object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 right-3 bg-gray-900/80 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-sm">
                        ${course.price}
                      </span>

                      {/* Score display */}
                      {searchQuery && (
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-sm text-[10px] border flex items-center gap-1 ${suitabilityColor} shadow-xs`}>
                          🎯 {course.matchScore}% Fit
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9.5px] font-bold uppercase bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded-sm">{course.category}</span>
                          <span className="text-[9.5px] font-bold uppercase bg-gray-150 text-gray-650 px-2 py-0.5 rounded-sm">{course.difficulty}</span>
                        </div>
                        <h3 className="font-bold text-gray-950 text-sm md:text-base leading-snug line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{course.description}</p>
                        
                        {/* Dynamic Career Reason from Gemini Match */}
                        {searchQuery && course.careerFitReason && (
                          <div className="bg-slate-50/50 p-3 rounded-lg border border-gray-200/50 text-[11px] text-gray-600 leading-relaxed italic">
                            <span className="font-bold text-indigo-700 not-italic block mb-0.5">🧠 Career Alignment Fit:</span>
                            "{course.careerFitReason}"
                          </div>
                        )}

                        {/* Targeted Skills Pill boxes */}
                        {searchQuery && course.targetedSkills && course.targetedSkills.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Targeted skills path:</span>
                            <div className="flex flex-wrap gap-1">
                              {course.targetedSkills.map((sk, skIdx) => (
                                <span key={skIdx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-semibold px-2 py-0.5 rounded">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-150 pt-3 flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-gray-800">4.9</span>
                          <span className="text-[10px] text-gray-400 font-semibold">(48 studies)</span>
                        </div>

                        {alreadyBought ? (
                          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-200/50 select-none">
                            <Check className="w-3.5 h-3.5" /> Enrolled
                          </span>
                        ) : (
                          <button 
                            onClick={() => {
                              setCartCourse(course);
                              setCheckoutComplete(false);
                              setAppliedDiscount(0);
                              setCouponCode("");
                            }}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Purchase
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Membership subscription panel side list */}
        <div className="lg:col-span-1 space-y-4 text-left">
          <h2 className="text-base font-semibold text-gray-800">SaaS Membership Plans</h2>
          <div className="space-y-4">
            {membershipPlans.map((plan, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-3 hover:border-gray-200 transition-all">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500" /> {plan.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-tight mt-0.5">{plan.description}</p>
                </div>
                <div className="font-sans font-bold text-xl text-gray-800">
                  ${plan.price} <span className="text-xs text-gray-400 font-medium">/ month</span>
                </div>
                <button 
                  onClick={() => alert("Enterprise sandbox subscription complete. Unlimited access granted.")}
                  className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  Activate License
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Gateway checkout Modal */}
      {cartCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden max-w-md w-full p-6 text-left space-y-4 relative">
            <button 
              onClick={() => setCartCourse(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-bold transition-all"
            >
              ✕
            </button>

            {checkoutComplete ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Payment Processed Successfully!</h3>
                  <p className="text-xs text-gray-500 mt-1">Generating student profile, allocating coursework, and dispatching SAML token.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <ShoppingCart className="w-4.5 h-4.5 text-blue-600" /> Secure Checkout Gateway
                  </h3>
                  <p className="text-[10.5px] text-gray-400 mt-0.5">{cartCourse.title}</p>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-semibold text-gray-600">
                  <div>
                    <label className="block mb-1">Purchaser Email Address</label>
                    <input 
                      type="email" 
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 bg-gray-50 rounded text-gray-800 font-medium"
                      required
                    />
                  </div>

                  {/* Apply Coupon code form */}
                  <div className="space-y-1.5">
                    <label className="block">Coupons (Try "SUMMER50" or "AI_REVOLUTION_75")</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="ENTER CODE"
                        className="flex-1 p-2 border border-gray-200 bg-gray-50 rounded outline-hidden uppercase font-mono" 
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyCoupon}
                        className="bg-gray-800 hover:bg-black text-white font-bold px-3 rounded cursor-pointer uppercase text-[10px]"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Pricing summaries calculations */}
                  <div className="bg-gray-50 p-3.5 rounded border border-gray-100 space-y-1.5">
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Course Standard Cost:</span>
                      <span className="font-mono">${cartCourse.price}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-red-600 font-bold">
                        <span>Dynamic Coupon Discount:</span>
                        <span className="font-mono">-{appliedDiscount}%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-1.5">
                      <span>Total Invoice Due (USD):</span>
                      <span className="font-mono text-sm text-blue-600">
                        ${appliedDiscount > 0 ? cartCourse.price - (cartCourse.price * appliedDiscount) / 100 : cartCourse.price}
                      </span>
                    </div>
                  </div>

                  {/* Gateway selector */}
                  <div>
                    <label className="block mb-1">Select Gateway Provider</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Stripe", "PayPal", "Direct Bank"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setSelectedGateway(g as any)}
                          className={`p-2.5 rounded border text-center font-bold text-[10px] uppercase transition-all whitespace-nowrap cursor-pointer ${selectedGateway === g ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded flex items-center justify-center gap-1.5 cursor-pointer leading-7 text-xs shadow-xs"
                  >
                    Authorize Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
