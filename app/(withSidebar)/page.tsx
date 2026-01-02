"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/client/home/Hero";
import Categories from "@/components/client/home/Categories";
import Link from "next/link";
import FeatureBar from "@/components/client/FeatureBar";
export default function page() {
  return (
    <div>
      <div className="custom-container">
        <Hero />
        <Categories />
      </div>
      <FeatureBar />
    </div>
  );
}
