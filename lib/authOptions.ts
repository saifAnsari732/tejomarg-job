import { cookies } from "next/headers";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebaseAdmin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
        intendedRole: { label: "Intended Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) {
          throw new Error("Firebase ID Token is required for authentication.");
        }

        let phoneNumber = "";
        try {
          const { authAdmin } = await import("@/lib/firebaseAdmin");
          const decodedToken = await authAdmin.verifyIdToken(credentials.idToken);
          phoneNumber = decodedToken.phone_number || "";
        } catch (verifyErr: any) {
          console.error("[NextAuth Firebase ID Token Verification Error]:", verifyErr?.message || verifyErr);
          throw new Error("Invalid or expired OTP session. Please try again.");
        }
        if (!phoneNumber) {
          throw new Error("No phone number associated with this OTP");
        }

        const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
        const rawDigits = phoneNumber.replace(/\D/g, "").slice(-10);

        const usersRef = db.collection("users");
        let querySnapshot = await usersRef.where("phone", "==", formattedPhone).limit(1).get();
        if (querySnapshot.empty && rawDigits) {
          querySnapshot = await usersRef.where("phone", "==", rawDigits).limit(1).get();
        }

        let user: any = null;
        let userId = "";

        if (querySnapshot.empty) {
          // New user — create account
          const intendedRole = credentials.intendedRole || "candidate";
          const newUser = {
            name: "User " + rawDigits.slice(-4),
            phone: formattedPhone,
            role: intendedRole,
            isBlocked: false,
            createdAt: new Date().toISOString(),
          };
          const docRef = await usersRef.add(newUser);
          user = newUser;
          userId = docRef.id;
        } else {
          user = querySnapshot.docs[0].data();
          userId = querySnapshot.docs[0].id;

          const intendedRole = credentials.intendedRole || "candidate";
          if (user.role !== intendedRole) {
            await usersRef.doc(userId).update({ role: intendedRole });
            user.role = intendedRole;
          }
        }

        if (user.isBlocked) {
          throw new Error("Your account has been suspended.");
        }

        let companyLogo = null;
        if (user.role === "employer") {
          const companySnap = await db.collection("companies").where("employerId", "==", userId).limit(1).get();
          if (!companySnap.empty) {
            companyLogo = companySnap.docs[0].data().logo;
          }
        }

        return {
          id: userId,
          phone: user.phone,
          name: user.name,
          role: user.role,
          companyLogo: companyLogo,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const usersRef = db.collection("users");
          const email = user.email?.toLowerCase();
          if (email) {
            const querySnapshot = await usersRef.where("email", "==", email).limit(1).get();
            if (querySnapshot.empty) {
              await usersRef.add({
                name: user.name,
                email: email,
                role: "candidate",
                isBlocked: false,
                createdAt: new Date().toISOString(),
              });
            }
          }
        } catch (dbErr) {
          console.error("NextAuth Google signIn DB sync error:", dbErr);
          // Let NextAuth proceed
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
      }
      
      // Fetch DB role if not present
      if (!token.role && (token.email || token.phone)) {
        try {
          const usersRef = db.collection("users");
          let querySnapshot;
          if (token.email) {
            querySnapshot = await usersRef.where("email", "==", token.email.toLowerCase()).limit(1).get();
          } else if (token.phone) {
            querySnapshot = await usersRef.where("phone", "==", token.phone).limit(1).get();
          }
          
          if (querySnapshot && !querySnapshot.empty) {
            const dbUser = querySnapshot.docs[0].data();
            token.id = querySnapshot.docs[0].id;
            token.role = dbUser.role;
            token.phone = dbUser.phone;
            token.name = dbUser.name;
          }
        } catch (e) {
          console.error("JWT DB fetch error:", e);
        }
      }
      
      // Fetch company logo for employer if missing
      if (token.role === "employer" && !token.companyLogo) {
        try {
          const companySnap = await db.collection("companies").where("employerId", "==", token.id).limit(1).get();
          if (!companySnap.empty) {
            token.companyLogo = companySnap.docs[0].data().logo;
          }
        } catch (e) {
          console.error("JWT company logo fetch error:", e);
        }
      }
      
      // Allow dynamic session updates
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
        if (token.companyLogo) (session.user as any).companyLogo = token.companyLogo;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const base = baseUrl || process.env.NEXTAUTH_URL || "http://localhost:3000";
      const cleanBase = base.replace(/\/+$/, "");
      if (!url || typeof url !== "string") return cleanBase;
      if (url.startsWith("/")) return `${cleanBase}${url}`;
      try {
        if (url.startsWith("http://") || url.startsWith("https://")) {
          const parsed = new URL(url);
          if (parsed.origin === cleanBase) return url;
          return `${cleanBase}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
      } catch (e) {
        console.warn("[NextAuth Redirect Notice] Could not parse URL:", url);
      }
      return cleanBase;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-job-portal-platform",
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
export default authOptions;
