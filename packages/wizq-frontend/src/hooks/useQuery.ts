import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import qs from 'qs';

/**
 * The hook works similar to useState but it's value is stored in the query string
 * // step contains the value of the query param 'step' ?step=value
 * // setStep sets the query param 'step' to the given value
 * const [step, setStep] = useQuery('step');
 */
export default function useQuery<T extends string>(paramName: string) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { push } = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const param = (query.get(paramName) as T | undefined) ?? undefined;

  const setParam = useCallback(
    (value: string) => {
      console.log('value', value);
      const params = qs.stringify(
        Object.fromEntries(
          Object.entries({
            ...query,
            [paramName]: value || undefined,
          }).sort(([a], [b]) => (a > b ? 1 : -1)),
        ),
      );

      const newPath = pathname + (params ? '?' : '') + params;

      void push(newPath);
    },
    [paramName, pathname, push, query],
  );

  return [param, setParam] as const;
}
