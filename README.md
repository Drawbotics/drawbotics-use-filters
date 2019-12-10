# Use Filters

Hook to read/set filter values from/in the url.

## Installation

```bash
$ npm i @drawbotics/use-filters
```

## Usage

### TypeScript

```tsx
interface Filters {
  filterKey: string;
  filterKey2: 'one-value' | 'another-value';
}

// ... inside a component ...
const { filterKey, filterKey2 } = useFilter(
  history,
  ['filterKey', 'filterKey2'],
  (key, value) => `Updated ${key} with ${value}`,
);

// read a filter value
console.log(filterKey.value);

// or an array value
console.log(filterKey.values);

// set a value
filterKey.set('newValue');
```
