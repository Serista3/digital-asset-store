import { ActionState } from '@/types';

interface FormErrorProps {
  state: ActionState;
}

export default function FormError({ state }: FormErrorProps) {
  return (
    <ul className="rounded-lg p-4 mt-4 border border-gray-600 flex flex-col gap-2">
      {state.errors?.map((err) => (
        <div key={err.message} className="text-red-600">
          {err.message}
        </div>
      ))}
    </ul>
  );
}
