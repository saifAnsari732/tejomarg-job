# Project Context & Deep Technical Architecture

This document tracks daily updates, system specifications, database models, API routes, authentication workflows, and architectural changes made to the Tejomarg Job Portal website.

---

## 🏗️ Web Platform Architecture & Stack

```
+-----------------------------------------------------------------------------------+
|                               NEXT.JS 16 WEB PORTAL                               |
|                         (App Router, React 19, Tailwind CSS)                      |
|                                                                                   |
|  +-----------------------+   +------------------------+   +--------------------+  |
|  | Server Components     |   | Proxy Middleware       |   | NextAuth Provider  |  |
|  | (Fast Static SSR Pages|   | (route rewrite/proxy)  |   | (phone-otp auth)   |  |
|  +-----------+-----------+   +-----------+------------+   +---------+----------+  |
+--------------|---------------------------|--------------------------|-------------+
               |                           |                          |
               v                           v                          v
+-----------------------------------------------------------------------------------+
|                              API LAYER & SERVICES                                 |
|                                                                                   |
|  +-----------------------------------+   +-------------------------------------+  |
|  | Next.js API Routes (/app/api/...) |   | External APIs Integration           |  |
|  | - Candidate Profile Routes        |   | - Arbeitnow Remote Jobs API         |  |
|  | - Employer Job Mgmt Routes        |   | - Remotive Jobs API                 |  |
|  | - Gemini 1.5 Generative AI Route  |   | - Razorpay Order & Webhook Sync     |  |
|  +-----------------+-----------------+   +------------------+------------------+  |
+--------------------|----------------------------------------|---------------------+
                     |                                        |
                     v                                        v
+-----------------------------------------------------------------------------------+
|                              PERSISTENCE & DATABASES                              |
|                                                                                   |
|  +----------------------+   +-----------------------+   +----------------------+  |
|  | MongoDB Atlas (Mongoose) | | Firestore (Caching)   |   | Firebase Admin Auth  |  |
|  | - Main Users/Jobs DB |   | - Live Jobs 60d Cache |   | - Token Decoding     |  |
|  +----------------------+   +-----------------------+   +----------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 🔒 Firebase Phone Authentication & reCAPTCHA Attestation Flow

### 1. **Client-Side Trigger (`signInWithPhoneNumber`)**
- **Libraries:** Modular Web Firebase SDK (`firebase/auth`)
- **Key Files:** `app/login/page.tsx`, `app/employer/login/page.tsx`, `app/admin/login/page.tsx`
- **Execution Pipeline:**
  1. User inputs 10-digit Indian phone number (`9999999999`). Sanitized to `+919999999999`.
  2. `createFreshRecaptchaVerifier("invisible")` creates verifier attached to `<div id="recaptcha-container">` inside the active form template.
  3. `await appVerifier.render()` executes the reCAPTCHA initialization lifecycle.
  4. `signInWithPhoneNumber(auth, formattedPhone, appVerifier)` triggers Google attestation.
  5. **Auto Fallback:** If invisible verification fails (`auth/captcha-check-failed` or `MALFORMED`), system catches exception, invokes `createFreshRecaptchaVerifier("normal")`, renders visible reCAPTCHA checkbox, and asks user to check the box.

### 2. **Server-Side Verification & NextAuth Session Creation**
- **Key File:** `lib/authOptions.ts`
- **Provider:** `phone-otp` CredentialsProvider
- **Execution Pipeline:**
  1. User enters 6-digit OTP -> `confirmationResult.confirm(otp)`.
  2. Firebase Client SDK returns signed `idToken` via `result.user.getIdToken(true)`.
  3. NextAuth `signIn("phone-otp", { idToken, intendedRole })` calls backend `authorize()`.
  4. `authAdmin.verifyIdToken(idToken)` decodes token using Google Public Keys, validating `phone_number`.
  5. If user exists, retrieves MongoDB/Firestore record; if user is new, provisions new profile document with `intendedRole`.
  6. Encrypts NextAuth JWT cookie and issues session token.

---

## 🗄️ Database Schemas & Models

### 1. **User Schema (MongoDB `users` / Firestore `users`)**
```typescript
interface IUser {
  _id: string;
  name?: string;
  email?: string;
  phone: string; // "+919876543210"
  role: 'candidate' | 'employer' | 'admin';
  isBlocked: boolean;
  companyLogo?: string; // Populated for employers if company profile exists
  createdAt: string; // ISO String
}
```

### 2. **Company Schema (`companies` collection)**
```typescript
interface ICompany {
  _id: string;
  employerId: string; // User ID reference
  companyName: string;
  employerName: string;
  industry: string;
  logo: string; // URL to logo
  website?: string;
  description: string;
  location: string;
  createdAt: string;
}
```

### 3. **Job Post Schema (`jobs` collection)**
```typescript
interface IJob {
  _id: string;
  employerId: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  jobType: string; // "Full-time", "Remote", etc.
  experienceLevel: string;
  salaryRange: { min: number; max: number; currency: string };
  description: string;
  skillsRequired: string[];
  isActive: boolean; // Enforced payment flag
  paymentId?: string; // Razorpay transaction ID
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
}
```

---

## 🔌 API Endpoints Matrix

| Route Path | Method | Purpose | Auth Level |
| :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | `GET/POST` | NextAuth Authentication & Session Management | Public |
| `/api/jobs/live` | `GET` | Dual-API Remote Jobs Feed with 60-day Firestore cache | Public |
| `/api/employer/ai/generate-job` | `POST` | Google Gemini 1.5 AI Job Description & Skill Extractor | Employer Session |
| `/api/employer/jobs/[id]/activate` | `POST` | Razorpay `paymentId` verification & job activation (HTTP 402 guard) | Employer Session |
| `/api/candidate/profile` | `GET/PUT` | Candidate Profile Builder, Resume & TagInput Skills Sync | Candidate Session |

---

## 📅 Recent Updates & Changelog

### **Date: September 19, 2026**

1. **Permanent Resolution: Visible Human reCAPTCHA (`size: "normal"`) & `isCaptchaSolved` Guard**
   - **Files:** `lib/firebase.ts`, `app/login/page.tsx`, `app/employer/login/page.tsx`, `app/admin/login/page.tsx`
   - **Deep Technical Discovery & Fix:**
     - **Discovery:** When `signInWithPhoneNumber` was called without the user having checked the reCAPTCHA box, Firebase JS SDK passed an empty token string (`recaptchaToken: ""`) to Google's Identity Toolkit backend. Google rejected this with `400: INVALID_APP_CREDENTIAL`.
     - **Resolution:** Added `isCaptchaSolved` state triggered by reCAPTCHA's `callback` function. The submit button displays clear guidance (*"Please check 'I'm not a robot' above"*) in Amber until checked, turning Royal Blue/Emerald (*"Send OTP"*) once verified.
     - Form submission strictly guards against un-clicked captchas (`if (!isCaptchaSolved) return`), ensuring Google always receives a verified human token.
     - Confirmed via backend API tests that Firebase API key (`AIzaSyAOxEDx2FtZHSdFQWfLlRO-ls7X4pPKtW0`) and project `tejomart-trade` accept requests from `http://localhost:3000/`, `http://localhost:8081/`, and `https://tejomargjobs.com/` with HTTP 200.

2. **Test Phone Number vs Real Phone Number Delivery Verification**
   - **Verified Numbers:** Firebase Console test numbers `9511450924` and `6388418731` (Fixed OTP `123456`) successfully receive `sessionInfo` and complete candidate/employer login instantly without SMS carrier charges or rate limits.
   - **Real Number SMS Policy:** Google Firebase enforces mandatory Cloud Billing (Blaze Plan) for real carrier SMS dispatch. When requests originate from unverified origins or when rapid attempts trigger fraud detection, Google returns `TOO_MANY_ATTEMPTS_TRY_LATER` (30-minute cooldown).
   - **Error Handling Upgrades:** Detailed human-friendly toast messages differentiate `auth/too-many-requests`, `auth/invalid-app-credential`, `auth/invalid-phone-number`, and `auth/quota-exceeded`.

3. **reCAPTCHA Container Layout & Form Placement**
   - **Files:** `app/login/page.tsx`, `app/employer/login/page.tsx`, `app/admin/login/page.tsx`
   - **Changes:** Embedded `<div id="recaptcha-wrapper"><div id="recaptcha-container"></div></div>` inside the active form layout for clean lifecycle rendering.

4. **Professional Error Handling & Zero TypeScript Build Errors**
   - **Files:** `lib/toastHelper.ts`, `lib/firebase.ts`, `lib/authOptions.ts`
   - **Changes:** Updated `lib/firebase.ts` with explicit fallback configuration pointing to project `tejomart-trade` and API Key `AIzaSyAOxEDx2FtZHSdFQWfLlRO-ls7X4pPKtW0`. Verified NextAuth `phone-otp` authorize provider with Firebase Admin SDK `authAdmin.verifyIdToken`. Executed `npx tsc --noEmit` passing cleanly with 0 compilation errors.

---

### **Date: September 17, 2026**

1. **Fast2SMS OTP Delivery & Route 996 / 999 Resolution**
   - **File:** `server/controllers/authController.js`
   - **Changes:** Refactored Fast2SMS SMS sending in Node.js Express backend using `URLSearchParams` (`Content-Type: application/x-www-form-urlencoded`). Bypassed status codes 996 & 999.

2. **Mobile App OTP Login Screen Redesign & Firebase SHA-1 Sync**
   - **Files:** `client/google-services.json`, `client/src/screens/auth/OTPLoginScreen.js`, `client/src/services/api.js`
   - **Changes:** Updated `google-services.json` with official EAS Android Upload Keystore SHA-1 certificate hash (`f0f9ddfe31f917aeab77575a0ab2378dbc643e4e`). Redesigned Expo mobile OTP verification screen with Royal Blue & Cyan glassmorphism theme. Replaced `react-native-modal` with standard RN `Modal`.

3. **TypeError: Failed to construct 'URL': Invalid URL & Toast Helper**
   - **Files:** `lib/toastHelper.ts`, `app/login/page.tsx`, `app/employer/login/page.tsx`, `app/admin/login/page.tsx`
   - **Changes:** Created `lib/toastHelper.ts` containing `getCleanApiUrl` (guarantees valid absolute URLs) and `showProfessionalError` (logs raw technical errors to `console.error` while presenting clean user messages).

---

### **Date: August 10, 2026**

1. **Candidate Profile & Skill Tags:** Replaced comma-separated text inputs with modern `TagInput` component. Added certificate image upload and candidate PDF export.
2. **Admin Dashboard Redesign:** Built glassmorphic `AdminSidebar`, 3D stat cards, system health monitors, and quick actions.
3. **External Job Cache:** Integrated Arbeitnow & Remotive APIs to fetch remote jobs, cached in Firestore for 60 days.
4. **Hero Performance:** Converted Hero Section to Server Components for 50ms instant loading.
5. **Gemini AI Integration:** Added `✨ Generate with AI` button on job posting form powered by `@google/generative-ai`.

---

## 🛠️ Deployment & Production Build

- **Production Domain:** `https://tejomargjobs.com`
- **MilesWeb Production Packaging:** Automated via `package-milesweb.ps1`, generating `tejomarg_milesweb_latest.zip`.
- **Render Backend API:** `https://tejomargjob-app-backend.onrender.com/api`

---
*Last Updated: September 19, 2026*
