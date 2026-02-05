"use client";

import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "../animations/FadeIn";

export default function Cta() {
  return (
    <section className="py-16">
      {/* 1. Wrap the entire inner content in FadeIn */}
      <FadeIn direction="up" duration={0.6}>
        <div className="custom-container text-center space-y-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold">Ready to Upgrade Your Tech?</h1>
            <p className="text-xl text-neutral-500 dark:text-neutral-400">
              Join thousands of satisfied customers and discover the perfect
              gadgets for your lifestyle. Shop now and enjoy fast shipping,
              secure payments, and excellent customer service.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center px-4 gap-4 w-full sm:w-auto mt-8">
            <Link href={"/categories"} className="w-full sm:w-64">
              <Button size={"icon-lg"} variant={"accent"} className="w-full">
                Browse All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href={"/search"} className="w-full sm:w-64">
              <Button size={"icon-lg"} variant={"secondary"} className="w-full">
                Search Products
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
