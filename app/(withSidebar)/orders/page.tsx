"use client";
import { useParams } from "next/navigation";
import { BreadCrumb } from "@/components/client/BreadCrumb";
export default function page() {
  const params = useParams();
  return (
    <div className="custom-container">
      <h1>{params.id}</h1>
    </div>
  );
}
