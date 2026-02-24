import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  btnText?: string;
  className?: string;
}

export default function SubmitButton({
  btnText = 'Submit',
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn('mt-6 text-black', className)}
      variant="outline"
      disabled={pending}
    >
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          <span>{btnText}...</span>
        </>
      ) : (
        btnText
      )}
    </Button>
  );
}
