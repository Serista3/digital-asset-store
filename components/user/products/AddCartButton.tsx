'use client'

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function AddCartButton({ className }: { className?: string }){
  const { isSignedIn } = useAuth()

  return (
    <>
      {isSignedIn && (
        <Button className={cn("w-full z-3", className)}>
          <CirclePlus />
          <span>Add To Cart</span>
        </Button>
      )}
    </>
  )
}