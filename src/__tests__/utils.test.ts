// @ts-nocheck
import { Location } from 'history';

import { readUrl, setUrlValue } from '../utils';

describe('drawbotics-use-filter/utils.ts', () => {
  describe('readUrl', () => {
    it('reads the values in the url and return them with the right name', () => {
      const location = {
        search: '?filter[filterKey]=filterValue&filter[filterKey2]=filterValue1,filterValue2',
      } as Location;
      const result = readUrl(location);
      expect(result).toMatchObject({
        filterKey: 'filterValue',
        filterKey2: ['filterValue1', 'filterValue2'],
      });
    });
  });

  describe('setUrlValue', () => {
    it('writes the value to the url with the right name', () => {
      const navigateSpy = jest.fn();
      const location = {
        search: '',
      };

      setUrlValue(location, navigateSpy, 'filterKey', 'filterValue');
      expect(navigateSpy.mock.calls[0][0].search).toEqual('filter[filterKey]=filterValue');
    });

    it('handle correctly array values', () => {
      const navigateSpy = jest.fn();
      const location = {
        search: '',
      };

      setUrlValue(location, navigateSpy, 'filterKey', ['filterValue1', 'filterValue2']);

      expect(navigateSpy.mock.calls[0][0].search).toEqual(
        'filter[filterKey]=filterValue1,filterValue2',
      );
    });

    it('does not delete existing values', () => {
      const navigateSpy = jest.fn();
      const location = {
        search: '?filter[filterKey]=filterValue1,filterValue2',
      };

      setUrlValue(location, navigateSpy, 'filterKey2', 'filterValue3');

      expect(navigateSpy.mock.calls[0][0].search).toEqual(
        'filter[filterKey2]=filterValue3&filter[filterKey]=filterValue1,filterValue2',
      );
    });

    it('updates correctly an existing value', () => {
      const navigateSpy = jest.fn();
      const location = {
        search: '?filter[filterKey]=filterValue',
      };

      setUrlValue(location, navigateSpy, 'filterKey', 'filterValue2');

      expect(navigateSpy.mock.calls[0][0].search).toEqual('filter[filterKey]=filterValue2');
    });

    it('does not update the query string if the new value is equal to the current one', () => {
      const navigateSpy = jest.fn();
      const location = {
        search: '?filter[filterKey]=filterValue',
      };

      setUrlValue(location, navigateSpy, 'filterKey', 'filterValue');

      expect(navigateSpy.mock.calls.length).toEqual(0);
    });
  });
});
