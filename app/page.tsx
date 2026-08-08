import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PopularSearches from "@/components/home/PopularSearches";
import JobPrepBanner from "@/components/home/JobPrepBanner";
import TrendingRoles from "@/components/home/TrendingRoles";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import EmployerCTA from "@/components/home/EmployerCTA";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user && (session.user as any).role === "employer") {
    redirect("/employer");
  }

  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-white">
        <HeroSection />
        <FeaturesSection />
        <PopularSearches />
        <JobPrepBanner />
        <TrendingRoles />
        <TestimonialsSection />
        <EmployerCTA />
      </main>

      <Footer />
    </>
  );
}

export const dynamic = "force-dynamic";
