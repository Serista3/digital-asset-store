import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface AlertDestructiveProps {
  error: Error;
}

export default function AlertDestructive({ error }: AlertDestructiveProps) {
  return (
    <Alert variant="destructive" className="w-fit">
      <AlertCircleIcon />
      <AlertTitle>{error.name}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
