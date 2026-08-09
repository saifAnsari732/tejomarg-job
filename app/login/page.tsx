"use client";

import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Phone, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

export default function CandidateLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendTimer, setResendTimer] = useState(30);

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
    // Clear any existing verifier if it got detached from DOM (e.g., during navigation or hot reload)
    if (typeof window !== "undefined") {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
        (window as any).recaptchaVerifier = undefined;
      }

      // Initialize fresh RecaptchaVerifier
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved automatically
        },
      });
    }

    return () => {
      // Cleanup on unmount
      if (typeof window !== "undefined" && (window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
        (window as any).recaptchaVerifier = undefined;
      }
    };
  }, []);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    try {
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
      const appVerifier = (window as any).recaptchaVerifier;
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      setResendTimer(30);
      toast.success("OTP sent securely via SMS!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP. Please try again.");
      if ((window as any).recaptchaVerifier) {
         (window as any).recaptchaVerifier.render().then((widgetId: any) => {
           (window as any).grecaptcha.reset(widgetId);
         });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !confirmationResult) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken(true);

      const res = await signIn("phone-otp", {
        redirect: false,
        idToken,
        intendedRole: "candidate",
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Login Successful!");

      const session = await getSession();
      const userRole = (session?.user as any)?.role;

      if (userRole === "employer") {
        toast.error("This number is registered as an Employer. Redirecting...");
        router.push("/employer/post-job");
      } else if (userRole === "admin") {
        router.push("/admin");
      } else {
        if (callbackUrl && !callbackUrl.includes("/login")) {
          router.push(callbackUrl);
        } else {
          router.push("/");
        }
      }
      router.refresh();
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("auth/user-disabled") || msg.includes("suspended")) {
        toast.error("Your account has been disabled. Please contact support.");
      } else if (msg.includes("auth/invalid-verification-code")) {
        toast.error("Invalid OTP code. Please try again.");
      } else {
        toast.error(msg || "Invalid OTP code");
      }
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div id="recaptcha-container"></div>
      
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Left Pane - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center shadow-2xl z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-slate-900/40 mix-blend-multiply z-10" />
        <img
          src="/candidate-bg.jpg"
          alt="Candidate Dashboard Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
        />
        
        <div className="relative z-20 text-center px-12 max-w-xl mx-auto flex flex-col items-center">
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
             <img src="/job2.png" alt="Tejomarg Icon" className="h-16 w-auto object-contain drop-shadow-lg" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Your next big career move starts here.
          </h2>
          <p className="text-lg text-slate-200 leading-relaxed font-medium drop-shadow-md">
            Join thousands of professionals finding dream roles through our AI-powered platform.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex justify-center items-center mb-8">
            <img src="/job1.png" alt="Tejomarg Icon" className="h-16 w-auto object-contain dark:invert" />
          </Link>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div
                key="phone-step"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 shadow-sm border border-blue-100 dark:border-blue-800/50">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Candidate Login
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Securely login or create an account with your phone number.
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
                        className="w-full pl-16 pr-4 py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneNumber.length !== 10}
                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/20 font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 group"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
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
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="mt-6 w-full flex items-center justify-center py-3 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all duration-200 shadow-sm"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-3" alt="Google" />
                    <span>Continue with Google</span>
                  </button>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500 font-medium">
                  Are you an Employer?{" "}
                  <Link href="/employer/login" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                    Employer Login →
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
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
                      className="w-full text-center text-3xl tracking-[0.5em] py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:tracking-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-4 focus:ring-indigo-500/20 font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
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
                    className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-all"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
