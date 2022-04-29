import History from 'history';
import { useEffect, useLayoutEffect, useState } from 'react';
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

  useLayoutEffect(() => {
    /*
      navigate method in React Router can only be called after the page page component finished rendering
      or the instruction will be ignored 
    */
    if (queryStringToRestore != null) {
      setUrlValue(location, navigate, queryStringToRestore);
      setQueryStringToRestore(undefined);
    }
  }, [queryStringToRestore]);

  const locationSearch =
    options?.persistenceKey && !filtersWereRestored && !location.search.includes('=')
      ? localStorage.getItem(options.persistenceKey) || ''
      : location.search;

  const urlSearchParams = new URLSearchParams(locationSearch);

  if (!filtersWereRestored) {
    setQueryStringToRestore(urlSearchParams.toString());

    setFiltersWereRestored(true);
  }

  return toFilters(location, navigate, keys, urlSearchParams);
}
