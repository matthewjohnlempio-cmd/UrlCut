"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const code = params?.code as string;

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("links") || "[]");

    const match = links.find((l: any) => l.code === code);

    if (match) {
      window.location.href = match.original;
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-600">
      Redirecting...
    </div>
  );
}