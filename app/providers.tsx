'use client';
 
import { ProgressProvider } from '@bprogress/next/app';
 
const Providers = ({ color = '#fff', children }: { color?: string, children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="3px"
      color={color}
      options={{ showSpinner: false }}
    >
      {children}
    </ProgressProvider>
  );
};
 
export default Providers;