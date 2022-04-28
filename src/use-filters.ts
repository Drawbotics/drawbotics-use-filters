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
      localStorage.setItem(options.persistenceKey, location.search);
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
    const previousLocationSearch = localStorage.getItem(options.persistenceKey) || '';

    const restoredUrlSearchParams = new URLSearchParams(previousLocationSearch);

    // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
    setFiltersWereRestored(true);

    setQueryStringToRestore(restoredUrlSearchParams.toString());

    return toFilters(location, navigate, keys, restoredUrlSearchParams);
  } else {
    const urlSearchParams = new URLSearchParams(location.search);

    return toFilters(location, navigate, keys, urlSearchParams);
  }
}
