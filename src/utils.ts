import { Navigate } from './use-filters';
import History from 'history';

export function setUrlValue(
  location: History.Location,
  navigate: Navigate,
  newSearch: string,
): void {
  if (location.search.replace('?', '') !== newSearch) {
    navigate({ ...location, search: '?' + newSearch });
  }
}
