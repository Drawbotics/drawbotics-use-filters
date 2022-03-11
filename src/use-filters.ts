import History from 'history';
import { setUrlValue } from './utils';

export interface Filter {
  readonly value: string | undefined;
  readonly values: Array<string> | undefined;
  readonly set: (value: string | string[] | null) => void;
}

export type Navigate = (to: History.Location, options?: { replace: boolean }) => void;

export function useFilters<Keys extends string>(
  location: History.Location,
  navigate: Navigate,
  keys: Array<Keys>,
): { [K in Keys]: Filter } {
  const urlSearchParams = new URLSearchParams(location.search);

  return keys.reduce((memo, k) => {
    const key = k as Keys;

    const allValues = urlSearchParams.getAll(key);

    return {
      ...memo,
      [key]: {
        value: urlSearchParams.get(key) ?? undefined,
        values: allValues.length === 0 ? undefined : allValues,
        set: (value: string | string[] | null) => {
          if (Array.isArray(value)) {
            urlSearchParams.delete(key);

            for (const v of value) {
              urlSearchParams.append(key, v);
            }
          } else if (value == null) {
            urlSearchParams.delete(key);
          } else {
            urlSearchParams.set(key, value);
          }

          setUrlValue(location, navigate, urlSearchParams.toString());
        },
      },
    };
  }, {} as { [K in Keys]: Filter });
}
