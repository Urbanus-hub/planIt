import { Metadata } from "next";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import CategoryShowcase from "@/components/layout/CategoryShowcaseSection";
import FeaturedVendors from "@/components/layout/FeaturedVendors";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
     
      <CategoryShowcase/>
      <FeaturedVendors/>
      <Footer />
 
    </main>
  );
}
