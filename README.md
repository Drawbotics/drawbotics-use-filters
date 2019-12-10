# Use Filters

Hook to read/set filter values from/in the url.

## Installation

```bash
$ npm i @drawbotics/use-filters
```

## Usage

### TypeScript

```tsx
import { useFilters } from '@drawbotics/use-filters';

interface Filters {
  filterKey: string;
  filterKey2: 'one-value' | 'another-value';
}

// ... inside a component ...
const { filterKey, filterKey2 } = useFilter<Filters>(
  history,
  ['filterKey', 'filterKey2'],
  (key, value) => `Updated ${key} with ${value}`,
);

// read a filter value
console.log(filterKey.value); // => filterValue

// or an array value
console.log(filterKey.values); // => [filterValue]

// set a value
filterKey.set('newValue');
```

## JavaScript

```jsx
import { useFilters } from '@drawbotics/use-filters';

// ... inside a component ...
const { filterKey, filterKey2 } = useFilter(
  history,
  ['filterKey', 'filterKey2'],
  (key, value) => `Updated ${key} with ${value}`,
);

// read a filter value
console.log(filterKey.value); // => filterValue

// or an array value
console.log(filterKey.values); // => [filterValue]

// set a value
filterKey.set('newValue');
```
