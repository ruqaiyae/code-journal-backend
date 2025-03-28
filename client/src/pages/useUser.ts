import { useContext } from 'react';
import { UserContext, UserContextValues } from './userContext';

export function useUser(): UserContextValues {
  const values = useContext(UserContext);
  if (!values) {
    throw new Error('useUser must be used inside a UserProvider');
  }
  return values;
}
