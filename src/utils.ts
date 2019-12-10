import { History, Search } from 'history';
import qs from 'query-string';
import mergeWith from 'lodash/mergeWith';
import omitBy from 'lodash/omitBy';

function _switchFilterKey(key: string): string {
  if (key.includes('filter[')) {
    const [, keyName] = key.match(/filter\[(\w*)\]/) ?? [];
    return keyName;
  }

  return `filter[${key}]`;
}

function _updateSearch(search: Search, values: Record<string, string | null>) {
  const existingValues = qs.parse(search, { arrayFormat: 'comma' });

  const finalValues = mergeWith(existingValues, values, (_, src: Array<string> | string | null) => {
    return Array.isArray(src) ? src : undefined;
  });

  return decodeURIComponent(
    qs.stringify(
      omitBy(finalValues, (v) => v == null),
      { arrayFormat: 'comma' },
    ),
  );
}

export function readUrl<T>(history: History): Partial<T> {
  const { search } = history.location;
  const urlValues = qs.parse(search, { arrayFormat: 'comma' });

  return Object.keys(urlValues).reduce(
    (memo, key) => ({
      ...memo,
      [_switchFilterKey(key)]: urlValues[key],
    }),
    {},
  );
}

export function setUrlValue<Filters>(history: History, key: keyof Filters, value: string | null) {
  const newValue = { [_switchFilterKey(key as string)]: value };
  const newSearch = _updateSearch(history.location.search, newValue);

  if (history.location.search.replace('?', '') !== newSearch) {
    history.push({ ...history.location, search: newSearch });
  }
}
