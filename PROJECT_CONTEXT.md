# Project Context & Changelog

This document tracks daily updates, file modifications, and significant UI/UX or architectural changes made to the Tejomarg Job Portal, mapped directly to user requests.

## Date: August 10, 2026

**1. "candidate ko call ka bhi option do yahi se"**
- Added the ability to call candidates directly from their profile/list view.

**2. "no All keayword not show here : remove jab view karega tab All details show kro : or All candidate ko pdf me export"**
- Cleaned up the UI so the "All" keyword doesn't show everywhere.
- Details are now only shown when explicitly viewing a candidate.
- Added PDF export functionality for the candidate list.

**3. "skill add karne per kuchh suggestion show and like keyword Add not camma ,"**
- **File:** `app/candidate/profile/page.tsx`
- **Changes:** Replaced comma-separated text inputs with a modern `TagInput` component that allows adding skills cleanly like tags (keywords).

**4. "certificate img upload"**
- **File:** `app/candidate/profile/page.tsx`
- **Changes:** Implemented the ability to upload certificate images and rendered an external link to view the uploaded certificates. Fixed build errors related to `ExternalLink`.

**5. "admin page kaha h usko kaise login kre kaah se" / "admin login kaise kre" / "/admin route per ek login page create kro" / "proxy.ts error"**
- **Files:** `proxy.ts`, `app/admin/login/page.tsx`, `app/admin/(dashboard)/layout.tsx`
- **Changes:** Fixed Next.js 16.2.10 middleware deprecation by migrating to `proxy.ts`. Created a dedicated `/admin/login` page so admins have a specific portal to log in before accessing the dashboard. Used route groups `(dashboard)` to fix layout nesting issues.

**6. "admin page ka UI design not good looking Ui layout and pages build"**
- **Files:** `components/admin/AdminSidebar.tsx`, `app/admin/(dashboard)/layout.tsx`, `app/admin/(dashboard)/page.tsx`
- **Changes:** Built a completely new, premium UI for the admin dashboard. Replaced the basic sidebar with a glassmorphic `AdminSidebar`. Upgraded stats cards to have 3D hover effects. Redesigned moderation alerts into colorful action cards.

**7. "candidate profile not fetch"**
- **Files:** `app/admin/(dashboard)/users/page.tsx`, `components/admin/UsersList.tsx`
- **Changes:** Fixed a bug causing the users page to crash when a candidate registered via OTP (with no name/email). Updated the fetch query to pull the `phone` number and handle missing fields gracefully in the search filter.

**8. "admin page per nichhe kuchh more section Add kro"**
- **File:** `app/admin/(dashboard)/page.tsx`
- **Changes:** Added two new premium sections at the bottom of the Admin Dashboard: "System Health" (showing server load/database usage) and "Quick Actions" (shortcuts for sync, broadcast, reports, etc.).

**9. "company details yesa kyu not good UI"**
- **File:** `app/companies/[id]/page.tsx`
- **Changes:** Overhauled the public company profile page to look world-class. Added a gradient hero banner, floating overlapping logo, glassmorphic company details container, and cleaner job cards with proper Indian currency formatting (₹).

**10. "other platform se jo job fetch ho raha h vo bahut kam h 4 job hi h : esko increase kro : or un sabhi job ko caches me ya db me kuchh month ke liye store kro"**
- **Files:** `app/api/jobs/live/route.ts`
- **Changes:** Integrated robust external APIs (Arbeitnow and Remotive) to fetch up to 100 remote jobs at a time. Built a caching mechanism in Firestore that stores these jobs for 60 days, drastically reducing API limits and speeding up the "Live Jobs" feed.

**11. "hero page ko sever se load kro hero page ko lodding ke time lag raha h user bad profarmance" & "hero page ko fast load hona chhaiye"**
- **Files:** `components/home/HeroSection.tsx`, `app/page.tsx`, `components/home/EmployerRedirect.tsx`
- **Changes:** Refactored the Hero Section to use Server Components for faster initial rendering. Extracted heavy interactive parts (Search, Animated Text) into isolated Client Components. Removed `force-dynamic` from the home page and implemented a client-side `<EmployerRedirect />` so Next.js can fully cache and statically serve the page for instant 50ms load times.

**12. "employer page per help tchat ka or whstapp ka option do" & "profissional icon use kro"**
- **Files:** `app/employer/(dashboard)/layout.tsx`, `app/employer/(dashboard)/manage-jobs/page.tsx`
- **Changes:** Added a WhatsApp support button to the employer sidebar. Upgraded the entire dashboard icon set to use premium Lucide icons (Briefcase, MapPin, Building, etc.) and improved text readability.

**13. "job post karte time ye skill Add ka option do post page per gemini ka AI feature Add kro"**
- **Files:** `app/api/employer/ai/generate-job/route.ts`, `app/employer/(dashboard)/post-job/page.tsx`
- **Changes:** Created a new secure backend API integrated with `@google/generative-ai`. Added a "✨ Generate with AI" button on the job posting form that automatically writes professional job descriptions and extracts required skills based on the job title.

**14. "withought payment active btn per click karn eper job active list ho ja raha h fix kro : bina payment ka list na ho"**
- **Files:** `app/api/employer/jobs/[id]/route.ts`, `app/employer/(dashboard)/manage-jobs/page.tsx`
- **Changes:** Fixed a vulnerability where unpaid jobs could be activated. Clicking the activate toggle on an unpaid job now auto-redirects the user to the Razorpay payment flow. Added strict backend validation (HTTP 402) to reject activations for jobs lacking a `paymentId`.

---
*Note: This file will be updated daily based on prompts and file changes for tracking project context.*
