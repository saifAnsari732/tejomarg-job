"use client";

import React, { useState, useEffect, useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Phone, ArrowRight, Loader2, Building, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import confetti from "canvas-confetti";
import { showProfessionalError, getCleanApiUrl } from "@/lib/toastHelper";

export default function EmployerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  useEffect(() => {
    if (typeof window !== "undefined" && !recaptchaVerifierRef.current) {
      try {
        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "normal",
          callback: () => {
            console.log("[reCAPTCHA] Solved successfully");
            setIsCaptchaSolved(true);
          },
          "expired-callback": () => {
            console.log("[reCAPTCHA] Solved token expired");
            setIsCaptchaSolved(false);
          },
        });
        verifier.render().catch((e) => console.error("[reCAPTCHA] Render error:", e));
        recaptchaVerifierRef.current = verifier;
      } catch (err) {
        console.error("[reCAPTCHA] Initialization error:", err);
      }
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch (e) {}
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!isCaptchaSolved) {
      toast.error("Please click the 'I am not a robot' checkbox first!");
      return;
    }
    
    setLoading(true);
    try {
      const sanitizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
      const formattedPhone = `+91${sanitizedPhone}`;
      
      let appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) {
        appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "normal",
          callback: () => {
            setIsCaptchaSolved(true);
          },
          "expired-callback": () => {
            setIsCaptchaSolved(false);
          },
        });
        await appVerifier.render();
        recaptchaVerifierRef.current = appVerifier;
      }

      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      setResendTimer(30);
      toast.success("OTP sent successfully! Please check your phone 📱");
    } catch (err: any) {
      console.error("[Firebase SMS Error]:", err?.message || err);
      setIsCaptchaSolved(false);
      if (typeof (window as any).grecaptcha !== "undefined") {
        try { (window as any).grecaptcha.reset(); } catch (e) {}
      }

      if (err?.code === "auth/too-many-requests") {
        toast.error("Too many attempts on this number. Please try again in 30 minutes or use a different number.");
      } else if (err?.code === "auth/invalid-phone-number") {
        toast.error("Please enter a valid 10-digit phone number.");
      } else if (err?.code === "auth/quota-exceeded") {
        toast.error("SMS service quota exceeded. Please try again later.");
      } else if (err?.code === "auth/invalid-app-credential") {
        toast.error("Verification failed (auth/invalid-app-credential). Please refresh the page and re-check the captcha.");
      } else {
        showProfessionalError(err, err?.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const originUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      if (!confirmationResult) {
        toast.error("OTP session expired. Please request a new OTP.");
        setStep("phone");
        setLoading(false);
        return;
      }

      // Verify OTP via Firebase Phone Auth
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken(true);

      const res = await signIn("phone-otp", {
        redirect: false,
        callbackUrl: originUrl,
        idToken,
        intendedRole: "employer",
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      // Trigger Confetti Animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#059669", "#3B82F6", "#F59E0B"], // Employer brand colors (Emerald focus)
      });

      toast.success("Login Successful!");

      const session = await getSession();
      const userRole = (session?.user as any)?.role;

      if (userRole === "candidate") {
        toast.error("This number is registered as a Candidate. Redirecting...");
        window.location.href = "/";
      } else if (userRole === "admin") {
        window.location.href = "/admin";
      } else {
        if (callbackUrl && !callbackUrl.includes("/login")) {
          window.location.href = callbackUrl;
        } else {
          window.location.href = "/employer/post-job";
        }
      }
    } catch (err: any) {
      showProfessionalError(err, "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 dark:bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-teal-400/20 dark:bg-teal-600/10 blur-3xl pointer-events-none" />

      {/* Left Pane - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center shadow-2xl z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/80 to-slate-900/40 mix-blend-multiply z-10" />
        <img
          src="/employer-bg.jpg"
          alt="Employer Dashboard Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
        />

        {/* Back Button (Desktop) */}
        <div className="absolute top-6 sm:top-10 left-6 sm:left-10 z-50">
          <Link href="/" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-800 to-rose-900  shadow-lg shadow-rose-500/25 transition-all group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
 
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-20 overflow-y-auto">
        {/* Back Button (Mobile) */}
        <div className="absolute top-6 left-6 z-50 lg:hidden">
          <Link href="/" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-900 to-rose-800 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25 transition-all group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center mt-12 sm:mt-0">
          {/* Mobile Logo */}
          {/* <Link href="/" className="lg:hidden flex justify-center items-center mb-8">
            <img src="/job1.png" alt="Tejomarg Icon" className="h-16 w-auto object-contain dark:invert" />
          </Link> */}

          <AnimatePresence mode="wait">
            {step === "phone" ? (
                <motion.div
                  key="phone-step"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="relative p-[3px] rounded-3xl overflow-hidden shadow-xl shadow-rose-500/10 dark:shadow-none group"
                >
                  <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#3b82f6_90%,#f43f5e_100%)]" />
                  <div className="relative bg-white dark:bg-slate-800 p-8 rounded-[21px] w-full h-full z-10 flex flex-col">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                    <img src="/icon.png" alt="Tejomarg Icon" className="h-11  object-contain" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Employer Login
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Securely login or create a company account with your phone number.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none border-r border-slate-200 dark:border-slate-700 pr-3">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="9999999999"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full pl-16 pr-4 py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div id="recaptcha-wrapper" className="flex justify-center my-3 min-h-[1px]">
                    <div id="recaptcha-container"></div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneNumber.length !== 10}
                    className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-bold transition-all duration-200 shadow-lg group ${
                      loading || phoneNumber.length !== 10
                        ? "bg-slate-400 cursor-not-allowed opacity-70"
                        : !isCaptchaSolved
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25 cursor-pointer"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25 cursor-pointer"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : !isCaptchaSolved && phoneNumber.length === 10 ? (
                      <span>Please check "I'm not a robot" above</span>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                      <span className="bg-white dark:bg-slate-800 px-3 text-slate-400">Or</span>
                    </div>
                  </div>
                
                </div>

                <p className="mt-6 text-center text-xs text-slate-500 font-medium">
                  Are you a Candidate?{" "}
                  <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold">
                    Candidate Login →
                  </Link>
                </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="relative p-[3px] rounded-3xl overflow-hidden shadow-xl shadow-teal-500/10 dark:shadow-none group"
              >
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#3b82f6_90%,#f43f5e_100%)]" />
                <div className="relative bg-white dark:bg-slate-800 p-8 rounded-[21px] w-full h-full z-10 flex flex-col">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-4 shadow-sm border border-teal-100 dark:border-teal-800/50">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Verify Number
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    We've sent a 6-digit code to <br />
                    <span className="font-bold text-slate-700 dark:text-slate-200">+91 {phoneNumber}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 text-center">
                      Enter OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full text-center text-3xl tracking-[0.5em] py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-0 focus:border-teal-500 dark:focus:border-teal-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:tracking-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:ring-4 focus:ring-teal-500/20 font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Verify & Login"
                    )}
                  </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-all"
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                  </button>
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                    }}
                    className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    ← Change Phone Number
                  </button>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trusted By Marquee */}
        <div className="w-full mx-auto mt-12 pt-8 border-t border-slate-200/60 relative z-20">
          <p className="text-slate-400 text-[10px] font-bold mb-4 uppercase tracking-widest text-center">Trusted by industry leaders</p>
          <div className="relative max-w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="inline-flex animate-marquee whitespace-nowrap">
              <div className="flex items-center gap-6 sm:gap-8 px-4"><BrandLogos /></div>
              <div className="flex items-center gap-6 sm:gap-8 px-4"><BrandLogos /></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function BrandLogos() {
  const partners = ["11.png", "2 (1).png", "3.png", "4.png", "5 (1).png", "5.png", "6.png", "TM24 png.png", "eco-kisan.webp"];
  return (
    <>
      {partners.map((img, idx) => (
        <div key={idx} className="relative h-10 sm:h-14 w-24 sm:w-32 flex items-center justify-center p-1">
          <img src={`/partner-image/${img}`} alt={`Partner ${idx + 1}`} className="max-h-full max-w-full object-contain filter drop-shadow-sm" loading="lazy" decoding="async" />
        </div>
      ))}
    </>
  );
}
