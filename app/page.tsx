import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PopularSearches from "@/components/home/PopularSearches";
import JobPrepBanner from "@/components/home/JobPrepBanner";
import TrendingRoles from "@/components/home/TrendingRoles";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import EmployerCTA from "@/components/home/EmployerCTA";
import EmployerRedirect from "@/components/home/EmployerRedirect";

export default function HomePage() {
  return (
    <>
      <EmployerRedirect />
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

