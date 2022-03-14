import History from 'history';

import { useFilters, Navigate } from '../use-filters';

describe('drawbotics-use-filter/use-filters.ts', () => {
  describe('useFilters', () => {
    let location: History.Location;
    let navigate: Navigate;

    beforeEach(() => {
      location = {
        search: '',
        pathname: '',
      } as History.Location;
    });

    navigate = (to: History.Location) => Object.assign(location, to);

    it('returns an object with the specified keys', () => {
      const result = useFilters(location, navigate, ['filterKey', 'filterKey2']);
      expect(result).toHaveProperty('filterKey');
      expect(result).toHaveProperty('filterKey2');
    });

    it('reads string values from the url that match the specified keys', () => {
      location.search = '?filterKey=filterValue';
      const result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.value).toEqual('filterValue');
    });

    it('reads array values from the url that match the specified keys', () => {
      location.search = '?filterKey=filterValue1&filterKey=filterValue2';
      const result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.values).toEqual(['filterValue1', 'filterValue2']);
    });

    it('ignores values in the url that do not match the specified keys', () => {
      location.search = '?filterKey2=filterValue1';
      const result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.value).toBeNull();
    });

    it('sets a string value', () => {
      let result = useFilters(location, navigate, ['filterKey']);
      result.filterKey.set('filterValue');
      result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.value).toEqual('filterValue');
    });

    it('sets an array value', () => {
      let result = useFilters(location, navigate, ['filterKey']);
      result.filterKey.set(['filterValue', 'filterValue2']);
      result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.values).toEqual(['filterValue', 'filterValue2']);
    });

    it('deletes a value when passing null', () => {
      let result = useFilters(location, navigate, ['filterKey']);
      result.filterKey.set(['filterValue', 'filterValue2']);

      result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.values).toEqual(['filterValue', 'filterValue2']);

      result.filterKey.set(null);
      result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.value).toBeNull();
      expect(result.filterKey.values?.length).toBe(0);
    });

    it('encodes the value to URI acceptable symbols', () => {
      let result = useFilters(location, navigate, ['filterKey']);
      result.filterKey.set('+351');
      expect(location.search).toEqual('?filterKey=%2B351');
    });

    it('decodes URI symbols into their original characters', () => {
      location.search = '?filterKey=%2B351';
      const result = useFilters(location, navigate, ['filterKey']);
      expect(result.filterKey.value).toEqual('+351');
    });
  });
});
