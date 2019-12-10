import { History, Location } from 'history';

import { readUrl, setUrlValue } from '../utils';

describe('drawbotics-use-filter/utils.ts', () => {
  describe('readUrl', () => {
    it('reads the values in the url and return them with the right name', () => {
      const history = {
        location: {
          search: '?filter[filterKey]=filterValue&filter[filterKey2]=filterValue1,filterValue2',
        },
      } as History;
      const result = readUrl(history);
      expect(result).toMatchObject({
        filterKey: 'filterValue',
        filterKey2: ['filterValue1', 'filterValue2'],
      });
    });
  });

  describe('setUrlValue', () => {
    it('writes the value to the url with the right name', () => {
      const pushSpy = jest.fn();
      const history = {
        location: { search: '' },
        push(location: Location) {
          pushSpy(location);
        },
      } as History;

      setUrlValue(history, 'filterKey', 'filterValue');
      expect(pushSpy.mock.calls[0][0].search).toEqual('filter[filterKey]=filterValue');
    });

    it('handle correctly array values', () => {
      const pushSpy = jest.fn();
      const history = {
        location: { search: '' },
        push(location: Location) {
          pushSpy(location);
        },
      } as History;

      setUrlValue(history, 'filterKey', ['filterValue1', 'filterValue2']);

      expect(pushSpy.mock.calls[0][0].search).toEqual(
        'filter[filterKey]=filterValue1,filterValue2',
      );
    });

    it('does not delete existing values', () => {
      const pushSpy = jest.fn();
      const history = {
        location: { search: '?filter[filterKey]=filterValue1,filterValue2' },
        push(location: Location) {
          pushSpy(location);
        },
      } as History;

      setUrlValue(history, 'filterKey2', 'filterValue3');

      expect(pushSpy.mock.calls[0][0].search).toEqual(
        'filter[filterKey2]=filterValue3&filter[filterKey]=filterValue1,filterValue2',
      );
    });

    it('updates correctly an existing value', () => {
      const pushSpy = jest.fn();
      const history = {
        location: { search: '?filter[filterKey]=filterValue' },
        push(location: Location) {
          pushSpy(location);
        },
      } as History;

      setUrlValue(history, 'filterKey', 'filterValue2');

      expect(pushSpy.mock.calls[0][0].search).toEqual('filter[filterKey]=filterValue2');
    });

    it('does not update the query string if the new value is equal to the current one', () => {
      const pushSpy = jest.fn();
      const history = {
        location: { search: '?filter[filterKey]=filterValue' },
        push(location: Location) {
          pushSpy(location);
        },
      } as History;

      setUrlValue(history, 'filterKey', 'filterValue');

      expect(pushSpy.mock.calls.length).toEqual(0);
    });
  });
});
