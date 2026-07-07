import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (user.isBlocked) {
          throw new Error("Your account has been suspended. Please contact support.");
        }

        if (!user.password) {
          throw new Error("This email is registered using Google Sign-In. Please log in using Google.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email?.toLowerCase() });
          
          if (!existingUser) {
            // Register new OAuth user as a candidate by default
            const newUser = await User.create({
              name: user.name,
              email: user.email?.toLowerCase(),
              role: "candidate",
              isBlocked: false,
            });
            user.id = newUser._id.toString();
            (user as any).role = newUser.role;
          } else {
            user.id = existingUser._id.toString();
            (user as any).role = existingUser.role;
          }
        } catch (dbErr) {
          console.error("NextAuth Google signIn DB sync error:", dbErr);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
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
      }
      return session;
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
