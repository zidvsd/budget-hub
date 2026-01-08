"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadCrumbLink {
  label: string;
  href?: string;
}

interface BreadCrumbProps {
  links?: BreadCrumbLink[];
}

export function BreadCrumb({ links }: BreadCrumbProps) {
  const pathname = usePathname();

  const autoLinks: BreadCrumbLink[] = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => {
      const href = "/" + arr.slice(0, index + 1).join("/");

      return {
        label: decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        href,
      };
    });

  const finalLinks = links ?? autoLinks;

  if (finalLinks.length === 0) return null;

  // last breadcrumb should not be clickable
  finalLinks[finalLinks.length - 1].href = undefined;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {finalLinks.map((link, index) => (
          <span key={index} className="flex items-center space-x-2">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {link.href ? (
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{link.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
