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
  const [queryStringToRestore, setQueryStringToRestore] = useState<string | undefined>();
  const [queryStringWasRestored, setQueryStringWasRestored] = useState(false);

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
    if (queryStringToRestore != null && !queryStringWasRestored) {
      setUrlValue(location, navigate, queryStringToRestore);
      setQueryStringWasRestored(true);
    }
  }, [queryStringToRestore]);

  const locationSearch =
    options?.persistenceKey && !location.search.includes('=')
      ? localStorage.getItem(options.persistenceKey) || ''
      : location.search;

  const urlSearchParams = new URLSearchParams(locationSearch);

  if (queryStringToRestore != null) {
    setQueryStringToRestore(urlSearchParams.toString());
  }

  return toFilters(location, navigate, keys, urlSearchParams);
}
