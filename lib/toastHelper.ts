import { toast } from "react-hot-toast";

/**
 * Professional Error Toast Helper
 * Logs raw technical errors safely to console.error, while displaying clean, user-friendly messages.
 */
export const showProfessionalError = (err: any, fallbackMessage: string = "Unable to process request. Please try again later.") => {
  // Always log full technical error to browser console for developer debugging
  console.error("[Tejomarg System Error Log]:", err);
  
  if (!err) {
    toast.error(fallbackMessage);
    return;
  }

  const rawMessage = typeof err === "string" ? err : (err.message || "");

  // Clean, actionable user messages in English
  if (rawMessage === "Please enter a valid phone number" || rawMessage === "Please enter a valid 6-digit OTP") {
    toast.error(rawMessage);
    return;
  }

  if (rawMessage.includes("suspended") || rawMessage.includes("blocked")) {
    toast.error("This account has been suspended. Please contact support.");
    return;
  }

  if (rawMessage.includes("expired")) {
    toast.error("OTP has expired. Please request a new OTP.");
    return;
  }

  if (
    rawMessage.includes("Invalid OTP") ||
    rawMessage.includes("invalid-verification-code") ||
    rawMessage.includes("code-expired")
  ) {
    toast.error("Invalid OTP code. Please enter the correct 6-digit code.");
    return;
  }

  if (rawMessage.includes("too-many-requests")) {
    toast.error("Too many attempts. Please try again in a few minutes.");
    return;
  }

  // Never expose raw Firebase, reCAPTCHA, network, or technical code to user
  toast.error(fallbackMessage);
};

export const getCleanApiUrl = (endpoint: string): string => {
  let base = process.env.NEXT_PUBLIC_API_URL;
  if (!base || (!base.startsWith("http://") && !base.startsWith("https://"))) {
    if (typeof window !== "undefined") {
      base = `${window.location.origin}/api`;
    } else {
      base = "http://localhost:3000/api";
    }
  }
  const cleanBase = base.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
};
