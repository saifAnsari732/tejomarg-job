import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TopCompanies from "@/components/home/TopCompanies";
import PopularSearches from "@/components/home/PopularSearches";
import JobPrepBanner from "@/components/home/JobPrepBanner";
import TrendingRoles from "@/components/home/TrendingRoles";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-white">
        <HeroSection />
        <TopCompanies />
        <PopularSearches />
        <JobPrepBanner />
        <TrendingRoles />
        <TestimonialsSection />
      </main>

      <Footer />
    </>
  );
}

export const dynamic = "force-dynamic";
