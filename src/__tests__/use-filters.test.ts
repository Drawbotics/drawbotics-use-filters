import { History, Location } from 'history';

import { useFilters } from '../use-filters';

describe('drawbotics-use-filter/use-filters.ts', () => {
  describe('useFilters', () => {
    let history: History;

    beforeEach(() => {
      history = {
        location: {
          search: '',
        },
        push(location: Location) {
          Object.assign(history.location, location);
        },
      } as History;
    });

    it('returns an object with the specified keys', () => {
      const result = useFilters(history, ['filterKey', 'filterKey2']);
      expect(result).toHaveProperty('filterKey');
      expect(result).toHaveProperty('filterKey2');
    });

    it('reads string values from the url that match the specified keys', () => {
      history.location.search = '?filter[filterKey]=filterValue';
      const result = useFilters(history, ['filterKey']);
      expect(result.filterKey.value).toEqual('filterValue');
    });

    it('reads array values from the url that match the specified keys', () => {
      history.location.search = '?filter[filterKey]=filterValue1,filterValue2';
      const result = useFilters(history, ['filterKey']);
      expect(result.filterKey.value).toEqual(['filterValue1', 'filterValue2']);
    });

    it('ignores values in the url that do not match the specified keys', () => {
      history.location.search = '?filter[filterKey2]=filterValue1';
      const result = useFilters(history, ['filterKey']);
      expect(result.filterKey.value).toBeNull();
    });

    it('sets a string value', () => {
      let result = useFilters(history, ['filterKey']);
      result.filterKey.set('filterValue');
      result = useFilters(history, ['filterKey']);
      expect(result.filterKey.value).toEqual('filterValue');
    });

    it('sets an array value', () => {
      let result = useFilters(history, ['filterKey']);
      result.filterKey.set(['filterValue', 'filterValue2']);
      result = useFilters(history, ['filterKey']);
      expect(result.filterKey.values).toEqual(['filterValue', 'filterValue2']);
    });

    it('deletes a value when passing null', () => {
      let result = useFilters(history, ['filterKey']);
      result.filterKey.set(['filterValue', 'filterValue2']);
      result = useFilters(history, ['filterKey']);
      expect(result.filterKey.value).toEqual(['filterValue', 'filterValue2']);
      result.filterKey.set(null);
      result = useFilters(history, ['filterKey']);
      expect(result.filterKey.value).toBeNull();
    });

    it('calls the callback when a value changes with the key and the value', () => {
      const spy = jest.fn();
      const result = useFilters(history, ['filterKey'], spy);
      result.filterKey.set(['filterValue', 'filterValue2']);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy.mock.calls[0][0]).toEqual('filterKey');
      expect(spy.mock.calls[0][1]).toEqual(['filterValue', 'filterValue2']);
    });
  });
});
