import { Search } from 'history';
import qs from 'query-string';
import mergeWith from 'lodash/mergeWith';
import omitBy from 'lodash/omitBy';
import { navigate } from './use-filters';
import History from 'history';

function _switchFilterKey(key: string): string {
  if (key.includes('filter[')) {
    const [, keyName] = key.match(/filter\[(\w*)\]/) ?? [];
    return keyName;
  }

  return `filter[${key}]`;
}

function _updateSearch(search: Search, values: { [key: string]: Array<string> | string | null }) {
  const existingValues = qs.parse(search, { arrayFormat: 'comma' });

  const finalValues = mergeWith(existingValues, values, (_, src: Array<string> | string) => {
    return Array.isArray(src) ? src : undefined;
  });

  return decodeURIComponent(
    qs.stringify(
      omitBy(finalValues, (v) => v == null),
      { arrayFormat: 'comma' },
    ),
  );
}

export function readUrl<T>(location: History.Location): Partial<T> {
  const { search } = location;
  const urlValues = qs.parse(search, { arrayFormat: 'comma' });

  return Object.keys(urlValues).reduce(
    (memo, key) => ({
      ...memo,
      [_switchFilterKey(key)]: urlValues[key],
    }),
    {},
  );
}

export function setUrlValue<Filters>(
  location: History.Location,
  navigate: navigate,
  key: keyof Filters,
  value: Array<string> | string | null,
): void {
  const newValue = { [_switchFilterKey(key as string)]: value };
  const newSearch = _updateSearch(location.search, newValue);

  if (location.search.replace('?', '') !== newSearch) {
    navigate({ ...location, search: '?' + newSearch });
  }
}
