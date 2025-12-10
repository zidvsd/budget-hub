"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/types/users";
import { formatDate } from "@/lib/utils";
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
];
