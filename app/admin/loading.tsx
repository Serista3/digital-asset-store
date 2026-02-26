import { Spinner } from "@/components/ui/spinner";

export default function Loading(){
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Spinner className="size-6" />
      <span>Loading...</span>
    </div>
  )
}