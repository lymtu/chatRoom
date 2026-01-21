"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!localToken) {
      router.push("/signIn");
    }
  }, [router]);

  return (
    <main className="min-h-screen">
      <div>
        
      </div>
      {id}
      <Textarea className="resize-none" />
    </main>
  );
}
