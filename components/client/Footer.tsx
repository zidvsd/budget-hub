"use client";
import Link from "next/link";
import { Facebook, Instagram, Mail, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted w-full mt-12">
      <div className="custom-container py-10">
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
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <li>
                <Link href="/account" className="hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
            <div className="flex items-center gap-4">
              <a
                aria-label="Facebook"
                href="#"
                className="text-neutral-600 dark:text-neutral-300 hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                aria-label="Instagram"
                href="#"
                className="text-neutral-600 dark:text-neutral-300 hover:text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                aria-label="Email"
                href="mailto:hello@gadyethub.com"
                className="text-neutral-600 dark:text-neutral-300 hover:text-white"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                aria-label="GitHub"
                href="https://github.com"
                className="text-neutral-600 dark:text-neutral-300 hover:text-white"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6 text-center text-xs text-neutral-400">
          © 2025 GadyetHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
