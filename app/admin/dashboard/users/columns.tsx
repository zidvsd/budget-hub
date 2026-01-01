"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/types/users";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
  },

  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      {
        const phone = row.original.phone;
        return phone ? phone : "N/A";
      }
    },
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <span
          className={`${
            row.original.role === "admin"
              ? "text-white bg-accent rounded-full px-2"
              : ""
          }`}
        >
          {row.original.role}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      return formatDate(row.original.created_at);
    },
  },
  {
    accessorKey: "id",
    header: () => <div className="pl-2">View</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant={"nav"} className="border">
            <Link href={`/admin/dashboard/users/${row.original.id}`}>
              <Eye className="size-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
