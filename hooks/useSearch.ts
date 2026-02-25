import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useSearch() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const pathName = usePathname();

  const [value, setValue] = useState(searchParam.get('search') || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParam);

      if (value) params.set('search', value);
      else params.delete('search');

      router.replace(`${pathName}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

  return {
    value,
    setValue,
  };
}
