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
    .map((segment, index, arr) => ({
      label: decodeURIComponent(segment)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      href: "/" + arr.slice(0, index + 1).join("/"),
    }));

  const finalLinks = links ?? autoLinks;
  if (finalLinks.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {finalLinks.map((link, index) => {
          // Logic: Only clickable if it has an href AND is NOT the last item
          const isLast = index === finalLinks.length - 1;
          const showLink = link.href && !isLast;

          return (
            <span key={index} className="flex items-center space-x-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {showLink ? (
                  <BreadcrumbLink asChild>
                    <Link href={link.href!}>{link.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
