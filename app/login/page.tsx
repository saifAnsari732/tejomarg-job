"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Logged in successfully!");
      
      // Fetch session to determine role and redirect
      const session = await getSession();
      const role = (session?.user as any)?.role;

      if (callbackUrl) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "employer") {
        router.push("/employer");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white dark:bg-slate-800 p-5 sm:p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Log in to your account to continue
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      {/* OR Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400 font-semibold">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold transition-all duration-200 cursor-pointer shadow-sm"
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.23 2.76 1.345 6.78l3.92 2.985z"
          />
          <path
            fill="#4285F4"
            d="M23.455 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.427a5.49 5.49 0 0 1-2.382 3.6l3.718 2.882c2.173-2.009 3.427-4.964 3.427-8.618z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235A7.07 7.07 0 0 1 4.909 12c0-.79.136-1.545.357-2.235L1.345 6.78A11.94 11.94 0 0 0 0 12c0 1.92.455 3.736 1.255 5.355l4.01-3.12z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.955-1.073 7.945-2.909l-3.718-2.882c-1.036.691-2.355 1.109-4.227 1.109-3.255 0-6.018-2.2-7.009-5.164L1.08 17.28A11.96 11.96 0 0 0 12 24z"
          />
        </svg>
        <span>Google</span>
      </button>

      <div className="text-center mt-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="text-slate-500 flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          Loading...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
