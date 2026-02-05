import { Suspense } from "react";
import Hero from "@/components/client/home/Hero";
import Cta from "@/components/client/Cta";
import Categories from "@/components/client/home/Categories";
import FeatureBar from "@/components/client/home/FeatureBar";
import FeaturedProducts from "@/components/client/home/FeaturedProducts";
export default function page() {
  return (
    <main>
      <Hero />
      <FeatureBar />

      <div className="custom-container">
        <Categories />
      </div>

      <Suspense fallback={<div>Loading featured products...</div>}>
        <FeaturedProducts />
      </Suspense>

      <div className="bg-muted dark:bg-sidebar w-full">
        <Cta />
      </div>
    </main>
  );
}
