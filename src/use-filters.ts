import { readUrl, setUrlValue } from './utils';
import History from 'history';

export interface Filter<FilterValue> {
  readonly value?: FilterValue | null;
  readonly values?: Array<FilterValue | null>;
  readonly set: (value: FilterValue | null) => void;
}

export type Navigate = (to: History.Location, options?: { replace: boolean }) => void;

export function useFilters<Filters extends Record<string, any>>(
  location: History.Location,
  navigate: Navigate,
  keys: Array<keyof Filters>,
  onChange?: (key: keyof Filters, value: string | null) => void,
): { [Key in keyof Filters]: Filter<Filters[Key]> } {
  const urlValues = readUrl<Filters>(location);

  const setFilter = (key: keyof Filters, value: string | null): void => {
    setUrlValue(location, navigate, key, value);
    onChange?.(key, value);
  };

  return keys.reduce(
    (memo, key) => ({
      ...memo,
      [key]: {
        value: urlValues[key] ?? null,
        values: Array.isArray(urlValues[key])
          ? urlValues[key].filter(Boolean)
          : [urlValues[key]].filter(Boolean),
        set: (value: unknown) => setFilter(key, value as string | null),
      },
    }),
    {} as { [Key in keyof Filters]: Filter<Filters[Key]> },
  );
}
