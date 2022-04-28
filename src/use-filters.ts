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
  const [queryStringToRestore, setQueryStringToRestore] = useState<string | undefined>();

  useEffect(() => {
    if (options?.persistenceKey && location.search.includes('=')) {
      const urlSearchParams = new URLSearchParams(location.search);

      const toPersist = {} as { [key: string]: string[] };
      for (const key of keys) {
        const values = urlSearchParams.getAll(key);

        toPersist[key] = values;
      }

      localStorage.setItem(options.persistenceKey, JSON.stringify(toPersist));
    }
  }, [location.search]);

  useEffect(() => {
    /*
      navigate method in React Router can only be called after the page page component finished rendering
      or the instruction will be ignored 
    */
    if (queryStringToRestore != null) {
      setUrlValue(location, navigate, queryStringToRestore);
    }
  }, [queryStringToRestore]);

  if (options?.persistenceKey && !filtersWereRestored && !location.search.includes('=')) {
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

    setQueryStringToRestore(restoredUrlSearchParams.toString());

    return toFilters(location, navigate, keys, restoredUrlSearchParams);
  } else {
    const urlSearchParams = new URLSearchParams(location.search);

    return toFilters(location, navigate, keys, urlSearchParams);
  }
}
