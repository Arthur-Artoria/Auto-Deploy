import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function uuid() {
  return uuidv4();
}

export const useCustomContext = <T>(
  context: React.Context<T>
): NonNullable<T> => {
  const value = useContext(context);

  if (!value) throw new Error('context is null');

  return value as NonNullable<T>;
};
