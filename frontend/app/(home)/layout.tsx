import type { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "PlanIt",
  description:
    "Connect with top-tier event professionals across Kenya. Find verified vendors for weddings, corporate events, and more.",
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
      {children}
     
    </>
  );
}
