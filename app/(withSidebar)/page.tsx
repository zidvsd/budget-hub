"use client";

import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Suspense } from "react";
import Hero from "@/components/client/home/Hero";
import Cta from "@/components/client/Cta";
import Categories from "@/components/client/home/Categories";
import FeatureBar from "@/components/client/home/FeatureBar";
import FeaturedProducts from "@/components/client/home/FeaturedProducts";
export default function page() {
  return (
    <div>
      <Hero />
      <FeatureBar />

      <div className="custom-container">
        <Categories />
      </div>
      <Suspense>
        <FeaturedProducts />
      </Suspense>
      <Cta />
    </div>
  );
}
