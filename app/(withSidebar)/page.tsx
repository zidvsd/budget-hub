"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function page() {
  return (
    <div className="mt-8">
      <p>Welcome to our products page!</p>
    </div>
  );
}
