import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  function handleScroll() {
    const categoriesSection = document.getElementById("categories");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <div className="custom-container space-y-2 py-8">
      <h1 className="text-3xl font-bold ">Discover the Latest</h1>
      <h1 className="text-3xl font-bold text-accent">Tech & Gadgets</h1>
      <p className="text-neutral-400">
        Explore our curated collection of cutting-edge technology and
        accessories
      </p>
      <div className="flex flex-col sm:flex-row sm:items-start items-center gap-2 ">
        <Link href="/product/categories" className="flex items-center gap-2">
          <Button variant={"accent"} className="w-full sm:w-auto">
            Shop Now
            <ArrowRight />
          </Button>
        </Link>
        <Button
          onClick={handleScroll}
          variant={"nav"}
          className="w-full sm:w-auto"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}
