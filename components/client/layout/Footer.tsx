"use client";
import Link from "next/link";
import { Linkedin, Instagram, Mail, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-foreground dark:bg-muted w-full ">
      <div className="custom-container pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About Us</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              GadyetHub is a lightweight marketplace focused on curated
              electronics and accessories. We make shopping simple and secure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Categories</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <li>
                <Link href="/account">My Account</Link>
              </li>
              <li>
                <Link href="/shipping">Shipping Info</Link>
              </li>
              <li>
                <Link href="/returns">Returns</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
            <div className="flex items-center gap-4">
              <a
                aria-label="Linkedin"
                target="_blank"
                href="https://www.linkedin.com/in/rashid-visda/"
                className="text-neutral-600 dark:text-neutral-300 "
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                aria-label="Instagram"
                target="_blank"
                href="https://www.instagram.com/zidvsd/"
                className="text-neutral-600 dark:text-neutral-300 "
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                aria-label="Email"
                target="_blank"
                href="mailto:rashidvisda@gmail.com"
                className="text-neutral-600 dark:text-neutral-300 "
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                aria-label="GitHub"
                href="https://github.com/zidvsd"
                target="_blank"
                className="text-neutral-600 dark:text-neutral-300 "
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-300 dark:border-neutral-600 mt-8 pt-6 text-center text-xs text-neutral-400">
          © 2025 GadyetHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
