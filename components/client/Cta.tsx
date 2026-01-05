import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
export default function Cta() {
  return (
    <div className="bg-muted dark:bg-sidebar text-center  space-y-4 py-16">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold ">Ready to Upgrade Your Tech?</h1>
        <span className="text-xl text-neutral-500 dark:text-neutral-400">
          Join thousands of satisfied customers and discover the perfect gadgets
          for your lifestyle. Shop now and enjoy fast shipping, secure payments,
          and excellent customer service.
        </span>
      </div>
      <div className="flex flex-col sm:flex-row mx-auto w-fit gap-4">
        <Link href={"/categories"}>
          <Button variant={"accent"}>
            Browse All Product
            <ArrowRight />
          </Button>
        </Link>
        <Link href={"/search"}>
          <Button variant={"secondary"}>Search Products</Button>
        </Link>
      </div>
    </div>
  );
}
