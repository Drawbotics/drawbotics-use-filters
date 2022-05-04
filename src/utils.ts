import { Navigate } from './use-filters';
import History from 'history';
import { Filter } from './types';

export function setUrlValue(
  location: History.Location,
  navigate: Navigate,
  newSearch: string,
): void {
  if (location.search.replace('?', '') !== newSearch) {
    navigate({ ...location, search: '?' + newSearch });
  }
}

export function toFilters<Keys extends string>(
  location: History.Location,
  navigate: Navigate,
  keys: Array<Keys>,
  urlSearchParams: URLSearchParams,
) {
  const paramsObj = keys.reduce((memo, k) => {
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

  return paramsObj;
}
