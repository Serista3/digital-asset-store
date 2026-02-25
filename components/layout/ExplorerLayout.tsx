import { cn } from "@/lib/utils";
import Heading from "../typography/Heading";

interface ExplorerLayoutProps {
  title: string;
  className?: string;
  children: React.ReactNode
}

export default function ExplorerLayout({ title, className, children }: ExplorerLayoutProps){
  return (
    <section className={cn("flex flex-col gap-12", className)}>
      <Heading>{title}</Heading>
      {children}
    </section>
  )
}