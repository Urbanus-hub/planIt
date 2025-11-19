import { Metadata } from "next";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import CategoryShowcase from "@/components/layout/CategoryShowcaseSection";
import FeaturedVendors from "@/components/layout/FeaturedVendors";
import HowItWorks from "@/components/layout/HowItWorks";
import WhyChoosePlanIt from "@/components/layout/WhyChoosePlanIt";
import Testimonials from "@/components/layout/Testimonials";
import CTA from "@/components/layout/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <CategoryShowcase />
      <FeaturedVendors />
      <HowItWorks />
      <WhyChoosePlanIt />
      <Testimonials />
      <CTA />

      {/* Ensure footer area uses same solid background */}
      <div className="bg-slate-50 dark:bg-slate-900">
        <Footer />
      </div>
    </main>
  );
}
