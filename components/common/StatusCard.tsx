import Heading from "../typography/Heading";
import { Button } from "../ui/button";
import { CircleCheck, CircleX } from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  status: 'success' | 'warning' | 'error'
  title: string;
  description: React.ReactNode;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  className?: string;
}

export default function StatusCard({ 
  status, 
  title, 
  description, 
  primaryButtonText, 
  primaryButtonHref, 
  secondaryButtonText, 
  secondaryButtonHref, 
  className
}: StatusCardProps){
  return (
    <div className={cn(' border rounded-lg px-4 sm:px-6 py-12 flex flex-col items-center gap-6', className)}>
      {/* Status Icon */}
      {status === 'success' && <CircleCheck strokeWidth={0.5} className="size-24 text-green-600" />}
      {status === 'error' && <CircleX strokeWidth={0.5} className="size-24 text-red-600" />}

      <div className="flex flex-col items-center gap-2 w-full">
        {/* Heading */}
        <Heading level="2" className="line-clamp-none leading-12">{title}</Heading>

        {/* Description */}
        {description}

        <div className="flex flex-col gap-2.25 mt-4">
          {/* Primary Btn */}
          <Button asChild>
            <Link href={primaryButtonHref}>{primaryButtonText}</Link>
          </Button>

          {/* Secondary Btn */}
          <Button variant='outline' asChild>
            <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
