import React, { useState } from "react";
import { BookOpen, ShoppingCart, Tag, Check, ArrowRight, ShieldCheck, HelpCircle, Star, Sparkles } from "lucide-react";
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

  return (
    <div className="space-y-6" id="marketplace">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h1 className="text-xl font-sans font-bold text-gray-900 tracking-tight">Dynamic Course Marketplace & Subscriptions</h1>
          <p className="text-sm text-gray-500">Purchase standalone courses with verified Stripe gateways or activate monthly unlimited developer plans.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Marketplace Catalog list */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 text-left">Available Courses ({courses.filter(c => c.published).length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.filter(c => c.published).map((course) => {
              const alreadyBought = enrolledCourseIds.includes(course.id);
              return (
                <div key={course.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs hover:border-gray-200 hover:shadow-sm transition-all flex flex-col justify-between text-left">
                  <div className="relative">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-40 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 right-3 bg-gray-900/80 text-white font-mono text-xs font-bold px-2 py-1 rounded">
                      ${course.price}
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{course.category}</span>
                        <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{course.difficulty}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="border-t border-gray-50 pt-3 flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold text-gray-700">4.9</span>
                        <span className="text-[10px] text-gray-400">(48 views)</span>
                      </div>

                      {alreadyBought ? (
                        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded flex items-center gap-1">
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
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
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
