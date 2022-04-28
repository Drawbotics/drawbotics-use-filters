import History from 'history';

import { useFilters, Navigate } from '../use-filters';
import { renderHook, act } from '@testing-library/react-hooks';

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
      const {
        result: { current: result },
      } = renderHook(() => useFilters(location, navigate, ['filterKey', 'filterKey2']));
      expect(result).toHaveProperty('filterKey');
      expect(result).toHaveProperty('filterKey2');
    });

    it('reads string values from the url that match the specified keys', () => {
      location.search = '?filterKey=filterValue';
      const {
        result: { current: result },
      } = renderHook(() => useFilters(location, navigate, ['filterKey']));

      expect(result.filterKey.value).toEqual('filterValue');
    });

    it('reads array values from the url that match the specified keys', () => {
      location.search = '?filterKey=filterValue1&filterKey=filterValue2';
      const {
        result: { current: result },
      } = renderHook(() => useFilters(location, navigate, ['filterKey']));
      expect(result.filterKey.values).toEqual(['filterValue1', 'filterValue2']);
    });

    it('ignores values in the url that do not match the specified keys', () => {
      location.search = '?filterKey2=filterValue1';
      const {
        result: { current: result },
      } = renderHook(() => useFilters(location, navigate, ['filterKey']));
      expect(result.filterKey.value).toBe(undefined);
    });

    it('sets a string value', () => {
      const { result, rerender } = renderHook(() =>
        useFilters(
          location,
          (to) => {
            navigate(to);
            rerender();
          },
          ['filterKey'],
        ),
      );

      act(() => {
        result.current.filterKey.set('filterValue');
      });

      expect(result.current.filterKey.value).toEqual('filterValue');
    });

    it('sets an array value', () => {
      const { result, rerender } = renderHook(() =>
        useFilters(
          location,
          (to) => {
            navigate(to);
            rerender();
          },
          ['filterKey'],
        ),
      );

      act(() => {
        result.current.filterKey.set(['filterValue', 'filterValue2']);
      });

      expect(result.current.filterKey.values).toEqual(['filterValue', 'filterValue2']);
    });

    it('deletes a value when passing null', () => {
      const { result, rerender } = renderHook(() =>
        useFilters(
          location,
          (to) => {
            navigate(to);
            rerender();
          },
          ['filterKey'],
        ),
      );

      act(() => {
        result.current.filterKey.set(['filterValue', 'filterValue2']);
      });

      expect(result.current.filterKey.values).toEqual(['filterValue', 'filterValue2']);

      act(() => {
        result.current.filterKey.set(null);
      });

      expect(result.current.filterKey.value).toBe(undefined);
      expect(result.current.filterKey.values).toBe(undefined);
    });

    it('encodes the value to URI acceptable symbols', () => {
      const { result } = renderHook(() => useFilters(location, navigate, ['filterKey']));

      act(() => {
        result.current.filterKey.set('+351');
      });

      expect(location.search).toEqual('?filterKey=%2B351');
    });

    it('decodes URI symbols into their original characters', () => {
      location.search = '?filterKey=%2B351';
      const { result } = renderHook(() => useFilters(location, navigate, ['filterKey']));
      expect(result.current.filterKey.value).toEqual('+351');
    });
  });
});
