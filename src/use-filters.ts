import History from 'history';
import { useEffect, useState } from 'react';
import { Filter } from './types';
import { setUrlValue, toFilters } from './utils';

export type Navigate = (to: History.Location, options?: { replace: boolean }) => void;

export function useFilters<Keys extends string>(
  location: History.Location,
  navigate: Navigate,
  keys: Array<Keys>,
  options?: {
    persistenceKey: string;
  },
): { [K in Keys]: Filter } {
  const [filtersWereRestored, setFiltersWereRestored] = useState(false);

  useEffect(() => {
    if (options?.persistenceKey) {
      const urlSearchParams = new URLSearchParams(location.search);

      const toPersist = {} as { [key: string]: string[] };
      for (const key of keys) {
        const values = urlSearchParams.getAll(key);

        toPersist[key] = values;
      }

      localStorage.setItem(options.persistenceKey, JSON.stringify(toPersist));
    }
  }, [location.search]);

  if (options?.persistenceKey && !filtersWereRestored && location.search.includes('=')) {
    const previousFiltersSerialized = localStorage.getItem(options.persistenceKey);
    const previousFilters = (
      previousFiltersSerialized ? JSON.parse(previousFiltersSerialized) : {}
    ) as { [key: string]: string[] };

    const restoredUrlSearchParams = new URLSearchParams();
    for (const key of keys) {
      const values = previousFilters[key];

      if (values) {
        for (const value of values) {
          restoredUrlSearchParams.append(key, value);
        }
      }
    }

    // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
    setFiltersWereRestored(true);

    setUrlValue(location, navigate, restoredUrlSearchParams.toString());

    return toFilters(location, navigate, keys, restoredUrlSearchParams);
  } else {
    const urlSearchParams = new URLSearchParams(location.search);

    return toFilters(location, navigate, keys, urlSearchParams);
  }
}
